/**
 * Velum Comments Widget - GitHub Issues Integration
 * A lightweight comments widget built on GitHub issues, similar to utterances
 */

class VelumComments {
  constructor(config) {
    this.config = {
      repo: config.repo || '',
      'issue-term': config['issue-term'] || 'pathname',
      label: config.label || 'comments',
      theme: config.theme || 'github-light',
      crossorigin: config.crossorigin || 'anonymous',
      ...config
    };
    
    this.container = null;
    this.comments = [];
    this.issue = null;
    this.isLoading = false;
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  async init(container) {
    this.container = container;
    
    // Check for existing authentication
    await this.checkAuthStatus();
    
    this.render();
    await this.loadComments();
  }

  render() {
    this.container.innerHTML = `
      <div class="velum-comments">
        <div class="velum-comments-header">
          <h3>Comments</h3>
          <div class="velum-comments-auth">
            <button id="velum-auth-btn" class="btn btn-primary">
              Sign in with GitHub to comment
            </button>
            <button id="velum-logout-btn" class="btn btn-secondary" style="display: none; margin-left: 8px;">
              Sign out
            </button>
          </div>
        </div>
        <div id="velum-comments-list" class="velum-comments-list">
          <div class="velum-loading">Loading comments...</div>
        </div>
        <div id="velum-comment-form" class="velum-comment-form" style="display: none;">
          <textarea id="velum-comment-textarea" placeholder="Leave a comment" rows="4"></textarea>
          <div class="velum-comment-actions">
            <button id="velum-comment-submit" class="btn btn-primary">Comment</button>
            <button id="velum-comment-cancel" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const authBtn = document.getElementById('velum-auth-btn');
    const logoutBtn = document.getElementById('velum-logout-btn');
    const submitBtn = document.getElementById('velum-comment-submit');
    const cancelBtn = document.getElementById('velum-comment-cancel');
    const textarea = document.getElementById('velum-comment-textarea');

    if (authBtn) {
      authBtn.addEventListener('click', () => this.authenticate());
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitComment());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelComment());
    }

    if (textarea) {
      textarea.addEventListener('focus', () => this.showCommentForm());
    }
  }

  logout() {
    localStorage.removeItem('github_token');
    this.isAuthenticated = false;
    this.currentUser = null;
    this.updateAuthState(false);
  }

  async loadComments() {
    if (!this.config.repo) {
      this.showError('Repository not configured');
      return;
    }

    try {
      this.isLoading = true;
      const issue = await this.findOrCreateIssue();
      
      if (issue) {
        this.issue = issue;
        const comments = await this.fetchComments(issue.number);
        this.displayComments(comments);
      } else {
        this.displayNoComments();
      }
    } catch (error) {
      this.showError('Failed to load comments: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }

  async findOrCreateIssue() {
    const issueTitle = this.getIssueTitle();
    const searchQuery = `repo:${this.config.repo} in:title "${issueTitle}"`;
    
    try {
      const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error finding issue:', error);
      return null;
    }
  }

  async fetchComments(issueNumber) {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.config.repo}/issues/${issueNumber}/comments`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  displayComments(comments) {
    const commentsList = document.getElementById('velum-comments-list');
    
    if (!comments || comments.length === 0) {
      this.displayNoComments();
      return;
    }

    const commentsHtml = comments.map(comment => this.renderComment(comment)).join('');
    
    commentsList.innerHTML = `
      <div class="velum-comments-count">
        ${comments.length} comment${comments.length !== 1 ? 's' : ''}
      </div>
      ${commentsHtml}
    `;
  }

  displayNoComments() {
    const commentsList = document.getElementById('velum-comments-list');
    commentsList.innerHTML = `
      <div class="velum-no-comments">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    `;
  }

  renderComment(comment) {
    const createdAt = new Date(comment.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="velum-comment">
        <div class="velum-comment-header">
          <img src="${comment.user.avatar_url}" alt="${comment.user.login}" class="velum-comment-avatar">
          <div class="velum-comment-meta">
            <strong class="velum-comment-author">${comment.user.login}</strong>
            <span class="velum-comment-date">${createdAt}</span>
          </div>
        </div>
        <div class="velum-comment-body">
          ${this.parseMarkdown(comment.body)}
        </div>
      </div>
    `;
  }

  parseMarkdown(text) {
    // Basic markdown parsing - in a real implementation you'd use a proper markdown parser
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  getIssueTitle() {
    switch (this.config['issue-term']) {
      case 'pathname':
        return document.location.pathname;
      case 'url':
        return document.location.href;
      case 'title':
        return document.title;
      default:
        return this.config['issue-term'];
    }
  }

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    const token = this.getGitHubToken();
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    return headers;
  }

  getGitHubToken() {
    // In a real implementation, this would handle OAuth flow
    return localStorage.getItem('github_token');
  }

  authenticate() {
    this.showTokenDialog();
  }

  showTokenDialog() {
    // Create a better token input dialog
    const dialog = document.createElement('div');
    dialog.className = 'velum-token-dialog';
    dialog.innerHTML = `
      <div class="velum-token-overlay">
        <div class="velum-token-modal">
          <div class="velum-token-header">
            <h3>GitHub Authentication Required</h3>
            <button class="velum-token-close">&times;</button>
          </div>
          <div class="velum-token-body">
            <p>To comment, you need a GitHub personal access token with access to this repository.</p>
            <div class="velum-token-steps">
              <h4>How to create a token:</h4>
              <ol>
                <li>Go to <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings → Personal access tokens</a></li>
                <li>Click "Generate new token (classic)"</li>
                <li>Select scopes: <code>repo</code> (for private repos) or <code>public_repo</code> (for public repos)</li>
                <li>Copy the generated token and paste it below</li>
              </ol>
            </div>
            <div class="velum-token-input">
              <label for="github-token">Personal Access Token:</label>
              <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
              <small>Your token will be stored locally in your browser</small>
            </div>
          </div>
          <div class="velum-token-actions">
            <button class="btn btn-secondary velum-token-cancel">Cancel</button>
            <button class="btn btn-primary velum-token-save">Save Token</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    // Add event listeners
    dialog.querySelector('.velum-token-close').addEventListener('click', () => this.closeTokenDialog(dialog));
    dialog.querySelector('.velum-token-cancel').addEventListener('click', () => this.closeTokenDialog(dialog));
    dialog.querySelector('.velum-token-save').addEventListener('click', () => this.saveToken(dialog));
    dialog.querySelector('#github-token').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveToken(dialog);
    });

    // Focus the input
    dialog.querySelector('#github-token').focus();
  }

  closeTokenDialog(dialog) {
    document.body.removeChild(dialog);
  }

  async saveToken(dialog) {
    const tokenInput = dialog.querySelector('#github-token');
    const token = tokenInput.value.trim();
    
    if (!token) {
      alert('Please enter a valid GitHub personal access token');
      return;
    }

    // Validate token before saving
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('github_token', token);
        this.isAuthenticated = true;
        this.currentUser = user;
        this.updateAuthState(true);
        this.closeTokenDialog(dialog);
        
        // Show success message
        this.showMessage('Successfully authenticated as ' + user.login, 'success');
      } else {
        throw new Error('Invalid token or insufficient permissions');
      }
    } catch (error) {
      alert('Authentication failed: ' + error.message);
    }
  }

  showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `velum-message velum-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
      messageDiv.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
      messageDiv.style.backgroundColor = '#dc3545';
    } else {
      messageDiv.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          document.body.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }

  async checkAuthStatus() {
    const token = this.getGitHubToken();
    if (!token) {
      this.isAuthenticated = false;
      this.currentUser = null;
      return;
    }

    try {
      // Validate token with GitHub API
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const user = await response.json();
        this.isAuthenticated = true;
        this.currentUser = user;
      } else {
        // Invalid token
        localStorage.removeItem('github_token');
        this.isAuthenticated = false;
        this.currentUser = null;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.isAuthenticated = false;
      this.currentUser = null;
    }
  }

  updateAuthState(isAuthenticated) {
    const authBtn = document.getElementById('velum-auth-btn');
    const commentForm = document.getElementById('velum-comment-form');
    
    if (isAuthenticated && this.currentUser) {
      authBtn.style.display = 'none';
      authBtn.textContent = `Signed in as ${this.currentUser.login}`;
      commentForm.style.display = 'block';
      
      // Add logout option
      const logoutBtn = document.getElementById('velum-logout-btn');
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
      }
    } else {
      authBtn.style.display = 'block';
      authBtn.textContent = 'Sign in with GitHub to comment';
      commentForm.style.display = 'none';
      
      const logoutBtn = document.getElementById('velum-logout-btn');
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
    }
  }

  showCommentForm() {
    const token = this.getGitHubToken();
    if (!token) {
      this.authenticate();
    }
  }

  async submitComment() {
    const textarea = document.getElementById('velum-comment-textarea');
    const comment = textarea.value.trim();
    
    if (!comment) {
      alert('Please enter a comment');
      return;
    }

    if (!this.issue) {
      // Create issue first
      try {
        this.issue = await this.createIssue();
      } catch (error) {
        this.showError('Failed to create issue: ' + error.message);
        return;
      }
    }

    try {
      await this.postComment(comment);
      textarea.value = '';
      await this.loadComments(); // Reload comments
    } catch (error) {
      this.showError('Failed to post comment: ' + error.message);
    }
  }

  async createIssue() {
    const title = this.getIssueTitle();
    const body = `Comments for: ${document.location.href}`;
    
    const response = await fetch(`https://api.github.com/repos/${this.config.repo}/issues`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        labels: [this.config.label]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create issue: ${response.status}`);
    }
    
    return await response.json();
  }

  async postComment(comment) {
    const response = await fetch(`https://api.github.com/repos/${this.config.repo}/issues/${this.issue.number}/comments`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: comment
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.status}`);
    }
    
    return await response.json();
  }

  cancelComment() {
    const textarea = document.getElementById('velum-comment-textarea');
    textarea.value = '';
    textarea.blur();
  }

  showError(message) {
    const commentsList = document.getElementById('velum-comments-list');
    commentsList.innerHTML = `
      <div class="velum-error">
        <p>Error: ${message}</p>
      </div>
    `;
  }
}

// Auto-initialize if script is loaded with data attributes
document.addEventListener('DOMContentLoaded', function() {
  const script = document.querySelector('script[data-repo]');
  if (script) {
    const config = {};
    for (const attr of script.attributes) {
      if (attr.name.startsWith('data-')) {
        const key = attr.name.replace('data-', '');
        config[key] = attr.value;
      }
    }
    
    const container = document.getElementById('comments');
    if (container) {
      const comments = new VelumComments(config);
      comments.init(container);
    }
  }
});

// Export for manual initialization
window.VelumComments = VelumComments;

