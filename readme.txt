# Block Animations, Motion & Scroll Effects – Ghost Kit #

* Contributors: nko
* Tags: animation, effects, scroll effects, blocks, gutenberg blocks
* Donate link: https://www.ghostkit.io/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=donate
* Requires at least: 6.6
* Tested up to: 7.1
* Requires PHP: 7.4
* Stable tag: 3.7.2
* License: GPLv2 or later
* License URI: <http://www.gnu.org/licenses/gpl-2.0.html>

Animate WordPress blocks with reveal, scroll, mouse and loop effects, set in the block settings.

## Description ##

**Ghost Kit adds motion to the blocks you already use.** Select a block, open Effects in the block settings, and choose what happens when it comes into view, when the page scrolls past it, and when the pointer moves across it.

[See Live Demo](https://www.ghostkit.io/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=head) | [Documentation](https://www.ghostkit.io/docs/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=head) | [GitHub](https://github.com/nk-crew/ghostkit/)

WordPress ships a good set of blocks now. What it still does not ship is motion, and the usual way to get motion is to rebuild the page in a page builder. Ghost Kit is the smaller move. Keep the blocks you have and add the animation on top.

### 🎬 Reveal animations ###

Start from a preset, Fade In, Zoom In or one of the three directional zooms, then adjust the offset, opacity, scale and rotation the block animates from. The transition is a spring rather than a fixed easing curve, so the movement settles instead of stopping dead. Reveal is in the free plugin.

### 📜 Scroll effects ###

Tie a block's position, scale, rotation and opacity to how far the page has scrolled, rather than to a single trigger. This is how parallax sections and scroll-driven reveals are built.

### 🖱️ Mouse effects ###

Move, tilt, scale or rotate a block as the pointer travels over it. Hover and press are separate states, so a card can lift under the cursor and sink when it is clicked.

### 🔁 Loop animations ###

Run an animation continuously. Rotating badges, floating shapes and drifting backgrounds are all loops with different transforms.

### ♿ Reduced motion is respected ###

Every effect checks `prefers-reduced-motion: reduce` before it runs, so a visitor who turned animations off in their operating system gets a still page. There is nothing to configure.

### 🧩 It works on the blocks you already have ###

Effects appear on every core WordPress block, from Paragraph, Heading and Image to Cover, Group, Columns, Buttons and Query Loop. They appear on every Ghost Kit block as well. A block from another plugin can opt in by declaring `supports.ghostkit` in its own `block.json`.

You do not have to rebuild anything. Install the plugin, select a block that is already on the page, and the controls are there.

### ⚙️ Extensions ###

The same place carries the controls a block usually needs and WordPress leaves out.

* [**Position**](https://www.ghostkit.io/docs/extensions/position/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=extensions)
Switch a block to absolute or fixed and offset it, per screen size.

* [**Spacings**](https://www.ghostkit.io/docs/extensions/spacings/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=extensions)
Padding and margin per screen size, on any block.

* [**Frame**](https://www.ghostkit.io/docs/extensions/frame/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=extensions)
Borders, corner radius and shadows, with a separate hover state.

* [**Display**](https://www.ghostkit.io/docs/extensions/display-conditions/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=extensions)
Hide a block on the screen sizes where it does not belong.

* [**Transform**](https://www.ghostkit.io/docs/extensions/transform/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=extensions)
Translate, scale, rotate and skew, including a hover state.

* [**Custom CSS & JavaScript**](https://www.ghostkit.io/docs/extensions/custom-css-js/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=extensions)
Per page or site wide, edited in the admin with syntax highlighting.

### 🧱 Blocks ###

Ghost Kit also ships blocks for the things core still leaves out. Every one of them carries the Effects panel.

* [Advanced Columns](https://www.ghostkit.io/docs/blocks/advanced-columns/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), a twelve column responsive grid with visual size and order controls
* [Accordion](https://www.ghostkit.io/docs/blocks/accordion/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Tabs](https://www.ghostkit.io/docs/blocks/tabs/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Toggle Content](https://www.ghostkit.io/docs/blocks/toggle-content/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks)
* [Alert](https://www.ghostkit.io/docs/blocks/alert/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Icon](https://www.ghostkit.io/docs/blocks/icon/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Number Box](https://www.ghostkit.io/docs/blocks/number-box/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Progress](https://www.ghostkit.io/docs/blocks/progress/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Countdown](https://www.ghostkit.io/docs/blocks/countdown/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks)
* [Button](https://www.ghostkit.io/docs/blocks/button/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Circle Button](https://www.ghostkit.io/docs/blocks/circle-button/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Divider](https://www.ghostkit.io/docs/blocks/divider/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Shape Divider](https://www.ghostkit.io/docs/blocks/shape-divider/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks)
* [Video](https://www.ghostkit.io/docs/blocks/video/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [GIF](https://www.ghostkit.io/docs/blocks/gif/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Image Compare](https://www.ghostkit.io/docs/blocks/image-compare/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Image Scroller](https://www.ghostkit.io/docs/blocks/image-scroller/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Magnifying Image](https://www.ghostkit.io/docs/blocks/magnifying-image/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Carousel](https://www.ghostkit.io/docs/blocks/carousel/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Marquee](https://www.ghostkit.io/docs/blocks/marquee/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks)
* [Contact Form](https://www.ghostkit.io/docs/blocks/form/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Google Maps](https://www.ghostkit.io/docs/blocks/google-maps/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Pricing Table](https://www.ghostkit.io/docs/blocks/pricing-table/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Testimonial](https://www.ghostkit.io/docs/blocks/testimonial/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Table of Contents](https://www.ghostkit.io/docs/blocks/table-of-contents/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks)
* [Code Highlight](https://www.ghostkit.io/docs/blocks/code/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [GitHub Gist](https://www.ghostkit.io/docs/blocks/github-gist/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Changelog](https://www.ghostkit.io/docs/blocks/changelog/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks), [Interactive Links](https://www.ghostkit.io/docs/blocks/interactive-links/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=blocks)

### ✍️ Content formatting ###

Formats that apply to a text selection rather than to a whole block. See them on the [formats demo page](https://www.ghostkit.io/docs/formats/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting).

[Animated Text](https://www.ghostkit.io/docs/formats/animated-text/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting), [Badges](https://www.ghostkit.io/docs/formats/badge/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting), [Lorem Ipsum Generator](https://www.ghostkit.io/docs/formats/lorem-ipsum-generator/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting), [Spoiler](https://www.ghostkit.io/docs/formats/spoiler/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting), [Stroke](https://www.ghostkit.io/docs/formats/stroke/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting), [Tooltip](https://www.ghostkit.io/docs/formats/tooltip/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting), [Uppercase](https://www.ghostkit.io/docs/formats/uppercase/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=formatting)

### 🔥 Ghost Kit Pro ###

> The free plugin covers reveal animations, the layout extensions and the block set. [**Ghost Kit Pro**](https://www.ghostkit.io/pricing/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=pro) adds the rest of the motion system and pays for the free version to keep being maintained and supported.

* Scroll effects, mouse effects and loop animations
* 3D rotation, custom viewport and replay for reveal animations
* CSS transform and transition per block, with a hover state
* Custom block attributes and custom responsive breakpoints
* Marquee, Code Highlight, Interactive Links, Magnifying Image, Image Scroller, Circle Button and Toggle Content blocks
* Animated Text, Stroke, Spoiler and Tooltip formats
* More icon packs, Adobe Fonts and custom font files
* Gradients for buttons, backgrounds, icons and badges
* Extra shapes for the Shape Divider block

### 🏳️ Multilingual ###

Ghost Kit adds a layer of [WPML](https://wpml.org/) compatibility. Every block is translation ready. [Read the multilingual guide](https://www.ghostkit.io/docs/languages/multilingual/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=multilingual).

## Installation ##

### Automatic installation ###

In the WordPress dashboard go to Plugins, click Add New, and search for Ghost Kit. Click Install Now and then Activate. Effects appear in the block settings straight away.

### Manual installation ###

Download the plugin, upload the folder to `wp-content/plugins` over FTP, and activate it from the Plugins screen. The WordPress documentation has [the longer version](https://wordpress.org/documentation/article/manage-plugins/#manual-plugin-installation-1).

## Frequently Asked Questions ##

### Which blocks can I animate? ###

Every core WordPress block and every Ghost Kit block. That covers Paragraph, Heading, Image, Cover, Group, Columns, Buttons, Query Loop and the rest of the core set. A block from another plugin joins in once it declares `supports.ghostkit` in its `block.json`.

### Do I need a page builder? ###

No. Ghost Kit works inside the standard block editor and the Site Editor. Pages you have already built stay as they are, and the Effects panel appears on the blocks that are on them.

### Do the animations work on mobile? ###

Yes. Reveal animations run on touch devices as the visitor scrolls. Mouse effects need a pointer, so they stay idle on touch screens rather than misfiring.

### Will animations slow down my site? ###

The effects are CSS transforms and opacity changes, which the browser composites on the GPU. Ghost Kit loads the effects script only on pages that actually use an effect.

### What happens for visitors who turned animations off? ###

Ghost Kit checks `prefers-reduced-motion: reduce` and skips the animation for them, leaving the block in its final state. This is on by default and there is no setting to remember.

### How do I add a parallax effect? ###

Select the block, open Effects, and use Scroll to tie its vertical offset to the scroll position. Scroll effects are part of Ghost Kit Pro.

### Can I reuse an effect on another block? ###

Yes. The block toolbar has a Ghost Kit menu with Copy extensions and Paste extensions, so an effect you tuned on one block can be pasted onto the next one instead of set up again.

### Does Ghost Kit have documentation? ###

Yes, at [ghostkit.io/docs](https://www.ghostkit.io/docs/getting-started/?utm_source=wordpress.org&utm_medium=faq&utm_campaign=docs). It covers every block, every extension, and the filters and events for developers.

### Is Ghost Kit translation ready? ###

Yes, and it carries WPML compatibility for block content.

## Screenshots ##

1. Ghost Kit panels on a core Group block: Effects, Position, Spacings, Frame, Transform, Custom CSS and Display Conditions
2. Reveal settings: a Zoom In preset, the offset the block animates from, and a spring transition
3. Ghost Kit blocks in the inserter
4. Frame: border, corner radius and shadow, each with a hover state and a value per screen size
5. Display Conditions: hide a block at one screen size and leave it at the others
6. Transform: translate, scale and rotate a block, in 2D or 3D

## Changelog ##

= 3.7.2 - Sep 14, 2026 =

* fixed a critical error on sites where another plugin ships a different version of the same CSS parser, which showed up as "Declaration of Sabberworm\CSS\Value\Size::render() must be compatible" once the custom breakpoints styles were rebuilt
* changed custom breakpoints to be applied to the shipped stylesheets directly instead of compiling styles on the site, so the change takes effect on the next page load
* fixed RTL sites loading the left-to-right stylesheets for blocks, the editor and the settings pages
* **Pro:**
* fixed one failed plugin update on the Plugins screen leaving the remaining queued updates waiting for a page reload
* fixed RTL sites loading the left-to-right stylesheets of the Pro blocks on the frontend and in the editor

= 3.7.1 - Aug 31, 2026 =

* changed Ghost Kit to stay active next to Ghost Kit Pro instead of being deactivated
* **Pro:**
* fixed effects sometimes not running, leaving blocks with a reveal effect hidden on the page

= 3.7.0 - Aug 26, 2026 =

* added WordPress 7.1 compatibility
* added a Privacy-Enhanced Mode toggle to the Video block, shown once the entered URL is a YouTube one
* changed YouTube embeds to use the regular YouTube host by default, because the privacy-enhanced host asks a share of visitors to sign in before it plays anything
* fixed block icons and the custom color palette not reaching the blocks they style in the editor
* fixed the typography preview not applying in the editor
* fixed PHP warnings logged by the Table of Contents and Widgetized Area blocks
* raised the minimum PHP requirement to 7.4
* **Pro:**
* fixed tooltips never appearing in the editor
* fixed the update notice still offering a version already installed
* added a capability check to the license activation request

= 3.6.1 - Jun 21, 2026 =

* fixed stored XSS from contributors via Customizer post meta (`ghostkit_customizer_options`)
* hardened Customizer post meta with permission checks, sanitization, and frontend filtering
* fixed Gutenberg post saves failing when unchanged protected post meta was included in the REST request
* allow local typography editing for users with `edit_post` on the post; global typography editing requires `edit_theme_options`

= 3.6.0 - Jun 5, 2026 =

* added WordPress 7.0 compatibility
* improved frontend assets detection — centralize block.json handles, extensions, style variants, and effects markers in `GhostKit_Assets_Detector`
* added `gkt_icons_detected_packs` filter to enqueue only icon packs used on the page
* added editor filters for responsive preview sizes (`mediaSizes`, `previewWidth`)
* fixed GitHub Gist block stylesheet lookup and gist-simple script registration in the editor
* fixed Gist and Lottie block assets loading in the block editor
* fixed Table of Contents REST request params sanitization
* fixed URL Picker inspector layout overrides scope in the editor
* fixed Pricing Table Item features list editing (replaced deprecated RichText multiline)
* fixed quote to testimonial transform preserving content
* fixed editor compatibility with stable Gutenberg controls and removed deprecations
* use WordPress admin theme CSS variables for accent UI colors
* minor changes and fixes
* **Pro:**
* fixed custom Breakpoints styles not loading from uploads on the frontend
* fixed Breakpoints settings validation when editing values in settings
* synced editor responsive preview with saved Pro breakpoint widths

= 3.5.1 - Mar 4, 2026 =

* fixed frontend general styles being enqueued in the editor, which caused style conflicts (e.g., issues with the `Display` extension in the editor)

= 3.5.0 - Feb 24, 2026 =

* improve assets loading to native way
* update wp-background-processing library to fix warnings with Visual Portfolio plugin
* fixed progress bar viewport animation on mobile
* fixed nested accordion styles
* **Pro:**
* improve assets loading - load only used on the page assets and not all
* minor changes and fixes

= 3.4.6 - Dec 7, 2025 =

* fixed incorrect double escaping of Effects extension attribute because of WP 6.9 changes
* **Pro:**
* fixed incorrect double escaping of Attributes extension attribute because of WP 6.9 changes

= 3.4.5 - Dec 3, 2025 =

* **Pro:**
* fixed error appear in WordPress 6.9 because of changed behavior of `wp_enqueue_script_module` function

= 3.4.4 - Sep 11, 2025 =

* added permission checks to custom JS and CSS in posts meta editor (fixes possible XSS from contributors)

= 3.4.3 - Jun 21, 2025 =

* fixed always generating heading block anchors even if it not required

= 3.4.2 - Jun 21, 2025 =

* fixed XSS with theme template files
* fixed block unique ID when duplicating multiple blocks
* fixed displaying TOC heading content in editor
* fixed Icon block rendering `aria-label` attribute on link
* **Pro:**
* fixed updater caching issue that sometimes caused Forbidden errors

= 3.4.1 - Jan 13, 2025 =

* fixed blocks error in Widgets screen because 'core/editor' store is not available
* updated Google Fonts list
* **Pro:**
* changed loading of module script in Code block to `wp_enqueue_script_module`

= 3.4.0 - Dec 18, 2024 =

* added WordPress 6.7 compatibility fixes
* significantly improved motion effects performance to prevent memory overload
* fixed editor slow rendering when first page load and when duplicate blocks without any extensions on blocks
* fixed displaying responsive toggle in editor header
* fixed resizing editor preview when switch responsive toggles
* fixed usage of `wp-content` hardcoded string, use constants if available
* hidden Twitter and Instagram blocks from inserter as it is deprecated long time ago
* removed fallback class for Breakpoints, as it is no longer required
* minor changes
* **Pro:**
* changed text domain from `ghostkit-pro` to `ghostkit`
* fixed displaying message about license activation in the plugins list when the license already active
* removed Circle Button frontend script, because it is no longer used, as we have Effects extension

= 3.3.3 - Sep 7, 2024 =

* added escaping to imageTag attribute in the Grid block to prevent xss vulnerability

= 3.3.2 - Jul 31, 2024 =

* migrate Pro plugin from Paddle to LemonSqueezy
* fixed customizer plugin selector settings rendering
* fixed Color Palette plugin saving custom colors, displaying default color picker dropdown
* fixed deprecated Templates modal loading

= 3.3.0 - May 26, 2024 =

* **Important**: the Pro plugin is now standalone and no longer requires the free plugin. If you are using Pro plugin v2, do not update the Free plugin to v3.3. Instead, update the Pro plugin and deactivate the Free one.
* fixed Counter Box saving incorrect class names
* fixed loading blocks in the legacy Widgets editor

= 3.2.4 - Mar 15, 2024 =

* fixed extensions enable in 3rd-party blocks with config like this:
```
ghostkit: {
  customCSS: true,
}
```

= 3.2.3 - Feb 26, 2024 =

* fixed loading some Google Fonts with specific names. For example, font "Source Serif 4" was not loaded properly
* fixed Accordion and Tabs buttons default text align
* fixed Video block with "icon only" style displaying poster image in editor

= 3.2.2 - Feb 21, 2024 =

#### Pro:

* Pro plugin v2.2.2
* added transformation from Code and Preformatted blocks to Code Highlight
* fixed Code block Vesper theme default color
* fixed Code block None language rendering
* fixed fonts rendering on frontend

#### Free:

* fixed Pro features Note returns an error and leads the block to crash in the editor

= 3.2.1 - Feb 19, 2024 =

* fixed typography and fonts loading on frontend

= 3.2.0 - Feb 18, 2024 =

> There are significant changes to the following blocks: `Google Maps`, `Tabs`, and `Accordion`.
> Old blocks will work correctly, but after this update, it is highly recommended to do the following steps:
>
> 1. Open page in editor where these blocks are used
> 2. Make any change in content (for ex. add and remove paragraph)
> 3. Click on the Update button to re-save the page.

#### Pro:

* Pro plugin v2.2.0
* added Code Highlight block <https://www.ghostkit.io/docs/blocks/code/>
* added support for alpha channel in Stroke format color
* added support for `ivent` library used in the free plugin
* fixed Magnifying Image block side view z-index
* fixed wrong gap calculation in Marquee block
* fixed enqueue assets for iframe - use `enqueue_block_assets`
* removed Google Maps extension → added to the Free plugin
* removed support for deprecated Fonts API

#### Free:

* reworked Google Maps block:
  * added support for custom markers and info window text
  * moved map styles to Styles tab
  * simplified Full Height map styles to use `--wp-admin--admin-bar--height` variable
  * removed dependency on 3rd-party library - use Google Maps API directly
* reworked Tabs block:
  * improved WCAG compatibility
  * added `aria-selected`, `aria-labelledby`, `aria-controls`, and `aria-orientation` attributes
  * changed tab from `&lt;a>` tag to `&lt>button>`
  * changed hidden tab content to `display: none`
  * on screen readers use arrow keys to switch tabs
  * tab content is focusable
* reworked Accordion block:
  * added h1 title tag support
  * improved WCAG compatibility
  * changed heading from `&lt;a>` tag to `&lt>button>`
  * added `aria-selected`, `aria-labelledby`, `aria-controls`, and `aria-orientation` attributes
  * fixed  click on Add Accordion Item button in editor
* added support for text color in Badge format
* added support for Columns blocks inside the Form block
* improved InputDrag and InputGroup components - expand the input when value is large (for example, when you add the CSS variable in Padding or Margin extension)
* improved Form block validation - check validity on blur only for forms that were submitted and are invalid
* fixed rare problem when extensions resets after block transformation from deprecated version
* fixed displaying hidden elements if user has enabled reduced motion
* fixed displaying deprecated Templates feature in the editor Options dropdown
* fixed responsive toggle in editor toolbar in the latest Gutenberg
* fixed form reCaptcha keys saving method (sometimes the secret key was not saved properly)
* fixed Changelog block uses deprecated default template
* fixed Number Box block decimal numbers animation
* fixed Table of Contents block selection when no headings available on the page
* fixed Table of Contents block rendering heading content in the latest Gutenberg
* fixed enqueue assets for iframe - use `enqueue_block_assets`
* changed internal EventHandler to `ivent` library
* removed support for deprecated Fonts API
* dev version improvements:
  * added unit and e2e tests
  * changed build structure to official `wp-scripts`
  * better assets enqueue version and dependencies
* minor changes

= 3.1.2 - Nov 23, 2023 =

* improved Styles component to use useCallback
* fixed possibility to add custom classes when our `ghostkit-custom-...` class added
* fixed missing `+` symbol in custom CSS
* fixed blocks enqueue method in Ghost Kit settings pages

= 3.1.1 - Nov 16, 2023 =

* fixed migration to new Ghost Kit attributes from deprecated blocks (mostly from Core blocks, which has deprecated attributes)
* changed ProNote component in Reveal effect to collapsed version to not overwhelm effect settings panel
* changed Spring transition defaults

= 3.1.0 - Nov 12, 2023 =

> Deprecated changes:

* completely reworked block extensions. If you used extensions for your custom blocks, using custom JS, you will need to change it, as an API changed.
* deprecated Templates extension and will be hidden if there are no custom templates available. It is recommended to use Patterns feature instead

Changes:

* added Effects extension
  * Reveal effects
  * Loop, Scroll, Mouse Press, Mouse Hover, Mouse Move effects (for Pro users)
* added Custom CSS extension:
  * Opacity
  * Overflow
  * Clip Path
  * Cursor
  * User Select
  * Transition (for Pro users)
  * Custom styles
* added Transform extension (for Pro users)
* added Custom Attributes extension (for Pro users)
  * possibility to add custom HTML attributes, something like `data-speed="5"`
* added more Position extension tools:
  * Width and Height
  * Min/Max Width and Height
* added possibility to copy and paste extensions to blocks
* added Icon block
* added Fade Edges option to Carousel block
* added Radio style to Tabs block
* added Responsive toggle to editor toolbar with all available Ghost Kit Breakpoints
* added Responsive toggle to block controls
* improved Icon Picker UI
* improved Video block settings
* updated FontAwesome icons and Google Fonts
* changed old attributes to new `ghostkit`
  * ghostkitId → ghostkit.id
  * ghostkitStyles → ghostkit.styles
  * ghostkitClassname → removed
* changed Shape Divider block to flex
* fixed Image Compare on touch screens
* fixed Tabs block active tab in editor
* fixed usage of custom db prefix to get saved typography settings

= 3.0.2 - Sep 28, 2023 =

* fixed form with recaptcha JS submit error
* fixed Typography Select control dropdown position when placed inside Modal
* fixed custom styles background processing error

= 3.0.1 - Sep 27, 2023 =

* fixed rare error on some operating systems, which does not contain the GLOB_BRACE constant

= 3.0.0 - Sep 26, 2023 =

> There are a lot of changes in v3, before updating it on production, we recommend test it in staging site first. Look at some of the breaking changes:

* removed jQuery usage completely:
  * added simple fallbacks where possible
  * added instance to the `prepared.googleMaps` event
  * remove events `afterInit`, `beforeInit.blocks`, `afterInit.blocks`
  * new JS events documented here - <https://www.ghostkit.io/docs/developers/js-events/>
* remove main GhostKit class from JS
* removed Variants feature, use native Gutenberg Styles instead. This feature was introduced in first versions of Ghost Kit, but Gutenberg added their Styles feature, which is widely used now and our Variants no longer needed
* removed custom bottom margin from all Ghost Kit blocks in FSE themes only (this change may impact your existing sites)
* removed Parsley library, use native Form validation instead. Less size, better performance
* there are a lot of plans for Ghost Kit v3 future updates (and new site coming soon). It will be huge 😎

Changes:

* register all blocks in PHP using `register_block_type_from_metadata`
* added Position extension - it allows creating fixed or absolute blocks with custom offsets
* added Lottie block
* added Motion One script for animations. Great performance and native WAAPI support. We will use it for all future advanced blocks and extensions
  * changed jQuery animations to Motion One
  * remove ScrollReveal script, use Motion One instead
* added support for Fonts in FSE themes. You can now select the specific font to load it in editor Typography settings and on frontend
* added Lorem Ipsum format-command. Just type in editor `lorem15` and press `space` and it will generate a lorem ipsum text instantly
* added reCaptcha score check for Form block
* added filters for parse blocks and fallback custom styles render
* added Honeypot protection to Form block
* added column settings for paragraph
* added option to change the Title tag in the Accordion block
* added support for `layout-flow` inside InnerBlocks
* added support for adding different blocks inside Changelog block
* added Hover trigger for Tabs block
* added vertical orientation, hover trigger, and labels to Image Compare block
* added Fade Edges option to Carousel block
* improved inserter in blocks with InnerBlocks
* improved Form radio and checkbox editor ui
* improved Form block alert colors
* improved Color Picker component to use native UI
* moved some extensions to Styles tab in inspector control
* moved Templates menu item under Ghost Kit menu
* fixed Typography font weights output
* fixed custom styles render in Astra, Blocksy, and Page Builder Framework themes
* fixed Pricing block not displaying items when block inserted in the editor
* fixed Tabs block click on tab in editor
* fixed conflict with dynamically generated styles with custom breakpoints and cached CSS
* fixed Progress bar width calculation in editor
* fixed styled lists reversed and start attributes rendering in editor
* fixed infinite loop of Widgetized Area block if sidebar nested himself
* changed Form gap to CSS `gap`
* changed Form default input sizes for better support of standard themes
* changed category of all Ghost Kit blocks. Moved Ghost Kit block category to the top of the blocks list
* changed block icons and color
* renamed Grid → Advanced Columns
* removed sessions usage from Form block
* removed grid column helpful buttons to select column or grid block. You can use blocks list view to select complex inner blocks <https://learn.wordpress.org/tutorial/how-to-use-the-list-view/>
* removed fallbacks for old versions:
  * remove old icons fallback script, which converted span icons to svg
  * remove fallback for custom styles render from data attribute
  * remove InnerBlocks fallback for frontend of blocks: Button, Grid, Pricing Table
* removed Reusable Blocks item from Admin Menu since WP v6.3
* deprecated Highlight text format, use core Highlight format instead
* a lot of minor changes

= 2.25.0 - Jan 4, 2023 =

* added JS events `prepareCountersObserver` and `prepareVideoObserver`
* improved Carousel displaying in editor (added slides per view and gap styles)
* improved appender CSS in some blocks which uses InnerBlocks
* fixed "Display" extension styles in editor
* fixed TOC conflict with special characters in headings
* fixed Form block appended overflow upper blocks
* fixed wrong variable type usage warning
* fixed Customizer Plugin displaying in Non Block Based themes
* disabled Color Palette Plugin from the Block Based themes (custom colors can be added in Appearance → Editor → Styles → Colors → Palette)
* minor changes

= 2.24.1 - Sep 29, 2022 =

* fixed custom Gap settings save number value instead of string
* changed Tested up to in readme

= 2.24.0 - Sep 24, 2022 =

* added Vertical Gap support to Grid and Buttons blocks
* added horizontal align option for top icon/number in the Icon and Number boxes
* added usage of IntersectionObserver for Animate on Scroll and similar features
* added aria-label for URL picker
* updated Swiper script to v8.4.0
* changed Grid vertical gap from margins to CSS `row-gap`
* changed Button gap from margins to CSS `gap`
* changed Spacing control start from the Top input
* changed RangeControl in all block settings to allow custom values. For example, allow specifying more than 12 columns in the grid
* fixed Animate on Scroll hide elements even when JS is disabled in browser
* fixed invalid date in editor Countdown block when block inserted
* fixed Carousel block making duplicate slides even when Loop option is disabled
* fixed Carousel block content inside duplicated slides. For example, Tabs block now working correctly inside slides and duplicated slides
* fixed Images Compare block usage inside Carousel block
* fixed Form block nonce field ID conflict with block ID
* fixed Form block send error on some hosts
* fixed easing function in the Progress block animation
* fixed rest call permission check
* minor changes

= 2.23.2 - Jul 28, 2022 =

* fixed Countdown block wrong date with UTC timezone settings
* fixed Countdown block possible DatePicker error, when invalid date specified

= 2.23.0 - Jul 27, 2022 =

* ! Important - breaking change - changed `Auto` Grid Column to flex Auto width (depends on the content width). To restore previous behavior use `Grow` column size
* added Grow size for Grid Columns
* updated Google Fonts list
* fixed custom styles rendering in FSE templates editor
* fixed automatic heading anchor generation, as we needed it for Table of Contents block. Enabled standard `generateAnchors` setting in the editor by default
* fixed Table of Contents preview in editor if some of headings does not contain anchors
* fixed Countdown block dependency of the user's time zone. Now used timezone setting from the WordPress site
* removed `will-change` styles usage

= 2.22.3 - Feb 17, 2022 =

* fixed Video block play action
* removed blocks categories fallback used for WP < 5.5
* minor changes

= 2.22.2 - Feb 14, 2022 =

* improved method to enqueue block assets and custom styles in block themes (we no more need to parse content of the posts, we can make everything inside block render)
* improved styles for nested panels in grid background settings
* disable Plugin Customizer settings in block themes, as Customizer no more used there
* fixed custom styles render in block themes Site Editor
* fixed custom styles re-rendering in editor when interacting with editor elements (better performance)
* fixed updating custom styles attributes on editor load

= 2.22.0 - Feb 7, 2022 =

* !important - dropped IE support
* added support for WordPress 5.9
* added Animate on Scroll presets in Toolbar block settings
* added possibility to remove link in URLPicker component (for example, in Button block)
* added support for scrollBehavior in TOC links (used in modern themes)
* added ToggleGroup control to use it instead of ButtonGroup (better UI)
* disabled automatic heading anchor generation code in WordPress 5.9 and higher (as it is already generates by the Gutenberg)
* rolled back ScrollReveal to older version, since latest one is not working properly when cleaning styles
* fixed mail send headers
* fixed Video block autoplay after loading when fullscreen already closed
* a lot of minor changes

= 2.21.0 - Dec 1, 2021 =

* !important - removed support for deprecated blocks older than Ghost Kit v2.12. Make sure you re-saved all pages with old blocks versions.
* added possibility to remove image in Image Compare block
* added possibility to change Alt text in the Testimonial photo and Video poster
* added encodes for Google Maps styles and AWB background images attributes
* fixed usage of image tag in Video and Testimonial block (no more tag string in the attribute)
* fixed encode/decode functions fails when no string given
* fixed XML export problem when block styles use `--` characters
* removed poster images from the Video block with "Icon Only" style selected

= 2.20.3 - Nov 9, 2021 =

* fixed crashing block with Custom CSS

= 2.20.2 - Oct 25, 2021 =

* added option "Pause autoplay on mouse over" to carousel block
* fixed custom CSS compiler error
* fixed Table of Contents block scroll to anchor JS error when using Chinese headings

= 2.20.1 - Oct 17, 2021 =

* fixed icon wrong escaping in the Icon List style

= 2.20.0 - Oct 14, 2021 =

* added escaping for SVG icons (fixes conflict with XML content import)
* added support for WordPress's excerpt in some blocks
* improved form reCaptcha code to work only when submit button clicked
* changed minimum PHP to 7.2
* fixed block assets loading when block used in new block widgets screen
* fixed conflict with PublishPress Blocks plugin

= 2.19.4 - Sep 2, 2021 =

* fixed errors in new Widgets editor

= 2.19.3 - Aug 31, 2021 =

* added line breaks for form email texts
* added support for WP 5.8
* fixed rare conflict with reusable blocks while parsing
* hidden Slides per view and Gap carousel options when selected Fade effect
* hidden Carousel slides before JS init to prevent content jumping

= 2.19.2 - May 6, 2021 =

* fixed carousel block initial slides count in editor
* fixed possible error with nested reusable blocks while parse page blocks

= 2.19.1 - Apr 3, 2021 =

* fixed warning a non-numeric value encountered conflict with Give plugin

= 2.19.0 - Apr 1, 2021 =

* added vendor prefixes to scss files (fixes unprefixed styles generated for custom breakpoints)
* added dynamic styles for breakpoints generation in background (using CRON)
* improved custom styles output in `<body>` - use JS to prevent w3c error
* changed Twitter and Google Maps blocks usage of svg images as backgrounds (we need this to prevent possible errors in generated dynamic styles)
* fixed some editor settings dropdown wrong widths
* fixed block error when selecting Form Submit block
* fixed dynamic styles for breakpoints generation if change plugin version

Further changelog entries can be found in the [CHANGELOG.md](https://github.com/nk-crew/ghostkit/blob/master/CHANGELOG.md) file.
