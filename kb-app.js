const appState = {
  currentNoteId: null,
  mode: "view",
  debounceTimer: null,
  theme: localStorage.getItem("kbTheme") || "dark"
};

const appContent = document.getElementById("app-content");
const sidebarNotes = document.getElementById("sidebar-notes");
const sidebarSearch = document.getElementById("sidebar-search");
const newNoteBtn = document.getElementById("new-note-btn");

function applyTheme() {
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(appState.theme);
}

function toggleTheme() {
  appState.theme = appState.theme === "dark" ? "light" : "dark";
  localStorage.setItem("kbTheme", appState.theme);
  applyTheme();
}

function renderHomePage() {
  appState.currentNoteId = null;
  appState.mode = "view";
  renderSidebar();

  const notes = getAllNotes().sort(function (a, b) {
    return b.updatedAt - a.updatedAt;
  });

  appContent.innerHTML = "";

  const hero = createElement("section", "home-hero");
  const kicker = createElement("span", "home-kicker", "PERSONAL WIKI");
  const title = createElement("h1", "", "Markdown Knowledge Base");
  const description = createElement(
    "p",
    "",
    "Write notes, organize ideas, search pages, preview markdown, and keep everything saved inside your browser."
  );
  const createButton = createElement("button", "primary-btn", "Create New Note");
  createButton.type = "button";
  createButton.addEventListener("click", createNewNote);
  hero.append(kicker, title, description, createButton);

  const recentSection = createElement("section", "recent-section");
  recentSection.appendChild(createElement("h2", "", "Recent Notes"));

  const grid = createElement("div", "note-grid");
  notes.forEach(function (note) {
    grid.appendChild(createNoteCard(note));
  });

  if (notes.length === 0) {
    grid.appendChild(createElement("p", "note-placeholder", "No notes yet. Create your first one."));
  }

  recentSection.appendChild(grid);
  appContent.append(hero, recentSection);
}

function createNoteCard(note) {
  const card = createElement("button", "note-card");
  card.type = "button";
  card.addEventListener("click", function () {
    navigateTo(`note/${note.id}`);
  });

  const title = createElement("h3", "", note.title);
  const meta = createElement("p", "", `${getWordCount(note.content)} words`);
  const date = createElement("small", "", `Updated ${new Date(note.updatedAt).toLocaleDateString()}`);

  card.append(title, meta, date);
  return card;
}

function renderNotePage(noteId) {
  appState.currentNoteId = noteId;
  appState.mode = "view";
  renderSidebar();

  const note = getNoteById(noteId);

  if (!note) {
    renderNotFound("This note does not exist.");
    return;
  }

  appContent.innerHTML = "";

  const pageHeader = createElement("div", "page-header");
  const titleWrap = createElement("div");
  titleWrap.append(
    createElement("h1", "", note.title),
    createElement("p", "muted-text", `Last updated: ${new Date(note.updatedAt).toLocaleString()}`)
  );

  const actions = createElement("div", "note-actions");
  actions.append(
    createActionButton("Edit", function () { navigateTo(`edit/${note.id}`); }),
    createActionButton("Export .md", function () { handleExport(note.id); }),
    createActionButton("Delete", function () { handleDelete(note.id); }, "danger-btn")
  );

  pageHeader.append(titleWrap, actions);

  const preview = createElement("article", "markdown-preview");
  preview.innerHTML = renderMarkdown(note.content);

  appContent.append(pageHeader, preview);
}

function renderEditPage(noteId) {
  appState.currentNoteId = noteId;
  appState.mode = "edit";
  renderSidebar();

  const note = getNoteById(noteId);

  if (!note) {
    renderNotFound("Cannot edit a note that does not exist.");
    return;
  }

  appContent.innerHTML = "";

  const shell = createElement("div", "editor-shell");
  const topbar = createElement("div", "editor-topbar");
  const titleInput = createElement("input", "note-title-input");
  titleInput.type = "text";
  titleInput.value = note.title;

  const actions = createElement("div", "editor-actions");
  const saveStatus = createElement("span", "save-status", "Saved");
  saveStatus.id = "save-status";
  actions.append(
    saveStatus,
    createActionButton("View", function () { navigateTo(`note/${note.id}`); }),
    createActionButton("Export", function () { handleExport(note.id); }),
    createActionButton("Delete", function () { handleDelete(note.id); }, "danger-btn")
  );

  topbar.append(titleInput, actions);

  const toolbar = renderToolbar();

  const layout = createElement("div", "editor-layout");
  const editorColumn = createElement("div", "editor-column");
  const textarea = createElement("textarea", "note-editor");
  textarea.id = "note-content-input";
  textarea.spellcheck = true;
  textarea.value = note.content;
  editorColumn.appendChild(textarea);

  const previewColumn = createElement("div", "preview-column");
  const preview = createElement("div", "markdown-preview");
  preview.id = "live-preview";
  previewColumn.appendChild(preview);
  layout.append(editorColumn, previewColumn);

  const footer = createElement("div", "editor-footer");
  const wordCount = createElement("span", "count-badge", `${getWordCount(note.content)} words`);
  const charCount = createElement("span", "count-badge", `${getCharCount(note.content)} characters`);
  const hint = createElement("span", "shortcut-hint", "Ctrl + E to toggle view/edit");
  wordCount.id = "word-count";
  charCount.id = "char-count";
  footer.append(wordCount, charCount, hint);

  shell.append(topbar, toolbar, layout, footer);
  appContent.appendChild(shell);

  updateLivePreview(note.content);

  [titleInput, textarea].forEach(function (field) {
    field.addEventListener("input", function () {
      updateLivePreview(textarea.value);
      handleAutoSave(titleInput, textarea);
    });
  });

  toolbar.querySelectorAll(".toolbar-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      wrapSelection(textarea, button.dataset.before, button.dataset.after);
      updateLivePreview(textarea.value);
      handleAutoSave(titleInput, textarea);
    });
  });
}

