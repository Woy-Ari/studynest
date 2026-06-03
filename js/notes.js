/* ============================================
   NOTES.JS - StudyNest
   Notes CRUD Operations & Management
   ============================================ */

/**
 * Notes Manager
 */
class NotesManager {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.viewMode = 'grid'; // grid or list
    this.init();
  }

  /**
   * Initialize notes manager
   */
  init() {
    if (!auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    this.setupEventListeners();
    this.render();
  }

  /**
   * Get notes with filter and search
   */
  getNotesFiltered() {
    let notes = storage.getNotes();

    // Apply filter by subject
    if (this.currentFilter !== 'all') {
      notes = notes.filter(n => n.subject === this.currentFilter);
    }

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      notes = notes.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.textContent.toLowerCase().includes(query) ||
        (n.tags && n.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Sort: pinned first, then by date
    notes.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return notes;
  }

  /**
   * Get all subjects
   */
  getSubjects() {
    const subjects = new Set(storage.getNotes().map(n => n.subject));
    return Array.from(subjects);
  }

  /**
   * Render notes
   */
  render() {
    const notes = this.getNotesFiltered();
    const notesContainer = document.getElementById('notes-container');

    if (!notesContainer) return;

    if (notes.length === 0) {
      notesContainer.innerHTML = `
        <div class="empty-state">
          <p>📝 ${this.searchQuery ? 'Catatan tidak ditemukan' : 'Belum ada catatan'}</p>
          <button class="btn btn-primary" onclick="notesManager.createNewNote()">Buat Catatan Baru</button>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'grid') {
      notesContainer.className = 'notes-grid';
      notesContainer.innerHTML = notes.map(note => this.renderNoteCard(note)).join('');
    } else {
      notesContainer.className = 'notes-list';
      notesContainer.innerHTML = notes.map(note => this.renderNoteItem(note)).join('');
    }
  }

  /**
   * Render note as card (grid view)
   */
  renderNoteCard(note) {
    const bgColor = this.getNoteBgColor(note.subject);
    const excerptText = this.getExcerpt(note.textContent, 80);

    return `
      <div class="note-card" style="border-top: 4px solid ${bgColor}">
        <div class="note-card-header">
          <h3 class="note-card-title">${this.escapeHtml(note.title)}</h3>
          <div class="note-card-actions">
            <button class="btn-icon" onclick="notesManager.togglePin('${note.id}')" title="Pin note">
              ${note.isPinned ? '📌' : '📍'}
            </button>
            <button class="btn-icon" onclick="notesManager.editNote('${note.id}')" title="Edit">✏️</button>
            <button class="btn-icon" onclick="notesManager.deleteNote('${note.id}')" title="Delete">🗑️</button>
          </div>
        </div>

        <div class="note-card-content">
          <p>${excerptText}</p>
          ${note.hasDrawing ? '<div class="note-drawing-indicator">🎨 Memiliki drawing</div>' : ''}
        </div>

        <div class="note-card-footer">
          <span class="badge badge-light">${note.subject}</span>
          <span class="note-date">${this.formatDate(note.updatedAt)}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render note as item (list view)
   */
  renderNoteItem(note) {
    const excerptText = this.getExcerpt(note.textContent, 100);

    return `
      <div class="note-item">
        <div class="note-item-main" onclick="notesManager.editNote('${note.id}')">
          <div class="note-item-header">
            ${note.isPinned ? '<span class="pin-icon">📌</span>' : ''}
            <h4>${this.escapeHtml(note.title)}</h4>
          </div>
          <p class="note-item-excerpt">${excerptText}</p>
          <div class="note-item-meta">
            <span class="badge">${note.subject}</span>
            <span class="date">${this.formatDate(note.updatedAt)}</span>
          </div>
        </div>

        <div class="note-item-actions">
          <button class="btn-icon" onclick="notesManager.togglePin('${note.id}'); event.stopPropagation();">
            ${note.isPinned ? '📌' : '📍'}
          </button>
          <button class="btn-icon" onclick="notesManager.deleteNote('${note.id}'); event.stopPropagation();">🗑️</button>
        </div>
      </div>
    `;
  }

  /**
   * Get note background color by subject
   */
  getNoteBgColor(subject) {
    const colors = {
      'Matematika': '#7C3AED',
      'Fisika': '#F472B6',
      'Kimia': '#10B981',
      'Biologi': '#06B6D4',
      'Bahasa Indonesia': '#F59E0B',
      'Bahasa Inggris': '#EF4444',
      'IPA': '#8B5CF6',
      'IPS': '#EC4899'
    };
    return colors[subject] || '#7C3AED';
  }

  /**
   * Get excerpt from HTML content
   */
  getExcerpt(htmlContent, length) {
    const plainText = htmlContent.replace(/<[^>]*>/g, '');
    if (plainText.length > length) {
      return plainText.substring(0, length) + '...';
    }
    return plainText || 'Catatan kosong';
  }

  /**
   * Format date
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Toggle pin
   */
  togglePin(noteId) {
    const note = storage.getNotes().find(n => n.id === noteId);
    if (note) {
      storage.updateNote(noteId, { isPinned: !note.isPinned });
      this.render();
    }
  }

  /**
   * Edit note
   */
  editNote(noteId) {
    const note = storage.getNotes().find(n => n.id === noteId);
    if (note) {
      sessionStorage.setItem('editingNote', JSON.stringify(note));
      window.location.href = 'note-editor.html';
    }
  }

  /**
   * Delete note
   */
  deleteNote(noteId) {
    if (confirm('Hapus catatan ini?')) {
      storage.deleteNote(noteId);
      this.showNotification('Catatan dihapus', 'success');
      this.render();
    }
  }

  /**
   * Create new note
   */
  createNewNote() {
    sessionStorage.removeItem('editingNote');
    window.location.href = 'note-editor.html';
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Subject filter
    const subjectSelect = document.getElementById('subject-filter');
    if (subjectSelect) {
      this.getSubjects().forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
      });

      subjectSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.render();
      });
    }

    // Search
    document.getElementById('search-notes')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.render();
    });

    // View mode toggle
    document.getElementById('view-grid')?.addEventListener('click', () => {
      this.viewMode = 'grid';
      this.render();
      document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
    });

    document.getElementById('view-list')?.addEventListener('click', () => {
      this.viewMode = 'list';
      this.render();
      document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
    });

    // New note button
    document.getElementById('btn-new-note')?.addEventListener('click', () => {
      this.createNewNote();
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
}

// Create global instance
const notesManager = new NotesManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  notesManager.render();
});
