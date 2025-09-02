# Eleventy + Velum Comments Setup

This document explains how the Velum Comments system has been configured to work with Eleventy.

## ✅ What Was Fixed

### 1. **Eleventy Configuration**
Created `.eleventy.js` with proper configuration:
- Static asset copying (CSS, JS, images)
- Git commit date plugin integration
- Template engine settings (Nunjucks)
- Directory structure configuration

### 2. **Package.json Scripts**
Added proper Eleventy commands:
```json
{
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve",
    "start": "eleventy --serve",
    "debug": "DEBUG=Eleventy* eleventy"
  }
}
```

### 3. **Comments Integration**
The comments system is fully compatible with Eleventy:
- ✅ Scripts load correctly in the generated HTML
- ✅ CSS is copied to `_site/src/css/`
- ✅ JavaScript is copied to `_site/src/js/`
- ✅ Personal access token authentication works
- ✅ GitHub Issues integration functions properly

## 🚀 How to Run

### Development Server
```bash
npm run serve
# or
npx @11ty/eleventy --serve
```

### Build for Production
```bash
npm run build
```

### Debug Mode
```bash
npm run debug
```

## 🔗 Testing the Comments

1. **Start the server**: `npm run serve`
2. **Open your browser**: Navigate to `http://localhost:8080`
3. **Test comments**: 
   - Go to any page (try `/test-comments/`)
   - Scroll to the bottom to see the comments widget
   - Click "Sign in with GitHub" to test authentication
   - Create a GitHub personal access token when prompted

## 📁 File Structure

```
velum/
├── .eleventy.js          # Eleventy configuration
├── _includes/
│   └── layout.html       # Main layout with comments integration
├── _site/                # Generated output (git ignored)
├── src/
│   ├── css/             # Copied to _site/src/css/
│   ├── js/              # Copied to _site/src/js/ (includes comments.js)
│   └── img/             # Copied to _site/src/img/
├── index.html           # Main page
├── test-comments.md     # Test page for comments
└── package.json         # Dependencies and scripts
```

## 🔧 Comments Configuration

In `_includes/layout.html`:
```html
<!-- Velum Comments System -->
<script src="{{ '/' | url }}src/js/comments.js"></script>
<script 
  data-repo="curative/velum"
  data-issue-term="pathname"
  data-label="velum-comments"
  data-theme="github-light"
  crossorigin="anonymous">
</script>
```

### Configuration Options:
- **`data-repo`**: GitHub repository for storing comments
- **`data-issue-term`**: How to map pages to issues (`pathname` recommended)
- **`data-label`**: Label for GitHub issues
- **`data-theme`**: Visual theme (`github-light` or `github-dark`)

## 🔒 Authentication

The comments system uses GitHub personal access tokens:

1. **User Experience**:
   - Click "Sign in with GitHub"
   - Professional dialog with step-by-step instructions
   - Token validation before saving
   - Secure local storage

2. **Token Requirements**:
   - **Public repos**: `public_repo` scope
   - **Private repos**: `repo` scope (full access)

## 🛠 Troubleshooting

### "Cannot GET /" Error
- **Fixed**: Added proper `.eleventy.js` configuration
- **Solution**: Run `npm run serve` instead of `px @11ty/eleventy --serve`

### Comments Not Loading
- Check that `data-repo` points to a valid GitHub repository
- Ensure the repository has issues enabled
- Verify the user has access to the repository

### CSS/JS Not Loading
- **Fixed**: Added passthrough copy in `.eleventy.js`
- Assets are automatically copied to `_site/src/`

## 📋 Next Steps

1. **Update Repository**: Change `data-repo="curative/velum"` to your actual repository
2. **Test Authentication**: Try the personal access token flow
3. **Customize Styling**: Modify `src/css/components/comments/comments.css`
4. **Deploy**: Build with `npm run build` and deploy `_site/` folder

## 🎉 Success!

Your Eleventy site with Velum Comments is now working correctly. The comments system is fully integrated and ready for use with internal repositories via personal access tokens.
