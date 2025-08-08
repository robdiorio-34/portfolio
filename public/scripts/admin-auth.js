// Admin Authentication System

// Admin session management
class AdminSession {
  constructor() {
    this.isLoggedIn = false;
    this.sessionKey = 'admin_session';
    this.checkSession();
  }

  // Check if admin is logged in
  checkSession() {
    const session = localStorage.getItem(this.sessionKey);
    if (session) {
      const sessionData = JSON.parse(session);
      const now = Date.now();
      
      // Check if session is still valid (24 hours)
      if (sessionData.expires > now) {
        this.isLoggedIn = true;
        this.updateUI();
      } else {
        this.logout();
      }
    }
  }

  // Login admin
  async login(password) {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.isLoggedIn = true;
        this.saveSession();
        this.updateUI();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Logout admin
  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem(this.sessionKey);
    this.updateUI();
  }

  // Save session to localStorage
  saveSession() {
    const sessionData = {
      loggedIn: true,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  // Update UI based on admin status
  updateUI() {
    // Update admin button in navbar
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
      if (this.isLoggedIn) {
        adminButton.textContent = 'Admin Logout';
        adminButton.onclick = () => this.logout();
        adminButton.style.background = '#ef4444';
      } else {
        adminButton.textContent = 'Admin';
        adminButton.onclick = () => this.showLoginModal();
        adminButton.style.background = '';
      }
    }

    // Show/hide admin controls on pages
    this.updateAdminControls();
  }

  // Show login modal
  showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="admin-modal-content">
        <span class="admin-close-modal">&times;</span>
        <h3>Admin Login</h3>
        <form id="admin-login-form">
          <div class="form-group">
            <label for="admin-password">Password</label>
            <input type="password" id="admin-password" placeholder="Enter admin password" required>
          </div>
          <button type="submit">Login</button>
          <div id="login-message"></div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.admin-close-modal');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    // Handle form submission
    const form = modal.querySelector('#admin-login-form');
    const messageDiv = modal.querySelector('#login-message');

    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const password = document.getElementById('admin-password').value;
      const result = await this.login(password);
      
      if (result.success) {
        messageDiv.className = 'success-message';
        messageDiv.textContent = 'Login successful!';
        setTimeout(() => {
          modal.remove();
        }, 1000);
      } else {
        messageDiv.className = 'error-message';
        messageDiv.textContent = result.error;
      }
    };

