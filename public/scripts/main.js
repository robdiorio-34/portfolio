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
    console.log('No-transitions class removed');
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

// Dropdown menu accessibility
function initializeDropdown() {
  const dropbtn = document.querySelector('.dropbtn');
  const dropdown = document.querySelector('.dropdown-content');
  
  if (dropbtn && dropdown) {
    dropbtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      dropbtn.setAttribute('aria-expanded', dropdown.style.display === 'block');
    });

    document.addEventListener('click', function(e) {
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        dropbtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        dropbtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Load reusable components
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOMContentLoaded event fired");
  
  // Load navbar first
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  console.log("Navbar placeholder found:", !!navbarPlaceholder);
  
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
        console.log('Navbar loaded successfully');
        
        // After navbar loads, load dark toggle
        const darkTogglePlaceholder = document.querySelector('.dark-toggle-placeholder');
        console.log("Dark toggle placeholder found:", !!darkTogglePlaceholder);
        
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
              console.log("Dark toggle button found:", !!darkToggleBtn);
              initializeDarkMode();
              console.log('Dark toggle loaded successfully');
            })
            .catch(error => {
              console.error('Error loading dark toggle:', error);
              // Fallback: create a simple dark toggle if loading fails
              darkTogglePlaceholder.innerHTML = `
                <button id="dark-toggle" class="dark-toggle" aria-label="Toggle dark mode">🌙</button>
              `;
              darkToggleBtn = document.getElementById('dark-toggle');
              initializeDarkMode();
            });
        } else {
          console.error('Dark toggle placeholder not found after navbar loaded');
          // Create a fallback navbar with dark toggle if the component loading fails
          navbarPlaceholder.innerHTML = `
            <nav class="navbar">
              <a href="index.html" class="logo">ROB</a>
              <div class="nav-controls">
                <button id="dark-toggle" class="dark-toggle" aria-label="Toggle dark mode">🌙</button>
                <div class="dropdown">
                  <button class="dropbtn" aria-haspopup="true" aria-expanded="false">Menu &#x25BC;</button>
                  <div class="dropdown-content">
                    <a href="projects.html">Projects</a>
                    <a href="resume.html">Resume</a>
                    <a href="comments.html">Comments</a>
                  </div>
                </div>
              </div>
            </nav>
          `;
          darkToggleBtn = document.getElementById('dark-toggle');
          if (darkToggleBtn) {
            initializeDarkMode();
            console.log('Fallback dark toggle created and initialized');
          }
        }
        
        // Initialize dropdown after navbar loads
        setTimeout(initializeDropdown, 100);
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
      });
  } else {
    console.error('Navbar placeholder not found');
  }

  // Load footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  console.log("fetched components")

    fetch('components/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
        console.log('Footer loaded successfully');
      })
      .catch(error => {
        console.error('Error loading footer:', error);
        // Fallback: create a simple footer if loading fails
        footerPlaceholder.innerHTML = `
          <footer class="footer-bar">
            <div class="footer-icons">
              <a href="https://github.com/robdiorio34" target="_blank" aria-label="GitHub">
                <img src="assets/github.svg" alt="GitHub" class="icon">
              </a>
              <a href="https://linkedin.com/in/robert-diorio" target="_blank" aria-label="LinkedIn">
                <img src="assets/linkedin.svg" alt="LinkedIn" class="icon">
              </a>
            </div>
          </footer>
        `;
      });
}); 