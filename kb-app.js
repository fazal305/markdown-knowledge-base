const appState = {
    currentNoteId: null,
    mode: 'view',
    debounceTimer: null,
    theme: localStorage.getItem('kbTheme') || 'dark'
};

/* Apply saved theme */

function applyTheme() {

    $('html').removeClass('dark light');
    $('html').addClass(appState.theme);

}

/* Toggle dark and light theme */

function toggleTheme() {

    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('kbTheme', appState.theme);

    applyTheme();

}

/* Render home page */

function renderHomePage() {

    appState.currentNoteId = null;
    appState.mode = 'view';

    renderSidebar();

    const notes = getAllNotes().sort(function (a, b) {
        return b.updatedAt - a.updatedAt;
    });

    let recentNotesHtml = '';

    notes.forEach(function (note) {

        recentNotesHtml += `
            <div class="col-md-4 mb-3">
                <div class="note-card" onclick="navigateTo('note/${note.id}')">
                    <h4>${escapeHtml(note.title)}</h4>

                    <p>
                        ${getWordCount(note.content)} words
                    </p>

                    <small>
                        Updated ${new Date(note.updatedAt).toLocaleDateString()}
                    </small>
                </div>
            </div>
        `;

    });

    $('#app-content').html(`
        <section class="home-hero">

            <span class="home-kicker">
                PERSONAL WIKI
            </span>

            <h1>
                Markdown Knowledge Base
            </h1>

            <p>
                Write notes, organize ideas, search your pages, preview markdown,
                and keep everything saved inside your browser.
            </p>

            <button class="btn btn-info" onclick="createNewNote()">
                Create New Note
            </button>

        </section>

        <section class="recent-section">

            <h2>
                Recent Notes
            </h2>

            <div class="row mt-4">
                ${recentNotesHtml}
            </div>

        </section>
    `);

}

/* Render note page */

function renderNotePage(noteId) {

    appState.currentNoteId = noteId;
    appState.mode = 'view';

    renderSidebar();

    const note = getNoteById(noteId);

    if (!note) {

        $('#app-content').html(`
            <h1>Note Not Found</h1>
            <p>This note does not exist.</p>

            <button class="btn btn-info" onclick="navigateTo('')">
                Back Home
            </button>
        `);

        return;

    }

    const renderedContent = renderMarkdown(note.content);

    $('#app-content').html(`
        <div class="page-header">
            <div>
                <h1>${note.title}</h1>

                <p class="text-muted">
                    Last updated:
                    ${new Date(note.updatedAt).toLocaleString()}
                </p>
            </div>

            <div class="note-actions">
                <button class="btn btn-outline-info btn-sm" onclick="navigateTo('edit/${note.id}')">
                    Edit
                </button>

                <button class="btn btn-outline-light btn-sm" onclick="handleExport('${note.id}')">
                    Export .md
                </button>

                <button class="btn btn-outline-danger btn-sm" onclick="handleDelete('${note.id}')">
                    Delete
                </button>
            </div>
        </div>

        <article class="markdown-preview">
            ${renderedContent}
        </article>
    `);

}

/* Render edit page */

function renderEditPage(noteId) {

    appState.currentNoteId = noteId;
    appState.mode = 'edit';

    renderSidebar();

    const note = getNoteById(noteId);

    if (!note) {

        $('#app-content').html(`
            <h1>Note Not Found</h1>
            <p>Cannot edit a note that does not exist.</p>

            <button class="btn btn-info" onclick="navigateTo('')">
                Back Home
            </button>
        `);

        return;

    }

    $('#app-content').html(`
        <div class="editor-shell">

            <div class="editor-topbar">

                <input
                    type="text"
                    id="note-title-input"
                    class="form-control note-title-input"
                    value="${note.title}">

                <div class="editor-actions">

                    <span id="save-status" class="save-status">
                        Saved
                    </span>

                    <button class="btn btn-outline-info btn-sm" id="view-note-btn">
                        View
                    </button>

                    <button class="btn btn-outline-light btn-sm" onclick="handleExport('${note.id}')">
                        Export
                    </button>

                    <button class="btn btn-outline-danger btn-sm" onclick="handleDelete('${note.id}')">
                        Delete
                    </button>

                </div>

            </div>

            ${renderToolbar()}

            <div class="editor-layout">

                <div class="editor-column">
                    <textarea
                        id="note-content-input"
                        class="note-editor"
                        spellcheck="true">${note.content}</textarea>
                </div>

                <div class="preview-column">
                    <div id="live-preview" class="markdown-preview"></div>
                </div>

            </div>

            <div class="editor-footer">

                <span class="badge text-bg-info" id="word-count">
                    ${getWordCount(note.content)} words
                </span>

                <span class="badge text-bg-secondary" id="char-count">
                    ${getCharCount(note.content)} characters
                </span>

                <span class="shortcut-hint">
                    Ctrl + E to toggle view/edit
                </span>

            </div>

        </div>
    `);

    updateLivePreview(note.content);

    $('#view-note-btn').on('click', function () {
        navigateTo(`note/${note.id}`);
    });

    $('#note-title-input, #note-content-input').on('input', function () {

        updateLivePreview($('#note-content-input').val());

        handleAutoSave();

    });

    $('.toolbar-btn').on('click', function () {

        const textarea = document.getElementById('note-content-input');

        const before = $(this).attr('data-before');
        const after = $(this).attr('data-after');

        wrapSelection(textarea, before, after);

        updateLivePreview(textarea.value);

        handleAutoSave();

    });

}

