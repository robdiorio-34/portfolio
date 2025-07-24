// Falling Comments Feature
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
    
    // Load saved comments first
    this.loadSavedComments();
    
    // Start with some initial comments if no saved ones
    if (this.getStoredComments().length === 0) {
      this.addInitialComments();
    }
    
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
    
    // Update existing comments (optional - they'll continue with their original timing)
    // This is mainly for debugging and future enhancement
  }

  submitComment() {
    const comment = this.commentBuffer.trim();
    
    if (comment.length > 0) {
      this.createFallingComment(comment);
      this.saveComment(comment);
      this.commentBuffer = '';
    }
  }

  saveComment(comment) {
    const storedComments = this.getStoredComments();
    
    // Add new comment with timestamp
    const commentData = {
      text: comment,
      timestamp: Date.now()
    };
    
    // Add to end of queue (FIFO - newest at the end)
    storedComments.push(commentData);
    
    // If queue exceeds max size, remove oldest comment (FIFO - remove from beginning)
    if (storedComments.length > this.maxStoredComments) {
      storedComments.shift(); // Remove first (oldest) comment
    }
    
    // Save to localStorage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(storedComments));
    } catch (error) {
      console.warn('Could not save comment to localStorage:', error);
    }
  }

  getStoredComments() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Could not load comments from localStorage:', error);
      return [];
    }
  }

  loadSavedComments() {
    const storedComments = this.getStoredComments();
    
    if (storedComments.length > 0) {
      // Add saved comments with staggered timing
      storedComments.forEach((commentData, index) => {
        setTimeout(() => {
          this.createFallingComment(commentData.text);
        }, index * 500); // Stagger by 0.5 seconds
      });
    }
  }

  createFallingComment(text) {
    if (!this.container) {
      return;
    }
    
    // Limit active comments for performance
    if (this.fallingComments.length >= this.maxActiveComments) {
      const oldestComment = this.fallingComments.shift();
      if (oldestComment && oldestComment.element) {
        oldestComment.element.remove();
      }
    }

    const commentElement = document.createElement('div');
    commentElement.className = 'falling-comment';
    commentElement.textContent = text;
    
    // Random position along x-axis - account for comment length
    const commentWidth = text.length * 12; // Approximate width based on character count
    const maxX = window.innerWidth - commentWidth - 50; // 50px buffer from right edge
    const minX = 50; // 50px buffer from left edge
    const randomX = Math.random() * (maxX - minX) + minX;
    commentElement.style.left = `${randomX}px`;
    
    // Random size variation for more fun appearance
    const sizeVariations = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4];
    const randomSize = sizeVariations[Math.floor(Math.random() * sizeVariations.length)];
    commentElement.style.fontSize = `${1.2 * randomSize}rem`;
    
    // Random rotation for more dynamic appearance
    const rotationVariations = [-5, -3, -2, -1, 0, 1, 2, 3, 5];
    const randomRotation = rotationVariations[Math.floor(Math.random() * rotationVariations.length)];
    commentElement.style.transform = `rotate(${randomRotation}deg)`;
    
    // Random color variation for more vibrant appearance
    const colorVariations = [
      '#1e40af', // Dark blue
      '#2563eb', // Blue
      '#3b82f6', // Light blue
      '#1d4ed8', // Royal blue
      '#1e3a8a', // Navy blue
      '#7c3aed', // Purple
      '#059669', // Green
      '#dc2626'  // Red
    ];
    const randomColor = colorVariations[Math.floor(Math.random() * colorVariations.length)];
    commentElement.style.color = randomColor;
    
    // Calculate footer height to determine when comment should disappear
    const footer = document.querySelector('.footer-bar');
    const footerHeight = footer ? footer.offsetHeight : 0;
    
    // Calculate animation duration based on viewport height + footer height
    // Use a consistent fall speed (pixels per second)
    const fallSpeed = 100; // pixels per second
    const totalDistance = window.innerHeight + footerHeight + 50; // 50px for initial offset
    const animationDuration = totalDistance / fallSpeed;
    
    // Set custom animation duration
    commentElement.style.animationDuration = `${animationDuration}s`;
    
    this.container.appendChild(commentElement);
    
    // Store reference for cleanup
    const commentObj = {
      element: commentElement,
      text: text,
      createdAt: Date.now()
    };
    
    this.fallingComments.push(commentObj);
    
    // Remove element after animation completes
    setTimeout(() => {
      if (commentElement.parentNode) {
        commentElement.remove();
      }
      // Remove from array
      const index = this.fallingComments.indexOf(commentObj);
      if (index > -1) {
        this.fallingComments.splice(index, 1);
      }
    }, animationDuration * 1000); // Convert to milliseconds
  }

  addInitialComments() {
    const initialComments = [
        "Type something and press enter to drop a comment! 💬",
        "Cool! 😎",
        "Nice! 👍",
        "Awesome! 🤩"
    ];

    // Add initial comments with delays
    initialComments.forEach((comment, index) => {
      setTimeout(() => {
        this.createFallingComment(comment);
      }, index * 1000); // Stagger by 1 second
    });
  }

  startCommentLoop() {
    // Spawn new comments periodically
    setInterval(() => {
      if (this.fallingComments.length < this.maxActiveComments) {
        const storedComments = this.getStoredComments();
        
        if (storedComments.length > 0) {
          // Use stored comments in sequential order
          const commentData = storedComments[this.currentCommentIndex];
          this.createFallingComment(commentData.text);
          
          // Move to next comment, cycle back to beginning if at end
          this.currentCommentIndex = (this.currentCommentIndex + 1) % storedComments.length;
        } else {
          // Fallback to default comments in sequential order
          const defaultComments = [
            "Type something and press enter to drop a comment! 💬",
            "Cool! 😎",
            "Nice! 👍",
            "Awesome! 🤩"
          ];
          
          const comment = defaultComments[this.currentCommentIndex % defaultComments.length];
          this.createFallingComment(comment);
          
          // Move to next comment, cycle back to beginning if at end
          this.currentCommentIndex = (this.currentCommentIndex + 1) % defaultComments.length;
        }
      }
    }, 3000); // Spawn every 3 seconds
  }

  // Utility method to clear all stored comments
  clearStoredComments() {
    try {
      localStorage.removeItem(this.storageKey);
      this.currentCommentIndex = 0; // Reset index when clearing
    } catch (error) {
      console.warn('Could not clear stored comments:', error);
    }
  }

  // Utility method to get queue status
  getQueueStatus() {
    const storedComments = this.getStoredComments();
    return storedComments;
  }

  setupClearButton() {
    // Wait for footer to be loaded, then set up clear button
    const setupButton = () => {
      const clearButton = document.getElementById('clear-queue-btn');
      
      // Check if we're on the comments page - more robust path detection
      const isCommentsPage = window.location.pathname.includes('comments.html') || 
                           window.location.pathname.includes('/comments') ||
                           window.location.pathname.endsWith('/') && document.querySelector('.comments-page');
      
      if (clearButton && isCommentsPage) {
        console.log('Clear button found and setting up...');
        
        // Add class to body for CSS targeting
        document.body.classList.add('comments-page-active');
        console.log('Added comments-page-active class to body');
        
        // Add click event listener
        clearButton.addEventListener('click', () => {
          console.log('Clear button clicked!');
          
          // Clear stored comments
          this.clearStoredComments();
          
          // Remove all visible falling comments
          this.fallingComments.forEach(commentObj => {
            if (commentObj.element && commentObj.element.parentNode) {
              commentObj.element.remove();
            }
          });
          
          // Clear the array
          this.fallingComments = [];
          
          // Reset comment index
          this.currentCommentIndex = 0;
          
          // Visual feedback
          clearButton.textContent = 'Cleared!';
          clearButton.classList.add('cleared');
          setTimeout(() => {
            clearButton.textContent = 'Clear Queue';
            clearButton.classList.remove('cleared');
          }, 2000);
        });
        
        console.log('Clear button setup complete');
        
        // Check if button is actually visible
        const computedStyle = window.getComputedStyle(clearButton);
        console.log('Button display style:', computedStyle.display);
        console.log('Button visibility:', computedStyle.visibility);
        
        return true; // Successfully set up
      }
      
      console.log('Clear button not found yet, retrying...');
      return false; // Button not found yet
    };
    
    // Try to set up immediately
    if (!setupButton()) {
      // If button not found, retry after a short delay
      setTimeout(() => {
        if (!setupButton()) {
          // If still not found, retry again after another delay
          setTimeout(() => {
            if (!setupButton()) {
              console.warn('Clear button setup failed after multiple attempts');
              
              // Set up mutation observer as a last resort
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id === 'clear-queue-btn' || node.querySelector('#clear-queue-btn')) {
                          console.log('Clear button found via mutation observer');
                          setupButton();
                          observer.disconnect();
                        }
                      }
                    });
                  }
                });
              });
              
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
            }
          }, 500);
        }
      }, 100);
    }
  }
}

// Initialize falling comments when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FallingComments();
}); 