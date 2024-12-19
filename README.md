<h1 align="center">
  <a href="https://www.ghostkit.io/">
	<img src="https://www.ghostkit.io/wp-content/uploads/2023/11/ghostkit-favicon.svg" height="40" alt="Ghost Kit - Page Builder Blocks">
  </a>
</h1>

<p align="center">
  <a href="https://wordpress.org/plugins/ghostkit/"><img alt="WordPress Plugin Version" src="https://img.shields.io/wordpress/plugin/v/ghostkit"></a>
  <a href="https://wordpress.org/plugins/ghostkit/"><img alt="WordPress Plugin Rating" src="https://img.shields.io/wordpress/plugin/rating/ghostkit"></a>
  <a href="https://wordpress.org/plugins/ghostkit/"><img alt="WordPress Plugin Downloads" src="https://img.shields.io/wordpress/plugin/dt/ghostkit"></a>
  <a href="https://github.com/nk-crew/ghostkit/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/nk-crew/ghostkit"></a>
</p>

<p align="center">Create sophisticated WordPress websites with advanced blocks, motion effects, and powerful extensions.</p>

<p align="center">
  <a href="https://www.ghostkit.io/">Website</a> &nbsp; <a href="https://www.ghostkit.io/docs/">Documentation</a> &nbsp; <a href="https://wordpress.org/plugins/ghostkit/">WordPress Plugin</a> &nbsp; <a href="https://www.ghostkit.io/pricing/">Pro Version</a>
</p>

## Overview

Ghost Kit enhances the WordPress editing experience with a comprehensive collection of blocks and extensions. Key features:

- 🧱 25+ Advanced Blocks
- ⚡ Motion Effects & Animations
- 🎨 Typography & Color Customization
- 📱 Responsive Design Tools
- 🛠️ Extended Core Blocks
- 📝 Rich Content Formatting

## Development

### Prerequisites

- PHP >= 7.2
- Node.js >= 18.0
- Composer >= 2.0

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Commands

```bash
# Start development with file watcher
npm run dev

# Build for development
npm run build

# Build for production (with zip file)
npm run build:prod
```

### Code Quality

```bash
# Linting
npm run lint:php    # Check PHP code
npm run lint:js     # Check JavaScript code
npm run lint:css    # Check CSS code

# Auto-fixing
npm run format:php  # Fix PHP code
npm run format:js   # Fix JavaScript code
npm run format:css  # Fix CSS code
```

### Testing

1. [Install Docker](https://www.docker.com/) on your machine
2. Start the server:
   ```bash
   npm run env:start
   ```
3. Run tests:
   ```bash
   npm run test:e2e    # End-to-end tests
   npm run test:unit   # Unit tests
   ```

## License

This project is licensed under the GPL-2.0-or-later License - see the [LICENSE](LICENSE.txt) file for details.
