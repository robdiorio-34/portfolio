// Supabase Client Utility for Frontend
// This file provides a simple interface to interact with our API endpoints

class PortfolioAPI {
  constructor() {
    this.baseURL = window.location.origin;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}/api/${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Books API methods
  async getBooks(status = null) {
    const params = status ? `?status=${status}` : '';
    return this.apiCall(`books${params}`);
  }

  async createBook(bookData) {
    return this.apiCall('books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(bookId, bookData) {
    return this.apiCall('books', {
      method: 'PUT',
      body: JSON.stringify({ id: bookId, ...bookData }),
    });
  }

  async deleteBook(bookId) {
    return this.apiCall(`books?id=${bookId}`, {
      method: 'DELETE',
    });
  }

  // Comments API methods
  async getComments(limit = 50) {
    return this.apiCall(`comments?limit=${limit}`);
  }

  async createComment(commentData) {
    return this.apiCall('comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(commentId) {
    return this.apiCall(`comments?id=${commentId}`, {
      method: 'DELETE',
    });
  }

  async clearComments() {
    return this.apiCall('comments/clear', {
      method: 'POST',
    });
  }

  // Projects API methods
  async getProjects(featured = null) {
    const params = featured !== null ? `?featured=${featured}` : '';
    return this.apiCall(`projects${params}`);
  }

  async createProject(projectData) {
    return this.apiCall('projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectData) {
    return this.apiCall('projects', {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId) {
    return this.apiCall(`projects?id=${projectId}`, {
      method: 'DELETE',
    });
  }
}

// Create a global instance
window.portfolioAPI = new PortfolioAPI(); 