/* ============================================
   EDITOR.JS - StudyNest
   Text Editor Logic for Note Editor
   ============================================ */

/**
 * Rich Text Editor Manager
 */
class EditorManager {
  constructor() {
    this.editor = null;
    this.currentNote = null;
    this.isSaved = true;
    this.init();
  }

  /**
   * Initialize editor
   */
  init() {
    if (!auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    this.setupEditor();
    this.setupEventListeners();
    this.loadNoteIfEditing();
  }

  /**
   * Setup editor area
   */
  setupEditor() {
    this.editor = document.getElementById('editor-content');
    if (!this.editor) return;

    // Make contentEditable
    this.editor.contentEditable = true;
    this.editor.spellcheck = true;

    // Track changes
    this.editor.addEventListener('input', () => {
      this.isSaved = false;
      this.updateWordCount();
    });
  }

  /**
   * Load note if editing
   */
  loadNoteIfEditing() {
    const editingNoteJson = sessionStorage.getItem('editingNote');
    if (editingNoteJson) {
      this.currentNote = JSON.parse(editingNoteJson);
      this.displayNote(this.currentNote);
    } else {
      this.currentNote = null;
      this.setupNewNote();
    }
  }

  /**
   * Display existing note
   */
  displayNote(note) {
    const titleInput = document.getElementById('note-title');
    const subjectSelect = document.getElementById('note-subject');

    if (titleInput) titleInput.value = note.title;
    if (subjectSelect) subjectSelect.value = note.subject;
    if (this.editor) this.editor.innerHTML = note.textContent;

    document.title = `Edit: ${note.title} - StudyNest`;
    this.isSaved = true;
  }

  /**
   * Setup new note
   */
  setupNewNote() {
    const titleInput = document.getElementById('note-title');
    if (titleInput) titleInput.focus();
    document.title = 'Catatan Baru - StudyNest';
  }

  /**
   * Get current note data
   */
  getCurrentNoteData() {
    const titleInput = document.getElementById('note-title');
    const subjectSelect = document.getElementById('note-subject');
    const tagsInput = document.getElementById('note-tags');

    const tags = tagsInput ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t) : [];

    return {
      title: titleInput?.value || 'Tanpa Judul',
      subject: subjectSelect?.value || 'Lainnya',
      textContent: this.editor?.innerHTML || '',
      tags: tags,
      isPinned: this.currentNote?.isPinned || false,
      hasDrawing: this.currentNote?.hasDrawing || false
    };
  }

  /**
   * Save note
   */
  saveNote() {
    const noteData = this.getCurrentNoteData();

    if (!noteData.title.trim()) {
      this.showNotification('Judul tidak boleh kosong!', 'error');
      return;
    }

    if (!noteData.textContent.trim()) {
      this.showNotification('Konten tidak boleh kosong!', 'error');
      return;
    }

    if (this.currentNote) {
      // Update existing note
      storage.updateNote(this.currentNote.id, {
        ...noteData,
        updatedAt: new Date().toISOString()
      });
      this.showNotification('Catatan berhasil diperbarui! ✅', 'success');
    } else {
      // Create new note
      const newNote = {
        id: storage.generateID(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.createNote(newNote);
      this.currentNote = newNote;
      storage.addXP(15); // Award XP for creating note
      this.showNotification('Catatan berhasil dibuat! 📝 +15 XP', 'success');
    }

    this.isSaved = true;
    sessionStorage.removeItem('editingNote');

    setTimeout(() => {
      window.location.href = 'notes.html';
    }, 1500);
  }

  /**
   * Update word count
   */
  updateWordCount() {
    if (!this.editor) return;

    const text = this.editor.innerText;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;

    const wordCountEl = document.getElementById('word-count');
    if (wordCountEl) {
      wordCountEl.textContent = `${words} kata • ${chars} karakter`;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Save button
    document.getElementById('btn-save-note')?.addEventListener('click', () => {
      this.saveNote();
    });

    // Cancel button
    document.getElementById('btn-cancel-note')?.addEventListener('click', () => {
      if (this.isSaved || confirm('Anda memiliki perubahan yang belum disimpan. Lanjutkan?')) {
        sessionStorage.removeItem('editingNote');
        window.location.href = 'notes.html';
      }
    });

    // Auto-save every 30 seconds
    setInterval(() => {
      if (!this.isSaved && this.editor?.innerText.trim()) {
        console.log('Auto-saving note...');
        // Could implement auto-save here if needed
      }
    }, 30000);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveNote();
      }
    });

    // Formatting buttons
    this.setupFormattingButtons();

    // Track changes
    document.getElementById('note-title')?.addEventListener('input', () => {
      this.isSaved = false;
    });

    document.getElementById('note-subject')?.addEventListener('change', () => {
      this.isSaved = false;
    });
  }

  /**
   * Setup formatting buttons
   */
  setupFormattingButtons() {
    const formatButtons = {
      'btn-bold': 'bold',
      'btn-italic': 'italic',
      'btn-underline': 'underline',
      'btn-strikethrough': 'strikeThrough',
      'btn-heading': 'formatBlock',
      'btn-ul': 'insertUnorderedList',
      'btn-ol': 'insertOrderedList',
      'btn-link': 'createLink',
      'btn-quote': 'formatBlock'
    };

    Object.entries(formatButtons).forEach(([btnId, command]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.isSaved = false;

          if (command === 'heading') {
            document.execCommand('formatBlock', false, '<h2>');
          } else if (command === 'link') {
            const url = prompt('Masukkan URL:');
            if (url) document.execCommand(command, false, url);
          } else if (command === 'quote') {
            document.execCommand('formatBlock', false, '<blockquote>');
          } else {
            document.execCommand(command);
          }

          this.editor?.focus();
        });
      }
    });

    // Color picker
    document.getElementById('btn-color')?.addEventListener('change', (e) => {
      document.execCommand('foreColor', false, e.target.value);
      this.isSaved = false;
    });

    // Clear formatting
    document.getElementById('btn-clear-format')?.addEventListener('click', () => {
      document.execCommand('removeFormat');
      this.isSaved = false;
    });
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `toast toast-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  /**
   * Export note as HTML
   */
  exportAsHTML() {
    const noteData = this.getCurrentNoteData();
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${noteData.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 20px auto; }
    h1 { color: #333; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${noteData.title}</h1>
  <div class="meta">
    <p><strong>Mata Pelajaran:</strong> ${noteData.subject}</p>
    <p><strong>Tags:</strong> ${noteData.tags.join(', ') || 'Tidak ada'}</p>
  </div>
  <div class="content">
    ${noteData.textContent}
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${noteData.title}.html`;
    a.click();
  }

  /**
   * Export note as PDF (requires external library)
   */
  exportAsPDF() {
    this.showNotification('Fitur PDF akan tersedia segera!', 'info');
  }
}

// Create global instance
const editorManager = new EditorManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  editorManager.setupEditor();
});
