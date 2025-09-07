# Ghost Kit - WordPress Gutenberg Blocks Plugin

🚨 **CRITICAL INSTRUCTIONS FOR AI LANGUAGE MODELS** 🚨

You are an expert developer in PHP, WordPress plugin development, JavaScript ES6+, React, SCSS, and WordPress Gutenberg blocks.

## ✅ SCRIPT EXECUTION RULES

**NEVER** run `npm run build:prod` - only when explicitly requested.  
**ALWAYS** run `npm run lint:php` and `composer run-script lint` after PHP changes.  
**ALWAYS** run `npm run lint:js` and `npm run lint:css` after frontend changes.

## Essential Tech Stack

- **Backend**: PHP 7.2+, WordPress 6.2+, WordPress Coding Standards (WPCS)
- **Frontend**: JavaScript ES6+, React (Gutenberg), SCSS, @wordpress/scripts
- **Architecture**: Single-plugin system with 35+ Gutenberg blocks
- **Build**: @wordpress/scripts, Webpack, npm for package management

## Critical Development Rules

### WordPress Security
```php
// ALWAYS sanitize input and escape output
$value = sanitize_text_field( $_POST['field'] );
echo esc_html( $user_data );

// ALWAYS verify nonces and capabilities
check_ajax_referer( 'ghostkit-ajax-nonce', 'nonce' );
if ( ! current_user_can( 'edit_posts' ) ) wp_die( 'Unauthorized' );
```

### Plugin Architecture
- **Main Class**: `GhostKit` singleton pattern in `class-ghost-kit.php`
- **Module Loading**: Individual classes in `/classes/` loaded via `require_once`
- **Block Registration**: Gutenberg blocks in `/gutenberg/blocks/`
- **Namespace**: All classes prefixed with `GhostKit_`
- **Hooks**: Use WordPress action/filter system exclusively

### Key File Paths
- `class-ghost-kit.php` - Main plugin bootstrap (singleton pattern)
- `gutenberg/` - All Gutenberg block components and logic
- `gutenberg/blocks/` - 35+ individual block directories
- `classes/` - Core PHP classes (Assets, REST, Typography, etc.)
- `settings/` - Admin settings interface
- `assets/` - Source SCSS/JS files  
- `build/` - Compiled assets (webpack output)

## Development Commands

```bash
# Build
npm run dev          # Development with watcher and hot reload
npm run build        # Development build

# Quality Checks  
npm run lint:php     # PHP CodeSniffer (WPCS)
npm run lint:js      # ESLint JavaScript
npm run lint:css     # Stylelint SCSS
npm run lint         # Run all linters concurrently

# Testing
npm run test:e2e     # Playwright end-to-end tests
npm run test:unit:php # PHPUnit tests in wp-env

# WordPress Environment
npm run env:start    # Start WordPress dev environment
npm run env:stop     # Stop WordPress dev environment
```

## WordPress Patterns

### Block Registration
```php
// Gutenberg block registration
register_block_type( 'ghostkit/block-name', array(
    'render_callback' => 'render_callback_function',
    'attributes' => array(
        'content' => array(
            'type' => 'string',
            'default' => '',
        ),
    ),
) );
```

### AJAX Handlers
```php
add_action( 'wp_ajax_ghostkit_action', 'callback_function' );
function callback_function() {
    check_ajax_referer( 'ghostkit-ajax-nonce', 'nonce' );
    wp_send_json_success( $data );
}
```

### Asset Enqueuing
```php
// Use GhostKit_Assets class for consistent asset loading
GhostKit_Assets::enqueue_script(
    'ghostkit-block-script',
    'build/blocks/block-name/index',
    array( 'wp-blocks', 'wp-element' )
);
```

## Key Block Categories
- **Layout Blocks**: `accordion/`, `grid/`, `carousel/`, `tabs-v2/`
- **Content Blocks**: `alert/`, `button/`, `counter-box/`, `testimonial/`
- **Media Blocks**: `gif/`, `google-maps/`, `video/`, `instagram/`
- **Advanced Blocks**: `form/`, `table-of-contents/`, `pricing-table/`

## Core Classes Overview
- `GhostKit_Assets` - Asset management and enqueuing
- `GhostKit_REST` - REST API endpoints
- `GhostKit_Typography` - Typography and Google Fonts
- `GhostKit_Icons` - Icon library management  
- `GhostKit_Breakpoints` - Responsive breakpoint system
- `GhostKit_Templates` - Template and theme integration

## WordPress Integration
```php
// Main plugin instance
function ghostkit() {
    return GhostKit::instance();
}
add_action( 'plugins_loaded', 'ghostkit' );

// Block category registration
add_filter( 'block_categories_all', array( $this, 'block_categories_all' ), 9999 );

// Asset enqueuing for blocks
add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ), 9 );
```

## Build System
- Uses `@wordpress/scripts` for consistent WordPress development
- Webpack configuration in `webpack.config.js`
- SCSS compilation with PostCSS and RTL support
- Vendor libraries copied to `/assets/vendor/`

---

**Note**: This is a comprehensive Gutenberg blocks plugin focused on enhancing the WordPress editor experience with advanced blocks, motion effects, and responsive design tools.