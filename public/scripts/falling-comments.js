// Falling Comments Feature with API Integration
class FallingComments {
  constructor() {
    this.commentBuffer = '';
    this.maxBufferLength = 50;
    this.fallingComments = [];
    this.maxActiveComments = 20;
    this.container = document.getElementById('falling-comments');
    this.input = document.getElementById('comment-capture');
    this.storageKey = 'falling-comments-data';
    this.maxStoredComments = 50;
    this.currentCommentIndex = 0; // Track current position in comment cycle
    
    this.init();
  }

  init() {
    // Focus the hidden input to capture keystrokes
    if (this.input) {
      this.input.focus();
    }
    
    // Add event listeners
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Show clear button only on comments page
    this.setupClearButton();
    
    // Load saved comments from API
    this.loadSavedComments();
    
    // Start the comment spawning loop
    this.startCommentLoop();
  }

  handleKeydown(event) {
    // Only ignore if user is typing in a visible input field (not our hidden one)
    if ((event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') && 
        event.target.id !== 'comment-capture') {
      return;
    }

    // Handle backspace
    if (event.key === 'Backspace') {
      this.commentBuffer = this.commentBuffer.slice(0, -1);
      return;
    }

    // Handle enter key
    if (event.key === 'Enter') {
      this.submitComment();
      return;
    }

    // Add character to buffer if it's printable and within limit
    if (event.key.length === 1 && this.commentBuffer.length < this.maxBufferLength) {
      this.commentBuffer += event.key;
    }
  }

  handleClick(event) {
    // Refocus the hidden input when clicking anywhere
    if (this.input) {
      this.input.focus();
    }
  }

  handleResize() {
    // Update animation duration for existing comments when window is resized
    const footer = document.querySelector('.footer-bar');
    const footerHeight = footer ? footer.offsetHeight : 0;
    const fallSpeed = 100; // pixels per second
    const totalDistance = window.innerHeight + footerHeight + 50;
    const animationDuration = totalDistance / fallSpeed;
    
    console.log('Window resized, updating animation duration:', {
      footerHeight,
      viewportHeight: window.innerHeight,
      totalDistance,
      animationDuration: `${animationDuration}s`
    });
  }

  async submitComment() {
    const comment = this.commentBuffer.trim();
    
    if (comment.length > 0) {
      try {
        // Save to API
        await this.saveComment(comment);
        
        // Create falling comment immediately
        this.createFallingComment(comment);
        
        this.commentBuffer = '';
        console.log('Comment submitted successfully:', comment);
      } catch (error) {
        console.error('Failed to submit comment:', error);
        // Still show the comment locally even if API fails
        this.createFallingComment(comment);
        this.commentBuffer = '';
      }
    }
  }

  async saveComment(comment) {
    try {
      // Use the API to save the comment
      await window.portfolioAPI.createComment({
        text: comment,
        sentiment_score: null // You can add sentiment analysis later
      });
    } catch (error) {
      console.error('Error saving comment to API:', error);
      throw error;
    }
  }

  async getStoredComments() {
    try {
      // Get comments from API
      const comments = await window.portfolioAPI.getComments(100);
      return comments || [];
    } catch (error) {
      console.error('Error loading comments from API:', error);
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async loadSavedComments() {
    try {
      const comments = await this.getStoredComments();
      
      // Store in memory for quick access
      this.storedComments = comments.map(c => c.text || c);
      
      console.log(`Loaded ${this.storedComments.length} comments from API`);
    } catch (error) {
      console.error('Error loading saved comments:', error);
      this.storedComments = [];
    }
  }

  createFallingComment(text) {
    // Create comment element
    const comment = document.createElement('div');
    comment.className = 'falling-comment';
    comment.textContent = text;
    
    // Random position and styling
    const startX = Math.random() * (window.innerWidth - 200);
    const startY = -50;
    
    comment.style.left = `${startX}px`;
    comment.style.top = `${startY}px`;
    
    // Add to container
    this.container.appendChild(comment);
    
    // Add to active comments array
    this.fallingComments.push(comment);
    
    // Remove old comments if we have too many
    if (this.fallingComments.length > this.maxActiveComments) {
      const oldComment = this.fallingComments.shift();
      if (oldComment && oldComment.parentNode) {
        oldComment.parentNode.removeChild(oldComment);
      }
    }
    
    // Animate the fall
    const footer = document.querySelector('.footer-bar');
    const footerHeight = footer ? footer.offsetHeight : 0;
    const fallSpeed = 100; // pixels per second
    const totalDistance = window.innerHeight + footerHeight + 50;
    const animationDuration = totalDistance / fallSpeed;
    
    comment.style.transition = `top ${animationDuration}s linear`;
    
    // Trigger animation
    setTimeout(() => {
      comment.style.top = `${totalDistance}px`;
    }, 10);
    
    // Remove element after animation
    setTimeout(() => {
      if (comment.parentNode) {
        comment.parentNode.removeChild(comment);
      }
      // Remove from active comments array
      const index = this.fallingComments.indexOf(comment);
      if (index > -1) {
        this.fallingComments.splice(index, 1);
      }
    }, animationDuration * 1000);
  }

  addInitialComments() {
    const initialComments = [
      'Welcome to my portfolio!',
      'Thanks for visiting!',
      'Hope you like it here',
      'Feel free to explore',
      'Dark mode is pretty cool',
      'Check out my projects!'
    ];
    
    this.storedComments = initialComments;
  }

  startCommentLoop() {
    const spawnComment = () => {
      if (this.storedComments && this.storedComments.length > 0) {
        // Cycle through comments
        const comment = this.storedComments[this.currentCommentIndex];
        this.createFallingComment(comment);
        
        // Move to next comment
        this.currentCommentIndex = (this.currentCommentIndex + 1) % this.storedComments.length;
      }
    };
    
    // Spawn a comment every 3-8 seconds
    const spawnInterval = () => {
      const delay = Math.random() * 5000 + 3000; // 3-8 seconds
      setTimeout(() => {
        spawnComment();
        spawnInterval();
      }, delay);
    };
    
    // Start the loop
    spawnInterval();
  }

  async clearStoredComments() {
    try {
      // Call the API to deactivate all comments
      const result = await window.portfolioAPI.clearComments();
      
      // Clear the local cache
      this.storedComments = [];
      this.currentCommentIndex = 0;
      
      console.log('Comments cleared successfully:', result);
    } catch (error) {
      console.error('Error clearing comments:', error);
      throw error;
    }
  }

  getQueueStatus() {
    return {
      activeComments: this.fallingComments.length,
      storedComments: this.storedComments ? this.storedComments.length : 0,
      currentIndex: this.currentCommentIndex
    };
  }

  setupClearButton() {
    // Only show clear button on comments page
    if (window.location.pathname.includes('comments.html')) {
      const setupButton = () => {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear All Comments';
        clearButton.className = 'clear-comments-btn';
        clearButton.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          padding: 10px 15px;
          background: #ff4757;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        `;
        
        clearButton.addEventListener('click', async () => {
          if (confirm('Are you sure you want to clear all comments?')) {
            await this.clearStoredComments();
            clearButton.textContent = 'Comments Cleared!';
            setTimeout(() => {
              clearButton.textContent = 'Clear All Comments';
            }, 2000);
          }
        });
        
        document.body.appendChild(clearButton);
      };
      
      // Wait for page to load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupButton);
      } else {
        setupButton();
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('falling-comments')) {
    new FallingComments();
  }
}); 