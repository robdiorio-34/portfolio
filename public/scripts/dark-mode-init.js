// Dark mode initialization script
// Apply dark mode immediately to prevent flash when navigating between pages
(function() {
  const darkPref = localStorage.getItem('darkMode') === 'true';
  if (darkPref) {
    document.documentElement.classList.add('dark');
  }
})(); 