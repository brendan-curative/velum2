# Heroicons Library

This directory contains the complete Heroicons library imported from [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons/tree/master/src).

## Structure

```
hero-icons/
├── 16/
│   └── solid/          # 16px solid icons (mini)
├── 20/
│   └── solid/          # 20px solid icons 
└── 24/
    ├── outline/        # 24px outline icons
    └── solid/          # 24px solid icons
```

## Icon Sizes & Styles

- **16px (Mini)**: Solid style only - for tight spaces, buttons, form elements
- **20px**: Solid style only - for medium UI elements  
- **24px**: Both outline and solid styles - for primary navigation, headers

## Total Icons: 1,288 SVG files

## Usage in Velum Components

### Direct SVG Include
```html
<img src="{{ '/' | url }}src/img/icons/hero-icons/24/outline/user.svg" alt="User icon">
```

### Inline SVG (copy contents)
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <!-- Copy SVG contents from the icon file -->
</svg>
```

### CSS Background
```css
.icon-user {
  background-image: url('/velum2/src/img/icons/hero-icons/24/outline/user.svg');
}
```

## Popular Icons Available

- Navigation: `home`, `menu`, `x-mark`, `chevron-down`, `chevron-up`, `arrow-left`, `arrow-right`
- User: `user`, `user-circle`, `users`, `user-plus`, `user-minus`
- Actions: `plus`, `minus`, `pencil`, `trash`, `check`, `x-mark`
- Communication: `chat-bubble-left`, `envelope`, `phone`, `bell`
- Media: `play`, `pause`, `stop`, `heart`, `star`, `share`
- Status: `check-circle`, `x-circle`, `exclamation-triangle`, `information-circle`
- Navigation: `magnifying-glass`, `funnel`, `adjustments-horizontal`

## License

Icons are licensed under MIT License by Tailwind Labs. See original repository for full license details.

## References

- [Heroicons Official Site](https://heroicons.com/)
- [GitHub Repository](https://github.com/tailwindlabs/heroicons)
- [Heroicons Documentation](https://heroicons.com/)
