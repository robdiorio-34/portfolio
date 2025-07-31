// Apply dark mode immediately to prevent flash - this must be at the very top
(function() {
  // Add no-transitions class to prevent unwanted transitions during load
  document.documentElement.classList.add('no-transitions');
  
  const darkPref = localStorage.getItem('darkMode') === 'true';
  if (darkPref) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }
  
  // Remove no-transitions class after a brief delay to allow proper transitions
  setTimeout(() => {
    document.documentElement.classList.remove('no-transitions');
  }, 100);
})();

// Dark mode functionality
let darkToggleBtn = null;

function setDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    if (darkToggleBtn) {
      darkToggleBtn.textContent = '☀️';
      darkToggleBtn.style.transform = 'scale(1.1)';
      setTimeout(() => {
        darkToggleBtn.style.transform = 'scale(1)';
      }, 150);
    }
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    if (darkToggleBtn) {
      darkToggleBtn.textContent = '🌙';
      darkToggleBtn.style.transform = 'scale(1.1)';
      setTimeout(() => {
        darkToggleBtn.style.transform = 'scale(1)';
      }, 150);
    }
  }
}

function initializeDarkMode() {
  // Load preference
  const darkPref = localStorage.getItem('darkMode') === 'true';
  setDarkMode(darkPref);
  
  // Add event listener to toggle button
  if (darkToggleBtn) {
    darkToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', isDark);
      setDarkMode(isDark);
    });
  }
}

// Load reusable components
document.addEventListener("DOMContentLoaded", function() {
  // Load navbar first
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  
  if (navbarPlaceholder) {
    fetch('/components/navbar.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        navbarPlaceholder.innerHTML = data;
        
        // Set correct navbar links after navbar is loaded
        document.getElementById('home-link').href = '/';
        document.getElementById('projects-link').href = '/projects.html';
        document.getElementById('reading-link').href = '/reading.html';
        document.getElementById('resume-link').href = '/resume.html';
        document.getElementById('comments-link').href = '/comments.html';
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
      });
  }

  // Load footer with dark toggle
  const footerPlaceholder = document.getElementById('footer-placeholder');
  
  if (footerPlaceholder) {
    fetch('/components/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
        
        // Initialize dark mode after footer is loaded
        darkToggleBtn = document.getElementById('dark-toggle');
        initializeDarkMode();
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });
  }
}); 