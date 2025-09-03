/**
 * Button Component - Vanilla JavaScript
 * Basic button functionality with accessibility features
 */

class VelumButton {
  constructor(element) {
    this.button = element;
    this.init();
  }

  init() {
    if (!this.button) return;
    
    this.bindEvents();
    this.setupAccessibility();
  }

  bindEvents() {
    this.button.addEventListener('click', (e) => this.handleClick(e));
    this.button.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  setupAccessibility() {
    // Ensure button has proper role
    if (!this.button.getAttribute('role')) {
      this.button.setAttribute('role', 'button');
    }
    
    // Ensure button is focusable
    if (!this.button.hasAttribute('tabindex') && this.button.tagName !== 'BUTTON') {
      this.button.setAttribute('tabindex', '0');
    }
  }

  handleClick(event) {
    // Emit custom event for button click
    const buttonEvent = new CustomEvent('velum:button:click', {
      detail: { button: this.button, originalEvent: event }
    });
    this.button.dispatchEvent(buttonEvent);
  }

  handleKeydown(event) {
    // Handle Enter and Space key activation for non-button elements
    if ((event.key === 'Enter' || event.key === ' ') && this.button.tagName !== 'BUTTON') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  disable() {
    this.button.disabled = true;
    this.button.setAttribute('aria-disabled', 'true');
  }

  enable() {
    this.button.disabled = false;
    this.button.setAttribute('aria-disabled', 'false');
  }
}

// Auto-initialize buttons
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.button, button');
  buttons.forEach(button => new VelumButton(button));
});

// Export for manual initialization
window.VelumButton = VelumButton;
