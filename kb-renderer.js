function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

function renderMarkdown(rawText) {
  if (!window.marked || !window.DOMPurify) {
    return `<pre>${escapeHtml(rawText)}</pre>`;
  }

  const dirtyHtml = marked.parse(rawText);
  return DOMPurify.sanitize(dirtyHtml);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderToolbar() {
  const toolbar = createElement("div", "toolbar");
  const tools = [
    { label: "Bold", before: "**", after: "**" },
    { label: "Italic", before: "*", after: "*" },
    { label: "Heading", before: "## ", after: "" },
    { label: "Code", before: "`", after: "`" },
    { label: "Link", before: "[", after: "](https://example.com)" }
  ];

  tools.forEach(function (tool) {
    const button = createElement("button", "toolbar-btn", tool.label);
    button.type = "button";
    button.dataset.before = tool.before;
    button.dataset.after = tool.after;
    toolbar.appendChild(button);
  });

  return toolbar;
}

function wrapSelection(textarea, before, after) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const replacementText = before + selectedText + after;

  textarea.value =
    textarea.value.substring(0, start) +
    replacementText +
    textarea.value.substring(end);

  textarea.focus();
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = start + before.length + selectedText.length;
}

function getWordCount(text) {
  const cleanText = text.trim();
  return cleanText ? cleanText.split(/\s+/).length : 0;
}

function getCharCount(text) {
  return text.length;
}

function updateLivePreview(text) {
  const livePreview = document.getElementById("live-preview");

  if (livePreview) {
    livePreview.innerHTML = renderMarkdown(text);
  }
}
