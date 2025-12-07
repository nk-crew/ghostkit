# Changelog

All notable changes to this project will be documented in this file.

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

= 2.18.1 =

* tested with WordPress 5.7
* plugin moved to new Github repo

= 2.18.0 =

* added z-index to Shape Divider to keep divider always on top of other elements
* added support for TOC to Rank Math SEO plugin
* fixed Grid and Buttons gap in editor
* fixed Icon Picker width in WordPress 5.7
* fixed toolbar templates button in WordPress 5.7
* fixed conflict with generated CSS and Custom CSS + Autoptimize plugin
* fixed possibility to disable Ghost Kit blocks in settings
* minor changes

= 2.17.0 =

* added support for Custom fonts (Pro only)
* updated FontAwesome icons list
* fixed active tab content displaying in Tabs block in editor when used Wide or Full alignment
* fixed Adobe Fonts label in Select component
* fixed limited width of InnerBlocks inside some of blocks
* fixed possible PHP errors when non-valid font weight added
* removed webfontloader script, add fonts manually using wp_enqueue_style (allows users to download fonts to their servers)
* minor changes

= 2.16.0 =

* added settings to change responsive breakpoints (Pro only)
* added `prepareCounters` jQuery event to add possibility to change counters speed
* improved admin UI styles
* fixed some SVG icons w3c warnings
* fixed `Add Template` button rendering in Gutenberg toolbar
* fixed first and last child blocks margins in editor inside Alert, Icon Box and Number Box blocks
* fixed Pricing Table block preview in blocks inserter

= 2.15.0 =

