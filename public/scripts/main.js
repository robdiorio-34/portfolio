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
    fetch('components/navbar.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        navbarPlaceholder.innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
      });
  }

  // Load footer with dark toggle
  const footerPlaceholder = document.getElementById('footer-placeholder');
  
  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
        
        // Load dark toggle component
        const darkTogglePlaceholder = document.querySelector('.dark-toggle-placeholder');
        
        if (darkTogglePlaceholder) {
          fetch('components/dark-toggle.html')
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text();
            })
            .then(data => {
              darkTogglePlaceholder.innerHTML = data;
              darkToggleBtn = document.getElementById('dark-toggle');
              initializeDarkMode();
            })
            .catch(error => {
              console.error('Error loading dark toggle:', error);
              // Fallback: create dark toggle button directly
              darkTogglePlaceholder.innerHTML = '<button id="dark-toggle" class="dark-toggle" aria-label="Toggle dark mode">🌙</button>';
              darkToggleBtn = document.getElementById('dark-toggle');
              initializeDarkMode();
            });
        }
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });
  }
}); 