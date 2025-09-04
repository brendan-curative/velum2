# Component Development Guide

This document outlines the established patterns and methodology for creating components in the Velum design system.

## Component Structure

Each component follows a standardized directory structure:

```
src/components/[component-name]/
├── [component-name].css    # Component styles using design system variables
├── [component-name].html   # Basic HTML template/example
└── [component-name].js     # Optional: Minimal JavaScript functionality (if needed)
```

## Development Process

### 1. Design Analysis
- Review Figma designs thoroughly
- Identify all component states and variants
- Note color usage, spacing, typography, and interactions
- Plan CSS class naming conventions

### 2. Directory Setup
```bash
mkdir -p src/components/[component-name]
```

### 3. CSS Development Principles

#### Use Design System Variables
- **Colors**: Use semantic color variables from `src/css/foundation/colors.css`
  ```css
  /* Good */
  background-color: var(--color-surface-success);
  color: var(--color-text-success);
  
  /* Bad */
  background-color: #e9faf0;
  color: #18543c;
  ```

- **Spacing**: Use spacing variables from `src/css/foundation/spacing.css`
  ```css
  /* Good */
  padding: var(--spacing-16);
  gap: var(--spacing-8);
  
  /* Bad */
  padding: 16px;
  gap: 8px;
  ```

- **Typography**: Use font variables from `src/css/foundation/typography.css`
  ```css
  /* Good */
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  
  /* Bad */
  font-size: 18px;
  font-weight: 600;
  ```

#### CSS Class Naming Convention
- Base class: `.component-name`
- Variants: `.component-name-variant` (e.g., `.badge-success`, `.alert-warning`)
- Elements: `.component-name-element` (e.g., `.alert-icon`, `.badge-text`)
- Modifiers: `.component-name--modifier` (e.g., `.button--large`, `.card--elevated`)

#### Leverage CSS Inheritance
- Use efficient CSS patterns to minimize duplication
- Group common styles in base classes
- Use CSS custom properties for variant-specific values when beneficial

### 4. HTML Template Structure
- Create a basic HTML template showing the component structure
- Use semantic HTML elements
- Include proper accessibility attributes (ARIA labels, roles, etc.)
- Provide clear placeholder content

### 5. JavaScript Guidelines
- Keep JavaScript minimal for this static library
- Only add JavaScript for essential interactions (close buttons, toggles, etc.)
- Use vanilla JavaScript - no frameworks
- Auto-initialize components on DOM ready
- Provide manual functions for programmatic control

### 6. Component Registration
Update `src/components/components.css` to import the new component:
```css
@import '[component-name]/[component-name].css';
```

### 7. Documentation & Examples
Create a comprehensive examples page at `components/[component-name].html`:

```html
---
layout: layout.html
title: Component Name
heading: Component Name
secondary: Brief description of the component
---

<section class="pad-xl">
  <h2>Component Examples</h2>
  <p>Description of the component and its use cases.</p>

  <!-- Example variants -->
  <h3>Variant Name</h3>
  <div style="margin-bottom: 32px;">
    <!-- Component HTML -->
  </div>

  <h3>Usage</h3>
  <div class="code">
    <!-- Escaped HTML showing usage -->
  </div>

  <h3>Available Variants</h3>
  <ul>
    <!-- List of CSS classes and descriptions -->
  </ul>
</section>
```

### 8. Update Component Index
Add the new component to `components/index.html`:
```html
<li><a href="[component-name]/">[Component Name]</a></li>
```

### 9. Sync to Docs
Copy all files to the docs directory:
```bash
cp -r src/components/[component-name] docs/src/components/
cp src/components/components.css docs/src/components/
cp components/[component-name].html docs/components/
cp components/index.html docs/components/
```

## Established Component Patterns

### Color Semantics
- **Success**: Green variants for positive actions/states
- **Warning**: Orange variants for caution/attention
- **Critical/Error**: Red variants for errors/destructive actions
- **Neutral**: Gray variants for default/inactive states
- **Highlight**: Blue variants for informational content

### Common Component Elements
- **Icons**: 24x24px SVG icons using `currentColor`
- **Close buttons**: Consistent close functionality across components
- **Status indicators**: Color-coded visual feedback
- **Content containers**: Proper padding and spacing using design system variables

### Accessibility Standards
- Proper semantic markup
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance

## File Naming Conventions
- **CSS files**: `component-name.css`
- **HTML templates**: `component-name.html`
- **JavaScript**: `component-name.js`
- **Example pages**: `component-name.html` (singular, in `/components/` directory)
- **Component directories**: `component-name` (singular, lowercase, hyphenated)

## Quality Checklist
Before considering a component complete:

- [ ] Uses design system variables consistently
- [ ] Follows established naming conventions
- [ ] Includes all design variants from Figma
- [ ] Has proper accessibility attributes
- [ ] Includes comprehensive examples
- [ ] JavaScript is minimal and functional
- [ ] Files are synced to docs directory
- [ ] Component is registered in components.css
- [ ] Examples page is linked in index

## Reference Components
- **Badge**: Static component with status variants and optional icons
- **Alert**: Interactive component with close functionality and status variants

These components serve as the foundation for our design system patterns and should be referenced when creating new components.