* added Image Compare block [https://www.ghostkit.io/docs/blocks/image-compare/](https://www.ghostkit.io/docs/blocks/image-compare/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog)
* added style "Icon Only" to Video block
* added Reusable Blocks admin menu item
* improved Button block states in editor. Display Hover or Focus styles, when you switch color tabs in Inspector
* updated all vendor scripts
* fixed `webfontloader` registration for Ghost Kit Pro
* fixed usage of deprecated 'ready' event
* removed outdated blocks deprecations

= 2.14.2 =

* added WPML support for all blocks
* fixed Carousel block slides count change

= 2.14.1 =

* added Loop option for Video block
* added horizontal mover for Grid Columns and Carousel blocks
* fixed horizontal mover for Buttons and Pricing Table blocks
* fixed Tabs block add/remove tabs
* fixed Grid block change columns count
* fixed Grid background image position preview
* fixed custom CSS output in reusable widgets, when custom CSS already added on some of the content blocks
* fixed icons picker dropdown scroll bug
* fixed forms options editor component loosing focus while typing
* minor changes

= 2.14.0 =

* added support for WordPress 5.5
* added RTL support
* added support for `Start value` and `Reverse` settings in Styled numbered lists
* added support for Gradients for Badges in Ghost Kit Pro
* improved some editor UI elements
* changed components `return '';` to `return null;` (fixed possible conflicts with 3rd-party plugins)
* fixed Grid CSS variables error in IE11
* fixed Grid block background top position bug when use Frame extension

= 2.13.2 =

* fixed blocks assets rendering inside custom content locations
* fixed reusable widget usage (use 'the_content' filter)
* changed reusable widget render in bbPress pages

= 2.13.1 =

* added modal to blocks custom CSS extension
* added button on edit page in reusable block widget ui
* added script to close fullscreen video by clicking on wrapper (not only on X button)
* fixed fullscreen video offset depending on admin bar
* fixed fullscreen video conflict with Safari
* fixed pricing table align styles

= 2.13.0 =

* added GIF block
* added Markdown block
* added list columns settings to default `core/list` block
* updated Google Fonts list
* changed TOC block smooth scroll script native browser `window.scrollTo`
* fixed color picker component correct re-rendering picker and palette

= 2.12.5 =

* fixed conflict with `additional_font_weights` attribute, used in custom themes

= 2.12.4 =

* fixed fonts loading undefined weights

= 2.12.3 =

* fixed translation files

= 2.12.2 =

* added Ghost Kit blocks collection (all blocks moved to separate default categories)
* changed spinner icon to CSS variables and relative color usage
* changed accordion collapse button color to inherit
* fixed js error when open typography options and when font doesn't exist

= 2.12.1 =

* added Align option to Form Submit Button
* updated google fonts list
* fixed Button border CSS conflict with Ghost Kit Pro Gradients
* fixed displaying some Typography options (rare bug)
* fixed fonts loading based on available registered fonts, but not on the saved in DB (rare bug)

= 2.12.0 =

* added Icons style for `core/lists` block
* improved offsets for styled lists
* fixed missing formatting buttons inside some blocks (accordion heading, button, tabs, etc...)
* fixed Templates modal images lazy loading when switch categories
* fixed CSS calc() conflict with 0 values
* fixed PHP Notice: Undefined index: SERVER_NAME using WP-CLI

= 2.11.0 =

* ! to changes takes effect, re-save your pages
* added button outline CSS variable
* improved DatePicker component in Countdown block
* simplified CSS selectors in blocks (easier to extend styles)
* changed styles loading priority (new 4th point added):
  1. Enqueue plugins assets
  2. Enqueue Ghost Kit assets
  3. Enqueue theme assets
  4. Enqueue Ghost Kit custom CSS
* changed Grid Column Sticky option to use the class with CSS variable
* fixed empty custom styles
* fixed blocks custom styles for number attributes (wrong styles when a variable is undefined or == 0)
* fixed PHP notice - Trying to access array offset on value of type bool
* fixed Tabs and Accordion items hash parse with Japanese/Chinese/... characters
* removed all defaults from blocks - easily change defaults using CSS variables now - [https://www.ghostkit.io/docs/developers/css-variables/](https://www.ghostkit.io/docs/developers/css-variables/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog)
* removed hard-coded box-shadow from buttons, use CSS variable instead

= 2.10.2 =

* changed name of CSS variables with -x and -y in name:
  * `...margin-x` to `...margin-v`
  * `...margin-y` to `...margin-h`
  * `...padding-x` to `...padding-v`
  * `...padding-y` to `...padding-h`

= 2.10.1 =

* ! breaking change ! - all styles now uses CSS Variables. No more IE browser supported
* added WordPress 5.4 compatibility
* added better possibilities for extending/changing blocks styles (thanks to CSS Variables) [https://www.ghostkit.io/docs/developers/css-variables/](https://www.ghostkit.io/docs/developers/css-variables/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog)
* added custom gap option for Grid, Buttons, Instagram and Pricing Table blocks
* added Grid vertical Gap by default
* improved styles for nested styled lists
* changed a lot of styles of blocks
* removed wp-i18 dependency from the main script, used for Countdown script only
* fixed Styled Lists text wrap
* fixed TOC block inside columns
* fixed Progress bar count tooltip size when progress bar has a small width
* fixed Twitter block profile description pre-wrap
* fixed Contact Form mail template long words break
* fixed loading fonts dependencies when fonts are not selected
* fixed color palette PHP error, when palette is empty by default

= 2.9.3 =

* fixed assets enqueue sequence (plugins -> Ghost Kit -> theme)

= 2.9.2 =

* added higher assets enqueue priority (fixes styles bug with AWB plugin)

= 2.9.1 =

* added Twitter block Text Mode option (to display full tweet text)
* added icon picker Search input autofocus
* added Reset button in Icon Picker component
* added null option to Select Field when default value is not selected
* added option to remove photo from Testimonial block
* improved Twitter block text formatting (line breaks)
* improved conditional options display in the editor for Alert and Icon Box blocks
* change unique Form Fields slug slash to underscore
* prevent Form Fields input focus in editor
* fixed vertical Tabs Pills active tab styles
* fixed Buttons block align option in editor
* fixed php error when use rest to get image by id, that is not exists

= 2.9.0 =

Note: there may be breaking changes. Try to re-save pages if you see issues on the frontend.

* loading blocks assets conditionally only when block added on the page (better pages performance)
* added Form block [https://www.ghostkit.io/docs/blocks/form/](https://www.ghostkit.io/docs/blocks/form/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog)
* added URL options to testimonial block
* added styled inner lists in table of contents block
* added "Add Template" button in editor Toolbar
* changed icons in blocks to pure SVG and removed FontAwesome scripts (better pages performance)
* changed wp-editor dependency to wp-block-editor (possible fix conflict with 3rd-party plugins like Yoast SEO)
* fixed left and right margin in grid, button, pricing table blocks in Twenty* themes
* fixed accordion and tabs item hash missing dash
* fixed js error if used missing font (for ex. when disabling Pro plugin)
* fixed Table of Contents editor preview

= 2.8.2 =

* fixed Adobe Fonts CSS output in Pro plugin

= 2.8.1 =

* fixed JS files translation possibility (read /languages/readme.md for more info)

= 2.8.0 =

* added Adobe Fonts in Pro version
* added Shape Divider block [https://www.ghostkit.io/docs/blocks/shape-divider/](https://www.ghostkit.io/docs/blocks/shape-divider/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog)
* added Frame extension (border, shadow, radius) [https://www.ghostkit.io/docs/extensions/frame/](https://www.ghostkit.io/docs/extensions/frame/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog)
* added Color Palette plugin to extend default Gutenberg color palette
* added possibility to activate Tabs and Accordions on hash change
* added visual styles in editor for hidden blocks that used Display extension
* improved Table of Contents block reload after headings change (no jumping in the editor anymore)
* fixed Reusable Widget number of blocks to select
* fixed Instagram block image alt attribute
* fixed font family reset button also resets font category
* fixed non-working links in TOC block when used special characters
* fixed Grid Columns, Buttons gap styles in editor
* fixed Display extension not adding classname
* fixed alignfull grid background margins

= 2.7.1 =

* added transformations Accordion to Tabs and vice versa (issue #31)
* fixed possible errors with reusable blocks
* fixed width of column content in editor
* fixed alert, icon box and number box last child paragraph margin

= 2.7.0 =

* added Countdown block
* added Custom CSS extension for each blocks
* added preview in editor for buttons outline styles
* added examples to blocks
* added translations to js files
* added Vertical option for Tabs block
* added Pills style variant for Tabs block
* added stars option for Testimonial block
* added URL options for Icon Box and Counter Box blocks
* added Accordion block activation based on location hash
* added active indicators to extensions panels
* improved Accordion block to work with unique slug, generated from label
* improved Tabs/Accordion labels unique slug generator (no hash conflicts)
* updated vendor plugins FontAwesome, Swiper, Jarallax
* fixed reusable widget rendering in custom posts without Gutenberg enabled
* fixed reusable blocks custom styles rendering

= 2.6.3 =

* disabled all extensions on dynamic core blocks
* fixed Templates modal open when active Pro
* fixed settings JS errors when no options updated

= 2.6.2 =

* added Typography settings page
* removed Settings page
  * added Icons settings page
  * added CSS & JavaScript settings page
* better fonts loading (load only necessary weights)

= 2.6.1 =

* fixed custom styles loading in reusable widget

= 2.6.0 =

* Warning! Changed custom styles rendering method. Recommended to go over all your posts and click on the Update button.
* added Typography settings
  * add Google Fonts globally site-wide
  * add Google Fonts locally on the edited page only
* added preview for all core blocks in editor for Spacings extension
* added Table of Contents block
* added Styles for core/list block
* added Numbered Style for core/heading block
* added Highlight format to WYSIWYG toolbar
* added Spacings and Display extensions support for Instagram and Twitter blocks
* improved Icon Picker
  * improved performance
  * added tooltips on each icon
  * added toggle button for categories
* improved performance of templates list loading
* changed Progress minimum height to 1
* changed Templates capability type to Post
* changed all extensions to use native className attribute
* fixed grid column bottom sticky
* fixed blocks unique classnames regeneration every time when editor loads
* fixed Carousels added inside Tabs
* minor UI changes

= 2.5.0 =

* added Focal Point picker in Grid background settings
* added jQuery events for ScrollReveal to let users change the config
* improved position of badges popup with color picker
* changed Changelog badges styles
* changed Grid background img tag output (fixes bug, when user with Editor permission save background image and block crashed)
* updated FontAwesome to 5.9.0
* updated Swiper to 4.5.0
* updated Jarallax to 1.11.0
* fixed Badge background color when adding it the first time
* fixed selected Column content left offset

= 2.4.4 =

* fixed grid background alignfull left and right styles
* fixed conflict with AWB video background and Video Block
* changed video-worker script to jarallax

= 2.4.3 =

* added Grid Gap preview styles in editor
* added Carousel item block inserter
* fixed Carousel fade effect and visible previous slides
* fixed pricing table editor columns styles in default themes

= 2.4.2 =

* added cleanup to Animate On Scroll blocks (extra styles automatically removed after animation ended)
* fixed Animate On Scroll errors in all blocks since update 2.4.1

= 2.4.1 =

* added "Animate on Scroll" preview in editor
* improved styles for code editor component
* fixed 'getBlockOrder' of undefined error

= 2.4.0 =

* added option to hide text in button and show only icon
* added Columns appender
* added blocks transformations:
  * `core/quote`, `core/pullquote` -> `ghostkit/testimonial`
  * `core/columns` -> `ghostkit/grid`
  * `core/button` -> `ghostkit/button`
  * between `ghostkit/alert`, `ghostkit/counter-box`, `ghostkit/number-box`
* added buttons wrapper clear style
* show grid align controls if 1 column selected
* fixed conflict with `core/archives` block
* fixed Google Maps block error when used invalid API key
* fixed FullHeight Google Maps block editor preview
* fixed Buttons block label save bug
* fixed Gist preloader

= 2.3.0 =

* added Templates Library. You can now add pre-designed templates and create your own
* added image backgrounds support on Grid and Column
* added global CSS & JavaScript on Settings page
* added support for prefix and suffix in Counter Box (just add texts around your count)
* added responsive Vertical Align option on Column block
* fixed creating new Button, Accordion and Pricing Table blocks (handles error after page updated)
* fixed changelog badge width
* fixed progress caption remove error
* fixed error when disabling blocks
* fixed Testimonials name and source remove error
* fixed Pricing Table RichTexts remove error
* fixed Progress Bar xml import error (aria attributes bug)
* fixed Grid columns number control if only 1 column showed

= 2.2.0 =

* added local and global Custom CSS / JS options
* added Ghost Kit options, that contains Custom Code and Customizer buttons (top right corner of Gutenberg editor)
* added Open in new tab and nofollow options on Buttons block
* added inline badges support (see text editor toolbar for new option)
* added uppercase format to text editor
* removed Custom CSS and Customizer blocks (use Ghost Kit options instead)
* minor changes

= 2.1.0 =

* added icon picker right inside block preview in editor for blocks:
  * Alert
  * Button
  * Divider
  * Icon Box
  * Testimonial
  * Video
* added Buttons '+' button to add buttons
* added Buttons block prev/next move buttons to resort
* added Buttons 'Align' button in Inspector
* added Accordion '+' button to add new accordion
* added Accordion '-' button to remove selected accordion
* added Accordion 'Collapse' button in Toolbar
* added Accordion items up/down buttons to resort
* added Tabs '+' button to add new tab
* added Tabs '-' button to remove selected tab
* added Tabs 'Align' button in Toolbar
* added Number Box 'Position' button in Toolbar
* added Number Box 'Show Content' option
* added Pricing Table '+' button to add new tables
* added Pricing Table '-' button to remove selected table
* added Pricing Table items prev/next buttons to resort
* added Icon Box 'Position' button in Toolbar
* added Icon Box 'Show Content' option
* added Video 'Aspect Ratio' button in Toolbar
* added Video 'URL' input in Toolbar
* added Progress Bar resizable indicators
* added Google Maps 'Add Marker' button in Toolbar
* added Google Maps 'Style' button in Toolbar
* added Google Maps 'Full Height' option in Inspector
* added Google Maps height resizable box
* added Google Maps 'Better Scroll & Draggable' option
* added Grid dynamic layouts preview generator (without SVG)
* added custom filter 'ghostkit.editor.grid.layouts' to extend predefined Grid layouts
* added Video transformations to Core blocks
* added Divider transformations to Separator
* changed Grid and Column buttons to icons instead of 'Select Grid' and 'Select Column'
* changed Google Maps 'Style' selector to image picker
* change Video 'Aspect Ratio' selector to image picker
* changed default Google Maps styles (better contrast)
* improved icon picker:
  * larger icons
  * 3 icons per row
  * sticky icons pack label
* updated all block icons (removed ghost from icons and changed color)
* hide Grid options if no layout selected
* fixed Google Maps error after adding marker
* fixed Google Maps Full Height styles in Editor
* fixed column content sticky
* fixed 'gkt_enqueue_plugin_font_awesome' filter order (you can use it in themes functions.php)
* a lot of minor changes

= 2.0.1 =

* fixed Tabs Legacy block extensions support

= 2.0.0 =

* added background option for Grid and Column blocks (+ support image, video and parallax backgrounds with [AWB plugin](https://wordpress.org/plugins/advanced-backgrounds/))
* added Video block possibility to play videos on mobile devices without open new tab
* added Video block autoplay & autopause options
* added Icons to Button block
* added extendable Icon Picker control with default FontAwesome icons
* added draggable for Spacing inputs. Now you can change value using mouse and up, down keys
* added plugin Settings page
* added Tabs page hash support (old tabs are deprecated, you need to add new Tabs block on the page)
* added controls to show/hide Pricing Table price/currency/repeat items
* added 'ghostkit' attribute with plugin parameters support for blocks (3rd-party blocks may be extended with Ghost Kit Extensions)
* added :focus styles outline for Button block
* added [Ghost Kit Pro](https://www.ghostkit.io/pricing/?utm_source=wordpress.org&utm_medium=changelog&utm_campaign=changelog) support
* added 'inserter' and 'reusable' attributes with 'false' value in inner blocks
* added icon in Ghost Kit blocks category
* improved Grid block columns and row hovering styles
* updated overall styles
  * changed offsets to em
  * changed changelog badges to solid color
  * added border-radius to some blocks
* changed Video block image placeholder only visible until video start playing
* changed Google Maps data-markers attribute to children blocks for each marker (better extensions possibility)
* changed column structure (added content wrapper for better extensions possibility)
* changed Grid Column editor classes (added variants and custom Ghost Kit unique class support)
* removed inline toolbar from Tabs & Accordion
* disabled Spacings inputs autocomplete
* fixed IE11 Counter Box and Icon Box blocks with top icon and number
* fixed Tabs block disappearing of tabs when renaming it
* fixed Button line height in editor
* fixed Accordion collapse icon size & position in editor
* fixed Alert, Icon Box & Number Box editor content margins
* fixed custom className duplicates in most of blocks
* fixed Grid columns attributes resets to defaults after initial insertion
* fixed Grid block full width align horizontal scrollbar in editor
* fixed multiple rows in Grid block editor columns overlapping
* fixed custom style unique class duplication after block clone
* fixed inner blocks overlapping in editor Alert, Number Box & Icon Box blocks
* fixed invisible video in some themes

= 1.6.3 =

* added file types limitations in Video and Testimonial blocks
* fixed WP 5.0 admin styles enqueue
* fixed self-hosted videos play on mobile devices
* fixed jQuery is undefined error in some of the themes

= 1.6.2 =

* added jQuery custom events trigger
* added img selector string in OFI script
* improved ghostkit attributes - created only when custom styles added (before this update it was always added on all blocks)
* changed main script to es6 class for extensions
* fixed Google Maps marker address change
* fixed some blocks broken after XML content importing (escaped characters in custom styles)

= 1.6.1 =

* added number wrapper in counter box
* changed carousel slides backgrounds in editor
* fixed usage of deprecated PanelColor
* fixed button line height in editor
* fixed "Bar" label in progress bar background color control

= 1.6.0 =

* added hover colors options to Alert, Number Box, Counter Box, Icon Box, Divider, Progress blocks
* improved color pickers in blocks (show colors palette only in popover)
* changed fullscreen video popup z-index to 1500
* removed CodeEditor from Custom CSS since it removed in Gutenberg 4.2
* fixed error in Customizer, Instagram, Twitter, Testimonial, Video blocks in Gutenberg 4.2
* fixed Animate on Scroll zoom effect
* minor changes

= 1.5.2 =

* fixed selected image preview in Inspector (Video and Testimonial blocks)

= 1.5.1 =

* added default InnerBlocks in Alert, Number Box, Icon Box, Testimonial, Changelog
* fixed Gutenberg 4.0 Spacing extension and Grid Columns options
* fixed Gutenberg 4.0 number attribute type automatic convert
* fixed Gutenberg 4.0 Button block url input width
* fixed Pricing Table block variant name to extend it
* fixed Pricing Table block error when enabled showPopular option
* fixed Pricing Table block padding in features list
* fixed Pricing Table block bottom margin on mobile devices
* fixed Grid block fullwidth styles in editor
* fixed Google Maps block markers show when no custom map Style defined

= 1.5.0 =

* deprecated Customizer and Custom CSS blocks. This functionality you can find in the top right corner of the editor
* added multiple buttons support in Button block. Be careful, Button block may lose some settings when you update the plugin
* added Instagram block
* added Twitter block
* added Pricing Table block
* added widget for reusable blocks to use in sidebars
* added anchor support to almost all blocks
* improved Animate on Scroll extension (added more options)
* changed default blocks color
* changed button block url input style (now floating)
* changed Spacings extension (device selector changed to tabs)
* prevent adding extensions on reusable blocks
* fixed php error when Gutenberg plugin is not activated
* fixed animate in viewport, when on the screen > 1 counters or progress bars
* fixed styles rendering for new and duplicated blocks
* fixed first loading of Customizer block
* fixed php notices in customizer
* fixed custom styles in transformed blocks
* minor changes

= 1.4.0 =

* added Animate in viewport options in Number Box and Progress Bar
* added Animate on Scroll extension (use scrollreveal library)
* added Custom CSS block styles in editor to preview
* extensions moved from Advanced inspector to bottom of Inspector Controls
* renamed extension Indents to Spacings
* fixed column sticky position 0
* fixed Google Maps placeholder marker icon map overlap
* fixed Google Maps deprecated object

= 1.3.0 =

* added Google Maps block
* added !important style support in Spacings extension
* changed plugin logo

= 1.2.0 =

* added Changelog block
* added Widgetized Area block
* added vertical align buttons in Grid toolbar
* added predefined layouts in Grid block (when you first insert Grid, you can choose)
* updated some block icons
* fixed Gist block table styles bug in default themes
* fixed possible bug with "0" number output in some blocks

= 1.1.4 =

* added Gist block transformation from url
* added option collapseOne to Accordion block
* added option count to Progress block
* added helper toolbar with predefined styles to Alert block
* added helper toolbar with line type to Divider block
* improved Grid column responsive settings (added tabs for each device)
* changed icons to use &lt;svg&gt; instead of &lt;img&gt;

= 1.1.3 =

* improved blocks JS initialization. Support dynamic blocks (for example after AJAX content loading)
* updated block icons

= 1.1.2 =

* added support for Gutenberg 3.7.0
* improved custom styles extension (simplified code and prevent console warnings)

= 1.1.1 =

* added "Select Column" helper UI element to easily select Grid columns [https://wordpress.org/support/topic/selecting-a-column-in-a-grid/](https://wordpress.org/support/topic/selecting-a-column-in-a-grid/)
* moved all blocks to Ghost Kit category
* fixed compatibility with WordPress Import/Export content
* fixed Spacings (margins / paddings) responsive values change [https://wordpress.org/support/topic/indents-settings-not-working-on-desktop-laptop-table-mobile/](https://wordpress.org/support/topic/indents-settings-not-working-on-desktop-laptop-table-mobile/)

= 1.1.0 =

* added Testimonial block
* added Divider block
* added support for some Kirki fields in Customizer block
* added Fullscreen click action in Video block
* added column block Sticky option
* updated FontAwesome to 5.2.0
* changed RichText usage (some blocks may break)
* removed wp-block-... classname from all blocks
* fixed Customizer and Custom CSS blocks save meta data in custom posts
* fixed Custom CSS block styles escaping (escape > and <)
* fixed columns centering in Grid block editor
* fixed GitHub Gist block iOs smooth scroll
* minor fixes

= 1.0.0 =

* Initial Release
