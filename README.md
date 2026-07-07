# Markdown Knowledge Base

A personal markdown-powered knowledge base built with HTML, CSS, and vanilla JavaScript.

Markdown Knowledge Base works like a small browser wiki. You can create notes, edit markdown, preview content live, search saved notes, export notes as `.md` files, switch themes, and keep everything saved locally in the browser.

## Live Demo

https://fazal305.github.io/markdown-knowledge-base/

## Features

- Create, edit, and delete markdown notes
- Live markdown preview
- Safe markdown rendering with DOMPurify
- Hash-based routing for home, note, and edit views
- Sidebar note navigation
- Search notes by title or content
- Export individual notes as `.md` files
- Autosave while editing
- Word and character counts
- Dark and light theme toggle
- Theme and notes saved with `localStorage`
- Ctrl + E shortcut to switch between view and edit mode
- Starter notes on first launch
- Responsive two-column editor layout

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Marked.js
- DOMPurify
- localStorage API
- Blob download API

## Project Structure

```text
markdown-knowledge-base/
|-- index.html
|-- kb-styles.css
|-- kb-router.js
|-- kb-renderer.js
|-- kb-storage.js
|-- kb-app.js
|-- LICENSE
`-- README.md
```

## What I Practiced

- Hash routing in a small single-page app
- Browser storage with structured JSON data
- Markdown rendering and HTML sanitization
- Debounced autosave
- File export from the browser
- Modular JavaScript organization
- Search and filtered navigation
- Responsive editor and preview layouts

## Run Locally

Open `index.html` in a browser.

An internet connection is required for the Marked.js and DOMPurify CDN scripts.

## Author

Built by Fazal Abbas.

- GitHub: https://github.com/fazal305
- LinkedIn: https://www.linkedin.com/in/fazal-abbas-4653dg86

## License

This project is licensed under the MIT License.
