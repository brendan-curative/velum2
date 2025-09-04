/**
 * Alert Component - Minimal Close Functionality
 * Simple JavaScript to handle alert dismissal
 */

// Auto-initialize alert close buttons
document.addEventListener('DOMContentLoaded', function() {
  const alertCloseButtons = document.querySelectorAll('.alert-close');
  
  alertCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const alert = button.closest('.alert');
      if (alert) {
        alert.style.display = 'none';
      }
    });
  });
});

// Export function for manual use
window.closeAlert = function(alertElement) {
  if (alertElement) {
    alertElement.style.display = 'none';
  }
};
