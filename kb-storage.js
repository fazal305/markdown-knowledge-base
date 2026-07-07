const STORAGE_KEY = "markdownKnowledgeBaseNotes";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function createStarterNotes() {
  if (localStorage.getItem(STORAGE_KEY)) {
    return;
  }

  const now = Date.now();
  const starterNotes = [
    {
      id: generateId(),
      title: "Welcome to Your Knowledge Base",
      content: `# Welcome to Your Knowledge Base

This is your personal markdown-powered wiki.

## What You Can Do

- Create notes
- Edit notes
- Search notes
- Save notes in your browser
- Use markdown formatting
- Export notes as .md files

## Useful Shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl + E | Toggle edit/view mode |

## Markdown Examples

**Bold text**

*Italic text*

\`Inline code\`

> This is a blockquote.

\`\`\`javascript
function sayHello() {
  console.log("Hello Knowledge Base");
}
\`\`\`
`,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateId(),
      title: "JavaScript Cheatsheet",
      content: `# JavaScript Cheatsheet

A quick reference for common JavaScript concepts.

## Variables

\`\`\`javascript
let username = "Fazal";
const appName = "Knowledge Base";
\`\`\`

## Arrays

\`\`\`javascript
const skills = ["HTML", "CSS", "JavaScript"];

skills.forEach(function (skill) {
  console.log(skill);
});
\`\`\`

## Objects

\`\`\`javascript
const note = {
  title: "My Note",
  content: "Markdown text here"
};
\`\`\`
`,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateId(),
      title: "My Learning Roadmap",
      content: `# My Learning Roadmap

## Completed

- [x] HTML fundamentals
- [x] CSS layouts
- [x] JavaScript DOM
- [x] localStorage projects

## In Progress

- [ ] Markdown rendering
- [ ] Hash routing
- [ ] Multi-file architecture
- [ ] Exporting files from the browser

## Next

- [ ] React routing
- [ ] Backend APIs
- [ ] Authentication
- [ ] Full-stack deployment
`,
      createdAt: now,
      updatedAt: now
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(starterNotes));
}

function getAllNotes() {
  const notes = localStorage.getItem(STORAGE_KEY);

  if (!notes) {
    return [];
  }

  try {
    const parsedNotes = JSON.parse(notes);
    return Array.isArray(parsedNotes) ? parsedNotes : [];
  } catch (error) {
    return [];
  }
}

function getNoteById(id) {
  return getAllNotes().find(function (note) {
    return note.id === id;
  });
}

function saveNote(note) {
  const notes = getAllNotes();
  const existingIndex = notes.findIndex(function (savedNote) {
    return savedNote.id === note.id;
  });

  note.updatedAt = Date.now();

  if (existingIndex === -1) {
    note.createdAt = Date.now();
    notes.push(note);
  } else {
    notes[existingIndex] = note;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  return note;
}

function deleteNote(id) {
  const filteredNotes = getAllNotes().filter(function (note) {
    return note.id !== id;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
}

function searchNotes(query) {
  const cleanQuery = query.toLowerCase().trim();

  if (!cleanQuery) {
    return getAllNotes();
  }

  return getAllNotes().filter(function (note) {
    return (
      note.title.toLowerCase().includes(cleanQuery) ||
      note.content.toLowerCase().includes(cleanQuery)
    );
  });
}
