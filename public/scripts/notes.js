// Notes page functionality
class NotesManager {
  constructor() {
    this.notes = [];
    this.init();
  }

  async init() {
    await this.loadNotes();
    this.setupEventListeners();
  }

  async loadNotes() {
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.notes = await response.json();
      this.renderNotes();
    } catch (error) {
      console.error('Error loading notes:', error);
      this.showError('Failed to load notes. Please try again later.');
    }
  }

  renderNotes() {
    const notesContainer = document.getElementById('notes-cards');
    if (!notesContainer) return;

    if (this.notes.length === 0) {
      notesContainer.innerHTML = '<p class="no-notes">No notes available yet.</p>';
      return;
    }

    const notesHTML = this.notes.map(note => this.createNoteCard(note)).join('');
    notesContainer.innerHTML = notesHTML;
  }

  createNoteCard(note) {
    const formattedDate = this.formatDate(note.published_date);
    
    return `
      <article class="note-card" data-note-id="${note.id}">
        <a href="${note.substack_url}" target="_blank" rel="noopener" class="note-card-link">
          <h4 class="note-title">${this.escapeHtml(note.title)}</h4>
          <p class="note-date">${formattedDate}</p>
          <div class="note-link">
            <svg class="icon icon-light" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <svg class="icon icon-dark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Read on Substack
          </div>
        </a>
      </article>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupEventListeners() {
    // Basic event listeners for notes display
    // Admin functionality is handled by admin-auth.js
  }

  showError(message) {
    // Simple error message - could be enhanced with a toast notification
    alert(`Error: ${message}`);
  }
}

// Initialize notes manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NotesManager();
}); 