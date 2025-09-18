/**
 * ThemeToggle Plugin - Theme Toggle
 * Toggles data-theme attribute between "cui" and "blv" on the HTML element
 */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.getCurrentTheme();
    this.toggleButton = null;
  }

  init() {
    // Find or create the toggle button
    this.toggleButton = document.getElementById('theme-toggle');
    
    if (!this.toggleButton) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Set initial state
    this.updateUI();
    
    // Bind click event
    this.toggleButton.addEventListener('click', () => this.toggleTheme());
    
    console.log('Theme switcher initialized with theme:', this.currentTheme);
  }

  getCurrentTheme() {
    const htmlElement = document.documentElement;
    return htmlElement.getAttribute('data-theme') || 'blv';
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'cui' ? 'blv' : 'cui';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    if (theme !== 'cui' && theme !== 'blv') {
      console.warn('Invalid theme:', theme);
      return;
    }

    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    // Update UI to reflect new theme
    this.updateUI();
    
    // Store preference in localStorage
    localStorage.setItem('velum-theme', theme);
    
    console.log('Theme switched to:', theme);
  }

  updateUI() {
    if (!this.toggleButton) return;

    // Update button aria-label
    const nextTheme = this.currentTheme === 'cui' ? 'blv' : 'cui';
    const nextThemeLabel = nextTheme === 'cui' ? 'Light' : 'Dark';
    this.toggleButton.setAttribute('aria-label', `Switch to ${nextThemeLabel} theme`);

    // Update icon visibility
    const icons = this.toggleButton.querySelectorAll('[data-theme-icon]');
    icons.forEach(icon => {
      const iconTheme = icon.getAttribute('data-theme-icon');
      const shouldShow = iconTheme === nextTheme;
      icon.style.display = shouldShow ? 'inline-flex' : 'none';
    });

    // Update text visibility
    const texts = this.toggleButton.querySelectorAll('[data-theme-text]');
    texts.forEach(text => {
      const textTheme = text.getAttribute('data-theme-text');
      const shouldShow = textTheme === nextTheme;
      text.style.display = shouldShow ? 'inline' : 'none';
    });

    // Update button class for styling
    this.toggleButton.setAttribute('data-current-theme', this.currentTheme);
  }

  // Check for saved theme preference on page load
  initializeFromStorage() {
    const savedTheme = localStorage.getItem('velum-theme');
    if (savedTheme && (savedTheme === 'cui' || savedTheme === 'blv')) {
      this.setTheme(savedTheme);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const themeSwitcher = new ThemeSwitcher();
  
  // Check for saved preference first
  themeSwitcher.initializeFromStorage();
  
  // Initialize the switcher
  themeSwitcher.init();
});

// Export for manual initialization
window.ThemeSwitcher = ThemeSwitcher;
