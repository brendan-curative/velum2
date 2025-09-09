# Velum Comments Setup Guide

This guide will help you set up the Velum Comments system for Eleventy sites, which provides GitHub-based commenting using **personal access tokens**.

## Overview

The Velum Comments system allows visitors to leave comments on your Eleventy static site using GitHub issues as the backend. Comments are stored as GitHub issue comments, making them easy to moderate and manage.

**🔒 Perfect for Internal Repos**: This system works with private/internal repositories using GitHub personal access tokens, without requiring 3rd party bots as collaborators or external dependencies.

## Prerequisites

1. **Eleventy site** (this guide assumes you're using Eleventy)
2. **GitHub repository** to store comments (public, private, or internal)
3. **Users with GitHub accounts** who have access to the repository

## Quick Setup

### 1. Install Dependencies

```bash
npm install @11ty/eleventy eleventy-plugin-git-commit-date
```

### 2. Configure Eleventy

Create `.eleventy.js` in your project root:

```js
module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  
  // Add git commit date plugin
  const pluginGitCommitDate = require('eleventy-plugin-git-commit-date');
  eleventyConfig.addPlugin(pluginGitCommitDate);

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
```

### 3. Configure Repository

Update the `data-repo` attribute in your `_includes/layout.html` file:

```html
<!-- Velum Comments System -->
<script src="{{ '/' | url }}src/plugins/comments/comments.js"></script>
<script 
  data-repo="your-username/your-repo-name"
  data-issue-term="pathname"
  data-label="comments"
  data-theme="github-light"
  crossorigin="anonymous">
</script>
```

**Important**: Replace `your-username/your-repo-name` with your actual GitHub repository path.

### 4. Add Comments Container

Make sure your layout includes a comments container:

```html
<div id="comments">
  <!-- Comments will be loaded here by the Velum Comments widget -->
</div>
```

### 5. Start Development Server

```bash
npm run serve
# or
npx @11ty/eleventy --serve
```

Your site will be available at `http://localhost:8080` (or next available port).

## Configuration Options

- **`data-repo`**: Your GitHub repository in the format `username/repository`
- **`data-issue-term`**: How to map pages to GitHub issues
  - `pathname` - Use the page path (recommended)
  - `url` - Use the full URL
  - `title` - Use the page title
  - Custom string - Use a specific identifier
- **`data-label`**: Label to add to GitHub issues (default: "comments")
- **`data-theme`**: Visual theme (`github-light` or `github-dark`)
- **`crossorigin`**: CORS setting for security

## How Authentication Works

When users want to comment, they'll be prompted to enter a GitHub personal access token. The system provides clear instructions on how to create one:

1. **User clicks "Sign in with GitHub"**
2. **Professional token dialog appears** with step-by-step instructions
3. **User creates token** at GitHub Settings → Personal access tokens
4. **User enters token** which is automatically validated
5. **User can now comment** on your site

**🔒 Security**: Tokens are stored locally in the user's browser and never sent to your servers.

## Personal Access Token Requirements

For different repository types, users need different token scopes:

**Public Repositories:**
- Scope: `public_repo`
- Allows: Read/write access to public repositories

**Private/Internal Repositories:**
- Scope: `repo` (full repository access)
- Allows: Read/write access to private repositories the user has access to

**Token Creation Steps:**
1. Go to [GitHub Settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Comments for Internal Docs")
4. Select appropriate scopes
5. Copy the generated token (it won't be shown again)

## Features

- ✅ **Eleventy Integration**: Built specifically for Eleventy static sites
- ✅ **Personal Access Token Authentication**: No external OAuth servers needed
- ✅ **Works with Private/Internal Repositories**: Perfect for internal documentation
- ✅ **User-Friendly Setup**: Professional token dialog with step-by-step instructions
- ✅ **GitHub Issues Backend**: Comments stored as GitHub issue comments
- ✅ **Automatic Issue Creation**: Creates issues automatically when first comment is posted
- ✅ **Markdown Support**: Full markdown formatting in comments
- ✅ **Responsive Design**: Uses Velum CSS design system
- ✅ **Secure Local Storage**: Tokens never leave the user's browser
- ✅ **No External Dependencies**: Works completely offline after initial setup
- ✅ **Compatible with Utterances Data**: Can migrate from existing utterances setups

## Customization

### Styling

The comments widget uses your existing Velum CSS variables and can be customized by modifying `/src/plugins/comments/comments.css`.

### JavaScript

The core functionality is in `/src/plugins/comments/comments.js`. You can extend it to add features like:
- Reactions/emoji support
- Comment editing
- Real-time updates
- Advanced markdown parsing

## Troubleshooting

### Comments not loading
- Check that your repository name in `data-repo` is correct
- Ensure the repository exists and user has access to it
- Check browser console for API errors
- Verify Eleventy is serving static assets correctly (`/src/plugins/comments/comments.js` should be accessible)

### Authentication issues
- Verify users have the correct token scopes (`repo` for private, `public_repo` for public)
- Check that tokens haven't expired
- Ensure users have access to the target repository

### Styling issues
- Make sure the comments CSS is being copied by Eleventy (check `.eleventy.js` passthrough copy)
- Verify CSS variables are defined in your foundation styles
- Check that the comments container `<div id="comments">` exists in your layout

### Eleventy-specific issues
- Ensure `.eleventy.js` configuration includes passthrough copy for `src` (includes plugins and css)
- Check that the git commit date plugin is installed: `npm install eleventy-plugin-git-commit-date`
- Verify the layout is being applied correctly to your pages

## Security Considerations

1. **Repository Access**: Comments are stored in GitHub issues, so anyone with repository access can moderate them
2. **Personal Access Tokens**: 
   - Tokens are stored locally in the user's browser (localStorage)
   - Tokens never leave the user's device or get sent to your servers
   - Users control their own token security and can revoke them anytime
3. **Access Control**: Users must have GitHub access to your repository to comment
4. **Content Moderation**: GitHub issues support standard moderation tools
5. **Rate Limiting**: GitHub API has rate limits - consider caching for high-traffic sites

### Token Security Best Practices

**For Users:**
- Only create tokens with minimal required scopes
- Use descriptive names to track token usage
- Regularly review and revoke unused tokens
- Don't share tokens with others

**For Site Administrators:**
- Educate users about token security
- Consider repository-level permissions
- Monitor GitHub issue activity for spam/abuse
- Use GitHub's built-in moderation tools

## Migration from Utterances

If you're migrating from utterances:

1. **Existing Comments**: Your existing comments will continue to work (they're stored in GitHub issues)
2. **Update Embed Code**: Replace utterances script with Velum Comments script
3. **Issue Mapping**: The issue mapping should remain the same if you use the same `issue-term`
4. **Add Eleventy Configuration**: Set up `.eleventy.js` for static asset handling

### Migration Steps

**From Utterances:**
```html
<!-- OLD: Utterances -->
<script src="https://utteranc.es/client.js"
        repo="owner/repo"
        issue-term="pathname"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>

<!-- NEW: Velum Comments -->
<script src="{{ '/' | url }}src/plugins/comments/comments.js"></script>
<script 
  data-repo="owner/repo"
  data-issue-term="pathname"
  data-label="comments"
  data-theme="github-light"
  crossorigin="anonymous">
</script>
```

### Key Differences from Utterances

- ✅ **Works with private repositories** (via personal access tokens)
- ✅ **No external dependencies** (no utterances bot required)
- ✅ **Eleventy integration** (proper static asset handling)
- ✅ **User-controlled authentication** (each user manages their own tokens)
- ⚠️ **Requires user setup** (users need to create GitHub tokens)

## Support

For issues or questions about the Velum Comments system, please check:
- GitHub API documentation: https://docs.github.com/en/rest
- This repository's issues section
- The original utterances project for reference

