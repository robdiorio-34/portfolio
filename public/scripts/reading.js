// Reading Page JavaScript

// Function to create a book card element
function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.setAttribute('data-book-id', book.id);
  
  const ratingDisplay = book.rating ? `<div class="book-rating">${book.rating}/5</div>` : '';
  const completionDateDisplay = book.completionDate ? `<div class="completion-date">Finished ${book.completionDate}</div>` : '';
  
  // Use local SVG placeholder from assets
  const placeholderImage = '../assets/book-placeholder.svg';
  
  card.innerHTML = `
    ${ratingDisplay}
    ${completionDateDisplay}
    <img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.onerror=null; this.src='${placeholderImage}'; this.style.display='block';">
    <h3 class="book-title">${book.title}</h3>
    <p class="book-author">${book.author}</p>
    <p class="book-genre">${book.genre}</p>
  `;
  
  // Add click event to open modal
  card.addEventListener('click', () => openBookModal(book));
  
  return card;
}

// Function to populate a section with books
function populateSection(sectionId, books) {
  const section = document.getElementById(sectionId);
  
  // Safety check - only populate if section exists
  if (!section) {
    console.warn(`Section ${sectionId} not found, skipping population`);
    return;
  }
  
  if (books.length === 0) {
    section.innerHTML = `
      <div class="empty-section">
        <p>No books in this category yet.</p>
        <p>📚 Add some books to get started!</p>
      </div>
    `;
    return;
  }
  
  section.innerHTML = '';
  books.forEach(book => {
    const card = createBookCard(book);
    section.appendChild(card);
  });
}

// Function to open book modal
function openBookModal(book) {
  const modal = document.getElementById('book-modal');
  const modalCover = document.getElementById('modal-book-cover');
  const modalTitle = document.getElementById('modal-book-title');
  const modalAuthor = document.getElementById('modal-book-author');
  const modalGenre = document.getElementById('modal-book-genre');
  const modalNotes = document.getElementById('modal-book-notes');
  const modalRating = document.getElementById('modal-book-rating');
  
  // Set modal content
  modalCover.src = book.cover;
  modalCover.alt = book.title;
  modalTitle.textContent = book.title;
  modalAuthor.textContent = book.author;
  modalGenre.textContent = book.genre;
  modalNotes.textContent = book.notes;
  
  // Set rating if available
  if (book.rating) {
    modalRating.textContent = `${book.rating}/5`;
    modalRating.style.display = 'block';
  } else {
    modalRating.style.display = 'none';
  }
  
  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Make function global for admin auth to override
window.openBookModal = openBookModal;

// Function to close book modal
function closeBookModal() {
  const modal = document.getElementById('book-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Initialize reading page HTML (only called on reading page)
async function initReadingPageHTML() {
  console.log('📖 Initializing reading page HTML...');
  
  // Get books data from cache directly (should already be cached from main.js preload)
  let booksToUse = getCachedBooks();
  
  // If no cached data available, try to fetch fresh data
  if (!booksToUse) {
    console.log('📚 No cached data available, fetching fresh data...');
    booksToUse = await getBooksData();
  }
  
  // If still no data available, show error message
  if (!booksToUse) {
    console.error('❌ Failed to fetch books from API');
    // Show error message to user
    const sections = ['currently-reading-grid', 'want-to-read-grid', 'have-read-grid'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.innerHTML = `
          <div class="empty-section">
            <p>Unable to load books from the server.</p>
            <p>Please try refreshing the page.</p>
          </div>
        `;
      }
    });
    return;
  }
  
  // Populate all sections
  populateSection('currently-reading-grid', booksToUse.currentlyReading);
  populateSection('want-to-read-grid', booksToUse.wantToRead);
  populateSection('have-read-grid', booksToUse.haveRead);
  
  // Set up modal close functionality
  const modal = document.getElementById('book-modal');
  const closeBtn = document.querySelector('.close-modal');
  
  // Close modal when clicking the X button
  closeBtn.addEventListener('click', closeBookModal);
  
  // Close modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBookModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeBookModal();
    }
  });
  
  console.log('✅ Reading page HTML initialized');
}

// Initialize when DOM is loaded - only populate HTML on reading page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('reading.html')) {
    // Wait for main.js preload to complete, then initialize
    waitForMainPreload();
  }
});

// Function to wait for main.js preload to complete before initializing
function waitForMainPreload() {
  // Check if main.js has completed its preload
  if (window.booksPreloadComplete) {
    console.log('📖 Main.js preload complete, initializing reading page...');
    initReadingPageHTML();
  } else {
    // Wait a bit more for main.js to complete preload
    setTimeout(waitForMainPreload, 50);
  }
} 