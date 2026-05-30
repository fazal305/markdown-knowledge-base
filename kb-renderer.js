/* Convert text into safe plain HTML text */

function escapeHtml(text) {

    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

}

/* Convert markdown text into safe HTML */

function renderMarkdown(rawText) {

    const dirtyHtml = marked.parse(rawText);

    const cleanHtml = DOMPurify.sanitize(dirtyHtml);

    return cleanHtml;

}

/* Build markdown toolbar buttons */

function renderToolbar() {

    return `
        <div class="toolbar btn-group mb-3" role="group">

            <button class="btn btn-outline-info btn-sm toolbar-btn" data-before="**" data-after="**">
                Bold
            </button>

            <button class="btn btn-outline-info btn-sm toolbar-btn" data-before="*" data-after="*">
                Italic
            </button>

            <button class="btn btn-outline-info btn-sm toolbar-btn" data-before="## " data-after="">
                Heading
            </button>

            <button class="btn btn-outline-info btn-sm toolbar-btn" data-before="\`" data-after="\`">
                Code
            </button>

            <button class="btn btn-outline-info btn-sm toolbar-btn" data-before="[" data-after="](https://example.com)">
                Link
            </button>

        </div>
    `;

}

/* Wrap selected text */

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

/* Count words */

function getWordCount(text) {

    const cleanText = text.trim();

    if (!cleanText) {
        return 0;
    }

    return cleanText.split(/\s+/).length;

}

/* Count characters */

function getCharCount(text) {

    return text.length;

}

/* Render live preview */

function updateLivePreview(text) {

    const html = renderMarkdown(text);

    $('#live-preview').html(html);

}