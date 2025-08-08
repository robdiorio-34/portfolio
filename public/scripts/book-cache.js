// Book Cache Helper

// Cache configuration for books
const CACHE_KEY = 'books_cache';
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

// Function to get cached books data
function getCachedBooks() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      console.log('📚 Using cached books data');
      return data;
    } else {
      console.log('📚 Cache expired, fetching fresh data');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  } catch (error) {
    console.error('❌ Error reading cache:', error);
    return null;
  }
}

// Function to cache books data
function cacheBooks(booksData) {
  try {
    const cacheData = {
      data: booksData,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('📚 Books data cached successfully');
  } catch (error) {
    console.error('❌ Error caching books data:', error);
  }
}

// Function to clear cache (useful for admin operations)
function clearBooksCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('📚 Books cache cleared');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
}

// Function to transform API book data
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

// Function to format completion date
function formatCompletionDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);
  
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

// Function to get books data (with caching)
async function getBooksData() {
  // Try to get cached data first
  let booksData = getCachedBooks();
  
  if (booksData) {
    return booksData;
  }
  
  // If no cache or expired, fetch from API
  booksData = await fetchBooksFromAPI();
  
  if (booksData) {
    // Cache the fresh data
    cacheBooks(booksData);
  }
  
  return booksData;
}

// Function to preload books data
async function preloadBooksData() {
  console.log('📚 Preloading books data on site initialization...');
  try {
    await getBooksData();
    console.log('✅ Books data preloaded successfully');
  } catch (error) {
    console.error('❌ Error preloading books data:', error);
  }
}

// Make functions globally available
window.getBooksData = getBooksData;
window.clearBooksCache = clearBooksCache;
window.preloadBooksData = preloadBooksData; 