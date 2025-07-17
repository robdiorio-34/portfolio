// Dark mode toggle
const toggleBtn = document.getElementById('dark-toggle');
const body = document.body;

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    toggleBtn.textContent = '🌙';
  }
}

// Load preference
const darkPref = localStorage.getItem('darkMode') === 'true';
setDarkMode(darkPref);

toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
  setDarkMode(isDark);
});

// Dropdown menu accessibility
const dropbtn = document.querySelector('.dropbtn');
const dropdown = document.querySelector('.dropdown-content');

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