function createActionButton(label, onClick, extraClass = "") {
  const button = createElement("button", `action-btn ${extraClass}`.trim(), label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function renderNotFound(messageText) {
  appContent.innerHTML = "";
  appContent.append(
    createElement("h1", "", "Note Not Found"),
    createElement("p", "", messageText),
    createActionButton("Back Home", function () { navigateTo(""); }, "primary-btn")
  );
}

function renderSidebar(filteredNotes, searchQuery) {
  const isSearching = Boolean(searchQuery && searchQuery.trim());
  const notes = (filteredNotes || getAllNotes()).sort(function (a, b) {
    return b.updatedAt - a.updatedAt;
  });

  sidebarNotes.innerHTML = "";

  const homeButton = createElement("button", "home-link", "Home");
  homeButton.type = "button";
  homeButton.addEventListener("click", function () {
    navigateTo("");
  });

  const themeButton = createElement("button", "theme-toggle", `Theme: ${appState.theme}`);
  themeButton.type = "button";
  themeButton.addEventListener("click", function () {
    toggleTheme();
    renderSidebar(filteredNotes, searchQuery);
  });

  sidebarNotes.append(homeButton, themeButton);

  notes.forEach(function (note) {
    const button = createElement(
      "button",
      note.id === appState.currentNoteId ? "sidebar-note-link active-note" : "sidebar-note-link",
      note.title
    );
    button.type = "button";
    button.addEventListener("click", function () {
      navigateTo(`note/${note.id}`);
    });
    sidebarNotes.appendChild(button);
  });

  if (notes.length === 0 && isSearching) {
    sidebarNotes.appendChild(createElement("p", "note-placeholder", "No notes found."));
  }
}

function handleSearch(query) {
  renderSidebar(searchNotes(query), query);
}

function createNewNote() {
  const newNote = {
    id: generateId(),
    title: "Untitled Note",
    content: "# Untitled Note\n\nStart writing here...",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  saveNote(newNote);
  renderSidebar();
  navigateTo(`edit/${newNote.id}`);
}

function handleAutoSave(titleInput, contentInput) {
  const note = getNoteById(appState.currentNoteId);

  if (!note) {
    return;
  }

  document.getElementById("save-status").textContent = "Saving...";
  document.getElementById("word-count").textContent = `${getWordCount(contentInput.value)} words`;
  document.getElementById("char-count").textContent = `${getCharCount(contentInput.value)} characters`;

  clearTimeout(appState.debounceTimer);

  appState.debounceTimer = window.setTimeout(function () {
    note.title = titleInput.value.trim() || "Untitled Note";
    note.content = contentInput.value;
    saveNote(note);
    renderSidebar();
    document.getElementById("save-status").textContent = "Saved";
  }, 500);
}

function toggleMode() {
  if (!appState.currentNoteId) {
    return;
  }

  navigateTo(appState.mode === "view" ? `edit/${appState.currentNoteId}` : `note/${appState.currentNoteId}`);
}

function handleExport(id) {
  const note = getNoteById(id);

  if (!note) {
    return;
  }

  const fileName = note.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "note";

  const blob = new Blob([note.content], { type: "text/markdown" });
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download = `${fileName}.md`;
  downloadLink.click();
  URL.revokeObjectURL(downloadUrl);
}

function handleDelete(id) {
  const note = getNoteById(id);

  if (!note || !confirm(`Delete "${note.title}"? This cannot be undone.`)) {
    return;
  }

  deleteNote(id);
  renderSidebar();
  navigateTo("");
}

function startApp() {
  createStarterNotes();
  applyTheme();

  ROUTES.home = renderHomePage;
  ROUTES.note = renderNotePage;
  ROUTES.edit = renderEditPage;

  renderSidebar();

  sidebarSearch.addEventListener("input", function () {
    handleSearch(sidebarSearch.value);
  });

  newNoteBtn.addEventListener("click", createNewNote);

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key.toLowerCase() === "e") {
      event.preventDefault();
      toggleMode();
    }
  });

  handleRoute();
}

document.addEventListener("DOMContentLoaded", startApp);
