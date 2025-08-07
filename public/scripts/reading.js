// Reading Page JavaScript

// Function to transform API book data to match the expected format
function transformApiBook(apiBook) {
  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    genre: apiBook.genre,
    cover: apiBook.cover_url,
    rating: apiBook.rating,
    notes: apiBook.notes,
    completionDate: apiBook.completion_date ? formatCompletionDate(apiBook.completion_date) : null
  };
}

// Function to format completion date for display
function formatCompletionDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Month is 0-indexed
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits
  
  return `${month}/${day}/${year}`;
}

// Function to fetch books from API
async function fetchBooksFromAPI() {
  try {
    console.log('📚 Fetching books from API...');
    
    // Fetch all books
    const allBooks = await window.portfolioAPI.getBooks();
    
    if (!allBooks || allBooks.length === 0) {
      console.warn('⚠️ No books returned from API');
      return null;
    }
    
    console.log(`✅ Successfully fetched ${allBooks.length} books from API`);
    
    // Group books by status
    const booksByStatus = {
      currentlyReading: [],
      wantToRead: [],
      haveRead: []
    };
    
    allBooks.forEach(book => {
      const transformedBook = transformApiBook(book);
      
      switch (book.status) {
        case 'currently_reading':
          booksByStatus.currentlyReading.push(transformedBook);
          break;
        case 'want_to_read':
          booksByStatus.wantToRead.push(transformedBook);
          break;
        case 'have_read':
          booksByStatus.haveRead.push(transformedBook);
          break;
      }
    });
    
    return booksByStatus;
    
  } catch (error) {
    console.error('❌ Error fetching books from API:', error);
    return null;
  }
}

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

// Initialize the reading page
async function initReadingPage() {
  console.log('📖 Initializing reading page...');
  
  // Try to fetch books from API first
  let booksToUse = await fetchBooksFromAPI();
  
  // If API fails, show error message
  if (!booksToUse) {
    console.error('❌ Failed to fetch books from API');
    // Show error message to user
    const sections = ['currently-reading-grid', 'want-to-read-grid', 'have-read-grid'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      section.innerHTML = `
        <div class="empty-section">
          <p>Unable to load books from the server.</p>
          <p>Please try refreshing the page.</p>
        </div>
      `;
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
  
  console.log('✅ Reading page initialized');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initReadingPage); 