    // Focus on password input
    setTimeout(() => {
      modal.querySelector('#admin-password').focus();
    }, 100);
  }

  // Update admin controls on current page
  updateAdminControls() {
    if (this.isLoggedIn) {
      // Add admin controls to reading page
      if (window.location.pathname.includes('reading.html')) {
        // Wait for reading page content to load and retry if needed
        this.waitForReadingContent();
      }
    } else {
      // Remove admin controls
      this.removeAdminControls();
    }
  }

  // Wait for reading page content to load
  waitForReadingContent() {
    const sections = ['currently-reading-grid', 'want-to-read-grid', 'have-read-grid'];
    const allSectionsExist = sections.every(id => document.getElementById(id));
    
    // Also check if the reading page has finished loading books
    const hasBooksLoaded = sections.some(id => {
      const section = document.getElementById(id);
      return section && section.children.length > 0;
    });
    
    if (allSectionsExist && hasBooksLoaded) {
      console.log('Reading sections found and books loaded, adding admin controls...');
      this.addReadingAdminControls();
      this.setupBookModalAdminControls();
    } else {
      console.log('Reading sections not yet loaded or books not populated, retrying in 500ms...');
      setTimeout(() => this.waitForReadingContent(), 500);
    }
  }

  // Setup admin controls for book modal
  setupBookModalAdminControls() {
    // Override the openBookModal function to add admin controls
    if (window.openBookModal) {
      const originalOpenBookModal = window.openBookModal;
      window.openBookModal = (book) => {
        originalOpenBookModal(book);
        this.addBookModalAdminControls(book);
      };
    }
  }

  // Add admin controls to book modal
  addBookModalAdminControls(book) {
    console.log('Adding admin controls to book modal for book:', book);
    
    const modal = document.getElementById('book-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Remove existing admin controls if any
    const existingControls = modalContent.querySelector('.book-admin-controls');
    if (existingControls) {
      existingControls.remove();
    }
    
    // Create admin controls container
    const adminControls = document.createElement('div');
    adminControls.className = 'book-admin-controls';
    adminControls.innerHTML = `
      <div class="admin-buttons">
        <button class="admin-edit-btn" data-book-id="${book.id}">Edit</button>
        <button class="admin-delete-btn" data-book-id="${book.id}">Delete</button>
      </div>
    `;
    
    // Add event listeners to buttons
    const editBtn = adminControls.querySelector('.admin-edit-btn');
    const deleteBtn = adminControls.querySelector('.admin-delete-btn');
    
    editBtn.addEventListener('click', () => {
      console.log('Edit button clicked for book:', book.id);
      this.editBook(book.id);
    });
    
    deleteBtn.addEventListener('click', () => {
      console.log('Delete button clicked for book:', book.id);
      this.deleteBook(book.id);
    });
    
    // Add to modal
    modalContent.appendChild(adminControls);
    console.log('Admin controls added to modal:', adminControls);
  }

  // Add admin controls to reading page
  addReadingAdminControls() {
    console.log('Adding admin controls to reading page...');
    
    // Add "+" buttons to reading section headers
    const sections = [
      { id: 'currently-reading-grid', title: 'Currently Reading', status: 'currently_reading' },
      { id: 'want-to-read-grid', title: 'Want to Read', status: 'want_to_read' },
      { id: 'have-read-grid', title: 'Have Read', status: 'have_read' }
    ];

    sections.forEach(section => {
      // Find the section header (h2) that comes before the grid
      const gridElement = document.getElementById(section.id);
      console.log(`Looking for grid element: ${section.id}`, gridElement);
      
      if (gridElement) {
        const sectionElement = gridElement.closest('.reading-section');
        const headerElement = sectionElement.querySelector('h2');
        console.log(`Found header element:`, headerElement);
        
        // Check if admin button already exists
        if (headerElement && !headerElement.querySelector('.admin-add-button')) {
          // Create the add button
          const addButton = document.createElement('button');
          addButton.className = 'admin-add-button';
          addButton.innerHTML = '+';
          addButton.title = `Add book to ${section.title}`;
          addButton.onclick = () => this.showAddBookModal(section.status, section.title);
          
          // Insert button next to the header
          headerElement.appendChild(addButton);
          console.log(`Added admin button to ${section.title}`);
        } else {
          console.log(`Admin button already exists or header not found for ${section.title}`);
        }
      } else {
        console.log(`Grid element not found: ${section.id}`);
      }
    });
  }

  // Remove admin controls
  removeAdminControls() {
    const adminButtons = document.querySelectorAll('.admin-add-button');
    adminButtons.forEach(button => button.remove());
  }

  // Show add book modal
  showAddBookModal(status, sectionTitle) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="admin-modal-content">
        <span class="admin-close-modal">&times;</span>
        <h3>Add Book to ${sectionTitle}</h3>
        <form id="add-book-form">
          <div class="form-group">
            <label for="book-title">Title *</label>
            <input type="text" id="book-title" required>
          </div>
          <div class="form-group">
            <label for="book-author">Author</label>
            <input type="text" id="book-author">
          </div>
          <div class="form-group">
            <label for="book-genre">Genre</label>
            <input type="text" id="book-genre">
          </div>
          <div class="form-group">
            <label for="book-cover">Cover URL</label>
            <input type="url" id="book-cover">
          </div>
          <div class="form-group">
            <label for="book-notes">Notes</label>
            <textarea id="book-notes" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="book-rating">Rating (1-5)</label>
            <input type="number" id="book-rating" min="1" max="5">
          </div>
          <div class="form-group">
            <label for="book-completion-date">Completion Date</label>
            <input type="date" id="book-completion-date">
          </div>
          <button type="submit">Add Book</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.admin-close-modal');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    // Handle form submission
    const form = modal.querySelector('#add-book-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        genre: document.getElementById('book-genre').value,
        cover_url: document.getElementById('book-cover').value,
        notes: document.getElementById('book-notes').value,
        rating: document.getElementById('book-rating').value || null,
        completion_date: document.getElementById('book-completion-date').value || null,
        status: status
      };

      const result = await this.addBook(formData);
      if (result.success) {
        modal.remove();
        // Clear cache before reload
        if (window.clearBooksCache) {
          window.clearBooksCache();
        }
        // Refresh the page to show new book
        window.location.reload();
      } else {
        alert('Error adding book: ' + result.error);
      }
    };
  }

  // Add book to database
  async addBook(bookData) {
    try {
      const response = await window.portfolioAPI.createBook(bookData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error adding book:', error);
      return { success: false, error: error.message };
    }
  }

  // Edit book
  async editBook(bookId) {
    try {
      // Fetch current book data
      const books = await window.portfolioAPI.getBooks();
      const book = books.find(b => b.id === bookId);
      
      if (!book) {
        alert('Book not found');
        return;
      }

      this.showEditBookModal(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      alert('Error loading book data');
    }
  }

  // Show edit book modal
  showEditBookModal(book) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="admin-modal-content">
        <span class="admin-close-modal">&times;</span>
        <h3>Edit Book</h3>
        <form id="edit-book-form">
          <div class="form-group">
            <label for="edit-book-title">Title *</label>
            <input type="text" id="edit-book-title" value="${book.title}" required>
          </div>
          <div class="form-group">
            <label for="edit-book-author">Author</label>
            <input type="text" id="edit-book-author" value="${book.author || ''}">
          </div>
          <div class="form-group">
            <label for="edit-book-genre">Genre</label>
            <input type="text" id="edit-book-genre" value="${book.genre || ''}">
          </div>
          <div class="form-group">
            <label for="edit-book-cover">Cover URL</label>
            <input type="url" id="edit-book-cover" value="${book.cover_url || ''}">
          </div>
          <div class="form-group">
            <label for="edit-book-notes">Notes</label>
            <textarea id="edit-book-notes" rows="3">${book.notes || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="edit-book-rating">Rating (1-5)</label>
            <input type="number" id="edit-book-rating" min="1" max="5" value="${book.rating || ''}">
          </div>
          <div class="form-group">
            <label for="edit-book-completion-date">Completion Date</label>
            <input type="date" id="edit-book-completion-date" value="${book.completion_date || ''}">
          </div>
          <div class="form-group">
            <label for="edit-book-status">Status</label>
            <select id="edit-book-status">
              <option value="currently_reading" ${book.status === 'currently_reading' ? 'selected' : ''}>Currently Reading</option>
              <option value="want_to_read" ${book.status === 'want_to_read' ? 'selected' : ''}>Want to Read</option>
              <option value="have_read" ${book.status === 'have_read' ? 'selected' : ''}>Have Read</option>
            </select>
          </div>
          <button type="submit">Update Book</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.admin-close-modal');
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    // Handle form submission
    const form = modal.querySelector('#edit-book-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('edit-book-title').value,
        author: document.getElementById('edit-book-author').value,
        genre: document.getElementById('edit-book-genre').value,
        cover_url: document.getElementById('edit-book-cover').value,
        notes: document.getElementById('edit-book-notes').value,
        rating: document.getElementById('edit-book-rating').value || null,
        completion_date: document.getElementById('edit-book-completion-date').value || null,
        status: document.getElementById('edit-book-status').value
      };

      const result = await this.updateBook(book.id, formData);
      if (result.success) {
        modal.remove();
        // Close the book detail modal and refresh the page
        const bookModal = document.getElementById('book-modal');
        if (bookModal) {
          bookModal.style.display = 'none';
        }
        // Clear cache before reload
        if (window.clearBooksCache) {
          window.clearBooksCache();
        }
        window.location.reload();
      } else {
        alert('Error updating book: ' + result.error);
      }
    };
  }

  // Update book in database
  async updateBook(bookId, bookData) {
    try {
      const response = await window.portfolioAPI.updateBook(bookId, bookData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error updating book:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete book with confirmation
  async deleteBook(bookId) {
    const confirmed = confirm('Are you sure you want to delete this book? This action cannot be undone.');
    
    if (confirmed) {
      try {
        const result = await window.portfolioAPI.deleteBook(bookId);
        // DELETE endpoint returns null on success (204 No Content)
        // Close the book detail modal and refresh the page
        const bookModal = document.getElementById('book-modal');
        if (bookModal) {
          bookModal.style.display = 'none';
        }
        // Clear cache before reload
        if (window.clearBooksCache) {
          window.clearBooksCache();
        }
        window.location.reload();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book: ' + error.message);
      }
    }
  }
}

// Initialize admin session
const adminSession = new AdminSession();

// Wait for navbar to load before updating UI
function waitForNavbar() {
  const adminButton = document.getElementById('admin-button');
  if (adminButton) {
    adminSession.updateUI();
  } else {
    // Check again in 100ms if navbar hasn't loaded yet
    setTimeout(waitForNavbar, 100);
  }
}

// Update UI when page loads and after navbar loads
document.addEventListener('DOMContentLoaded', () => {
  // Initial update
  adminSession.updateUI();
  
  // Wait for navbar to load and update again
  waitForNavbar();
}); 