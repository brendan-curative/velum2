/**
 * Drawer Component - Vanilla JavaScript
 * A slide-in drawer that appears from the right side of the screen
 */

class VelumDrawer {
  constructor() {
    this.drawer = null;
    this.toggleButton = null;
    this.closeButton = null;
    this.isOpen = false;
  }

  init() {
    this.drawer = document.getElementById('drawer');
    this.toggleButton = document.getElementById('drawer-toggle');
    this.closeButton = document.getElementById('drawer-close');

    if (!this.drawer || !this.toggleButton) {
      console.warn('Drawer elements not found');
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    // Toggle button click
    this.toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.drawer.contains(e.target) && 
          !this.toggleButton.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.drawer.classList.add('open');
    this.isOpen = true;
    
    // Update aria attributes for accessibility
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.drawer.setAttribute('aria-hidden', 'false');
    
    // Focus management
    if (this.closeButton) {
      this.closeButton.focus();
    }
  }

  close() {
    this.drawer.classList.remove('open');
    this.isOpen = false;
    
    // Update aria attributes for accessibility
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.drawer.setAttribute('aria-hidden', 'true');
    
    // Return focus to toggle button
    this.toggleButton.focus();
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const drawer = new VelumDrawer();
  drawer.init();
});

// Export for manual initialization
window.VelumDrawer = VelumDrawer;
