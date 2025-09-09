/**
 * Accordion Component - Expand/Collapse Functionality
 * Simple JavaScript to handle accordion interaction
 */

// Auto-initialize accordion functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Accordion script loaded');
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  console.log('Found accordion headers:', accordionHeaders.length);
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      console.log('Accordion header clicked');
      toggleAccordion(header);
    });

    // Handle keyboard interaction
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(header);
      }
    });

    // Handle focus states
    header.addEventListener('focus', function() {
      header.closest('.accordion').classList.add('accordion-focused');
    });

    header.addEventListener('blur', function() {
      header.closest('.accordion').classList.remove('accordion-focused');
    });
  });
});

// Toggle accordion state
function toggleAccordion(header) {
  console.log('Toggle accordion called');
  const accordion = header.closest('.accordion');
  const content = header.nextElementSibling;
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  console.log('Current state expanded:', isExpanded);
  
  // Close other accordions in the same container (optional single-accordion mode)
  const container = accordion.parentElement;
  if (container && container.classList.contains('accordion-group')) {
    const otherAccordions = container.querySelectorAll('.accordion');
    otherAccordions.forEach(otherAccordion => {
      if (otherAccordion !== accordion) {
        const otherHeader = otherAccordion.querySelector('.accordion-header');
        const otherContent = otherAccordion.querySelector('.accordion-content');
        
        otherAccordion.classList.remove('accordion-expanded');
        otherHeader.setAttribute('aria-expanded', 'false');
        if (otherContent) {
          otherContent.style.maxHeight = '0';
        }
      }
    });
  }
  
  // Toggle current accordion
  if (isExpanded) {
    // Close accordion
    accordion.classList.remove('accordion-expanded');
    header.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0';
  } else {
    // Open accordion
    accordion.classList.add('accordion-expanded');
    header.setAttribute('aria-expanded', 'true');
    
    // Set max-height to scroll height for smooth animation
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // After animation, set to auto for responsive content
    setTimeout(() => {
      if (accordion.classList.contains('accordion-expanded')) {
        content.style.maxHeight = 'auto';
      }
    }, 300);
  }
}

// Export functions for manual use
window.openAccordion = function(accordionElement) {
  const header = accordionElement.querySelector('.accordion-header');
  if (header && header.getAttribute('aria-expanded') === 'false') {
    toggleAccordion(header);
  }
};

window.closeAccordion = function(accordionElement) {
  const header = accordionElement.querySelector('.accordion-header');
  if (header && header.getAttribute('aria-expanded') === 'true') {
    toggleAccordion(header);
  }
};

window.toggleAccordion = toggleAccordion;
