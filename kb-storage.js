const STORAGE_KEY = 'markdownKnowledgeBaseNotes';

/* Generate a unique note id */

function generateId() {

    return Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8);

}

/* Create starter notes on first run */

function createStarterNotes() {

    const existingNotes = localStorage.getItem(STORAGE_KEY);

    if (existingNotes) {
        return;
    }

    const starterNotes = [
        {
            id: generateId(),
            title: 'Welcome to Your Knowledge Base',
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
    console.log('Hello Knowledge Base');
}
\`\`\`
`,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: generateId(),
            title: 'JavaScript Cheatsheet',
            content: `# JavaScript Cheatsheet

A quick reference for common JavaScript concepts.

## Variables

\`\`\`javascript
let username = 'Fazal';
const appName = 'Knowledge Base';
\`\`\`

## Functions

\`\`\`javascript
function greetUser(name) {
    return 'Hello ' + name;
}
\`\`\`

## Arrays

\`\`\`javascript
const skills = ['HTML', 'CSS', 'JavaScript'];

skills.forEach(function (skill) {
    console.log(skill);
});
\`\`\`

## Objects

\`\`\`javascript
const note = {
    title: 'My Note',
    content: 'Markdown text here'
};
\`\`\`

## Fetch

\`\`\`javascript
fetch('https://api.example.com/data')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
\`\`\`

## Async / Await

\`\`\`javascript
async function getData() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();

    console.log(data);
}
\`\`\`

## Quick Table

| Concept | Meaning |
| --- | --- |
| let | Changeable variable |
| const | Fixed variable |
| array | List of values |
| object | Grouped data |
| function | Reusable block of code |
`,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: generateId(),
            title: 'My Learning Roadmap',
            content: `# My Learning Roadmap

A simple checklist for frontend progress.

## Completed

- [x] HTML fundamentals
- [x] CSS layouts
- [x] JavaScript DOM
- [x] localStorage projects
- [x] Canvas animations
- [x] Web Audio API basics
- [x] Firebase Firestore apps

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
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterNotes));

}

/* Get all notes */

function getAllNotes() {

    const notes = localStorage.getItem(STORAGE_KEY);

    if (!notes) {
        return [];
    }

    return JSON.parse(notes);

}

/* Find one note by id */

function getNoteById(id) {

    const notes = getAllNotes();

    return notes.find(function (note) {
        return note.id === id;
    });

}

/* Save or update a note */

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

/* Delete one note */

function deleteNote(id) {

    const notes = getAllNotes();

    const filteredNotes = notes.filter(function (note) {
        return note.id !== id;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));

}

/* Search notes by title or content */

function searchNotes(query) {

    const notes = getAllNotes();

    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) {
        return notes;
    }

    return notes.filter(function (note) {

        const titleMatch = note.title.toLowerCase().includes(cleanQuery);
        const contentMatch = note.content.toLowerCase().includes(cleanQuery);

        return titleMatch || contentMatch;

    });

}