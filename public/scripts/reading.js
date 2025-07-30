// Reading Page JavaScript

// Sample book data - you can replace this with your actual books
const booksData = {
  currentlyReading: [
    {
      id: 'nightfall',
      title: 'Nightfall',
      author: 'Isaac Asimov and Robert Silverberg',
      genre: 'Science Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0553290991.01.L.jpg',
      rating: null,
      notes: 'Currently reading this science fiction novel. Excited to explore this collaboration between two great authors.'
    },
    {
      id: 'brothers-karamazov',
      title: 'The Brothers Karamazov',
      author: 'Fyodor Dostoevsky',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0374528373.01.L.jpg',
      rating: null,
      notes: 'Currently reading this classic Russian novel. Looking forward to diving into this philosophical masterpiece.'
    }
  ],
  wantToRead: [
    {
      id: '1q84',
      title: '1Q84',
      author: 'Haruki Murakami',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0099578077.01.L.jpg',
      rating: null,
      notes: 'Want to read this acclaimed novel by Haruki Murakami. Looking forward to diving into this complex and imaginative story.'
    }
  ],
  haveRead: [
    {
      id: 'everything-is-tuberculosis',
      title: 'Everything is Tuberculosis',
      author: 'John Greene',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0525556575.01.L.jpg',
      rating: null,
      notes: 'Finished 6/30/25 (audio book)',
      completionDate: '6/30/25'
    },
    {
      id: 'blood-meridian',
      title: 'Blood Meridian',
      author: 'Cormac McCarthy',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0679728759.01.L.jpg',
      rating: null,
      notes: 'Finished 6/14/25',
      completionDate: '6/14/25'
    },
    {
      id: 'flash-boys',
      title: 'Flash Boys',
      author: 'Michael Lewis',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0393244660.01.L.jpg',
      rating: null,
      notes: 'Finished 10/13/24',
      completionDate: '10/13/24'
    },
    {
      id: 'never-let-me-go',
      title: 'Never Let Me Go',
      author: 'Kazuo Ishiguro',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1400078776.01.L.jpg',
      rating: null,
      notes: 'Finished 8/19/24',
      completionDate: '8/19/24'
    },
    {
      id: 'project-hail-mary',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      genre: 'Science Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0593135202.01.L.jpg',
      rating: null,
      notes: 'Finished 7/24/24',
      completionDate: '7/24/24'
    },
    {
      id: 'amazing-adventures-cavalier-clay',
      title: 'The Amazing Adventures of Kavalier & Clay',
      author: 'Michael Chabon',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0312282990.01.L.jpg',
      rating: null,
      notes: 'Finished 5/21/24',
      completionDate: '5/21/24'
    },
    {
      id: 'anomaly',
      title: 'The Anomaly',
      author: 'Hervé Le Tellier',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1635421691.01.L.jpg',
      rating: null,
      notes: 'Finished 1/10/24',
      completionDate: '1/10/24'
    },
    {
      id: 'killers-flower-moon',
      title: 'Killers of the Flower Moon',
      author: 'David Grann',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0385534248.01.L.jpg',
      rating: null,
      notes: 'Finished 12/11/23',
      completionDate: '12/11/23'
    },
    {
      id: 'chip-war',
      title: 'Chip War',
      author: 'Chris Miller',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1982172002.01.L.jpg',
      rating: null,
      notes: 'Finished 11/5/23',
      completionDate: '11/5/23'
    },
    {
      id: 'god-bless-you-mr-rosewater',
      title: 'God Bless You, Mr. Rosewater',
      author: 'Kurt Vonnegut',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0385333471.01.L.jpg',
      rating: null,
      notes: 'Finished 9/27/23',
      completionDate: '9/27/23'
    },
    {
      id: 'defining-decade',
      title: 'The Defining Decade',
      author: 'Meg Jay',
      genre: 'Self-Help',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0446561754.01.L.jpg',
      rating: null,
      notes: 'Finished 9/8/23',
      completionDate: '9/8/23'
    },
    {
      id: 'wild-sheep-chase',
      title: 'A Wild Sheep Chase',
      author: 'Haruki Murakami',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/037571894X.01.L.jpg',
      rating: null,
      notes: 'Finished 8/14/23',
      completionDate: '8/14/23'
    },
    {
      id: 'fountainhead',
      title: 'The Fountainhead',
      author: 'Ayn Rand',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0451191153.01.L.jpg',
      rating: null,
      notes: 'Finished 7/20/23',
      completionDate: '7/20/23'
    },
    {
      id: 'things-they-carried',
      title: 'The Things They Carried',
      author: 'Tim O\'Brien',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0618706410.01.L.jpg',
      rating: null,
      notes: 'Finished 4/11/23',
      completionDate: '4/11/23'
    },
    {
      id: 'kafka-on-shore',
      title: 'Kafka on the Shore',
      author: 'Haruki Murakami',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1400079276.01.L.jpg',
      rating: null,
      notes: 'Finished 3/19/23',
      completionDate: '3/19/23'
    },
    {
      id: 'midnight-library',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0525559477.01.L.jpg',
      rating: null,
      notes: 'Finished 1/28/23',
      completionDate: '1/28/23'
    },
    {
      id: 'norwegian-wood',
      title: 'Norwegian Wood',
      author: 'Haruki Murakami',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0375704027.01.L.jpg',
      rating: null,
      notes: 'Finished 1/7/23',
      completionDate: '1/7/23'
    },
    {
      id: 'player-piano',
      title: 'Player Piano',
      author: 'Kurt Vonnegut',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0385333781.01.L.jpg',
      rating: null,
      notes: 'Finished 12/15/22',
      completionDate: '12/15/22'
    },
    {
      id: 'big-panda-tiny-dragon',
      title: 'Big Panda and Tiny Dragon',
      author: 'James Norbury',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1647225124.01.L.jpg',
      rating: null,
      notes: 'Finished 10/24/22',
      completionDate: '10/24/22'
    },
    {
      id: 'last-lecture',
      title: 'The Last Lecture',
      author: 'Randy Pausch',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1401323251.01.L.jpg',
      rating: null,
      notes: 'Finished 10/16/22',
      completionDate: '10/16/22'
    },
    {
      id: 'fail-safe',
      title: 'Fail Safe',
      author: 'Eugene Burdick',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/088001654X.01.L.jpg',
      rating: null,
      notes: 'Finished 10/14/22',
      completionDate: '10/14/22'
    },
    {
      id: 'jungle',
      title: 'The Jungle',
      author: 'Upton Sinclair',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0451526341.01.L.jpg',
      rating: null,
      notes: 'Finished 8/3/22',
      completionDate: '8/3/22'
    },
    {
      id: 'zen-motorcycle',
      title: 'Zen and the Art of Motorcycle Maintenance',
      author: 'Robert M. Pirsig',
      genre: 'Philosophy',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0060589469.01.L.jpg',
      rating: null,
      notes: 'Finished 5/23/22',
      completionDate: '5/23/22'
    },
    {
      id: 'cats-cradle',
      title: 'Cat\'s Cradle',
      author: 'Kurt Vonnegut',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/038533348X.01.L.jpg',
      rating: null,
      notes: 'A brilliant satirical novel about the end of the world.'
    },
    {
      id: '1984',
      title: '1984',
      author: 'George Orwell',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0451524934.01.L.jpg',
      rating: null,
      notes: 'A dystopian classic that remains relevant today.'
    },
    {
      id: 'subtle-art',
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      genre: 'Self-Help',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0062457713.01.L.jpg',
      rating: null,
      notes: 'A refreshing take on self-help that challenges conventional wisdom.'
    },
    {
      id: 'walk-woods',
      title: 'A Walk in the Woods',
      author: 'Bill Bryson',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/178416111X.01.L.jpg',
      rating: null,
      notes: 'A humorous and informative account of hiking the Appalachian Trail.'
    },
    {
      id: 'slaughterhouse-five',
      title: 'Slaughterhouse-Five',
      author: 'Kurt Vonnegut',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0385333846.01.L.jpg',
      rating: null,
      notes: 'A powerful anti-war novel with a unique narrative structure.'
    },
    {
      id: 'fahrenheit-451',
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      genre: 'Science Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1451673310.01.L.jpg',
      rating: null,
      notes: 'A prophetic novel about censorship and the power of books.'
    },
    {
      id: 'dune',
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Science Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0441172717.01.L.jpg',
      rating: null,
      notes: 'A masterpiece of science fiction with complex world-building.'
    },
    {
      id: 'recursion',
      title: 'Recursion',
      author: 'Blake Crouch',
      genre: 'Science Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1524759783.01.L.jpg',
      rating: null,
      notes: 'A mind-bending thriller about memory and reality.'
    },
    {
      id: 'middlesex',
      title: 'Middlesex',
      author: 'Jeffrey Eugenides',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0312422156.01.L.jpg',
      rating: null,
      notes: 'A Pulitzer Prize-winning novel about identity and family.'
    },
    {
      id: 'alchemist',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0062315005.01.L.jpg',
      rating: null,
      notes: 'A philosophical novel about following your dreams.'
    },
    {
      id: 'catch-22',
      title: 'Catch-22',
      author: 'Joseph Heller',
      genre: 'Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1451626657.01.L.jpg',
      rating: null,
      notes: 'A satirical masterpiece about the absurdity of war.'
    },
    {
      id: 'how-win-friends',
      title: 'How to Win Friends and Influence People',
      author: 'Dale Carnegie',
      genre: 'Self-Help',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0671027034.01.L.jpg',
      rating: null,
      notes: 'A classic guide to human relations and communication.'
    },
    {
      id: 'salt',
      title: 'Salt',
      author: 'Mark Kurlansky',
      genre: 'Non-Fiction',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/0142001619.01.L.jpg',
      rating: null,
      notes: 'A fascinating history of how salt shaped human civilization.'
    },
    {
      id: 'institute',
      title: 'The Institute',
      author: 'Stephen King',
      genre: 'Horror',
      cover: 'https://images-na.ssl-images-amazon.com/images/P/1982110562.01.L.jpg',
      rating: null,
      notes: 'A gripping thriller about children with psychic abilities.'
    }
  ]
};

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

// Function to close book modal
function closeBookModal() {
  const modal = document.getElementById('book-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Initialize the reading page
function initReadingPage() {
  // Populate all sections
  populateSection('currently-reading-grid', booksData.currentlyReading);
  populateSection('want-to-read-grid', booksData.wantToRead);
  populateSection('have-read-grid', booksData.haveRead);
  
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initReadingPage); 