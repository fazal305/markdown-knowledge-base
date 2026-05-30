# Markdown Knowledge Base

A personal markdown-powered knowledge base built with HTML, CSS, Bootstrap, jQuery, and vanilla JavaScript.

This project works like a small personal wiki where you can create notes, edit markdown, preview content live, search notes, export notes as `.md` files, and keep everything saved in the browser using localStorage.

## Live Demo

Coming soon after GitHub Pages deployment.

## Features

- Create and save markdown notes
- Edit notes with autosave
- Live markdown preview
- Hash-based routing
- Sidebar note navigation
- Search saved notes
- Export notes as `.md` files
- Delete notes with confirmation
- Dark and light theme toggle
- Theme saved with localStorage
- Ctrl + E shortcut to switch view/edit mode
- Starter notes included on first load
- Fully responsive layout

## Tech Stack

- HTML5
- CSS3
- Bootstrap 5
- jQuery
- Vanilla JavaScript
- Marked.js
- DOMPurify
- localStorage

## What I Learned

- How hash routing works in single-page apps
- How to use `window.location.hash`
- How to listen for `hashchange`
- How to store structured data in localStorage
- How to convert markdown into HTML
- Why sanitized HTML is important
- How debounced autosave works
- How to create downloadable files using Blob
- How to organize a multi-file JavaScript app

## Project Structure

```text
markdown-knowledge-base
├── index.html
├── kb-styles.css
├── kb-router.js
├── kb-renderer.js
├── kb-storage.js
├── kb-app.js
├── README.md
└── LICENSE