/* Render sidebar */

function renderSidebar(filteredNotes) {

    const notes = (filteredNotes || getAllNotes()).sort(function (a, b) {
        return b.updatedAt - a.updatedAt;
    });

    let sidebarHtml = `
        <button
            class="home-link"
            onclick="navigateTo('')">
            Home
        </button>

        <button
            class="theme-toggle"
            id="theme-toggle">
            Toggle Theme
        </button>
    `;

    notes.forEach(function (note) {

        const activeClass = note.id === appState.currentNoteId ? 'active-note' : '';

        sidebarHtml += `
            <button
                class="sidebar-note-link ${activeClass}"
                onclick="navigateTo('note/${note.id}')">
                ${note.title}
            </button>
        `;

    });

    $('#sidebar-notes').html(sidebarHtml);

    $('#theme-toggle').on('click', function () {
        toggleTheme();
    });

}

/* Handle search input */

function handleSearch(query) {

    const filteredNotes = searchNotes(query);

    renderSidebar(filteredNotes);

}

/* Create a new note */

function createNewNote() {

    const newNote = {
        id: generateId(),
        title: 'Untitled Note',
        content: '# Untitled Note\n\nStart writing here...',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    saveNote(newNote);

    renderSidebar();

    navigateTo(`edit/${newNote.id}`);

}

/* Autosave current note */

function handleAutoSave() {

    const note = getNoteById(appState.currentNoteId);

    if (!note) {
        return;
    }

    const newTitle = $('#note-title-input').val();
    const newContent = $('#note-content-input').val();

    $('#save-status').text('Saving...');

    $('#word-count').text(`${getWordCount(newContent)} words`);
    $('#char-count').text(`${getCharCount(newContent)} characters`);

    clearTimeout(appState.debounceTimer);

    appState.debounceTimer = setTimeout(function () {

        note.title = newTitle.trim() || 'Untitled Note';
        note.content = newContent;

        saveNote(note);

        renderSidebar();

        $('#save-status').text('Saved');

    }, 500);

}

/* Toggle between view and edit mode */

function toggleMode() {

    if (!appState.currentNoteId) {
        return;
    }

    if (appState.mode === 'view') {
        navigateTo(`edit/${appState.currentNoteId}`);
    } else {
        navigateTo(`note/${appState.currentNoteId}`);
    }

}

/* Export note as markdown file */

function handleExport(id) {

    const note = getNoteById(id);

    if (!note) {
        return;
    }

    const fileName = note.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'note';

    const blob = new Blob([note.content], {
        type: 'text/markdown'
    });

    const downloadUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');

    downloadLink.href = downloadUrl;
    downloadLink.download = `${fileName}.md`;
    downloadLink.click();

    URL.revokeObjectURL(downloadUrl);

}

/* Delete current note */

function handleDelete(id) {

    const note = getNoteById(id);

    if (!note) {
        return;
    }

    const confirmed = confirm(`Delete "${note.title}"? This cannot be undone.`);

    if (!confirmed) {
        return;
    }

    deleteNote(id);

    renderSidebar();

    navigateTo('');

}

/* App startup */

$(document).ready(function () {

    createStarterNotes();

    applyTheme();

    ROUTES.home = renderHomePage;
    ROUTES.note = renderNotePage;
    ROUTES.edit = renderEditPage;

    renderSidebar();

    $('#sidebar-search').on('keyup', function () {
        handleSearch($(this).val());
    });

    $('#new-note-btn').on('click', function () {
        createNewNote();
    });

    $(document).on('keydown', function (event) {

        if (event.ctrlKey && event.key.toLowerCase() === 'e') {

            event.preventDefault();

            toggleMode();

        }

    });

    handleRoute();

});