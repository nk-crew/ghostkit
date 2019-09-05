# Powerful Gutenberg Blocks and Templates Collection - Ghost Kit #

* Contributors: nko
* Tags: gutenberg, blocks, templates, block, builder
* Requires at least: 4.9.0
* Tested up to: 5.2
* Requires PHP: 5.4
* Stable tag: @@plugin_version
* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html

Powerful Gutenberg Blocks, Templates, and Extensions Collection - Ghost Kit.

## Description ##

Gutenberg Blocks, Templates, and Extensions Collection for WordPress page builder - Ghost Kit. With this collection, you will gain more control over content just like with popular page builders. Just start with pre-defined templates and you can't stop building the page ;)

We are using this plugin in our premium themes, so all the blocks are extensible and ready for developers.

### Links ###

* [Demo Site](https://ghostkit.io/)
* [GitHub](https://github.com/nk-o/ghostkit)

### Templates ###

Ghost Kit has pre-made templates, so you can get started with it and build your pages quickly.

### Typography ###

Change typography options globally on a whole site or on specific pages only. Options available:

* Font Family (supported Google Fonts)
* Font Weight
* Font Size
* Line Height
* Letter Spacing

By default you can change typography for the following elements:

* Body
* Buttons
* Headings
  * From H1 to H6

### Formats ###

* Uppercase
* Highlight
* Badge

### Blocks ###

* [**Grid**](https://ghostkit.io/blocks/grid/). Responsive grid block to build layouts of all shapes and sizes thanks to a twelve column system. Visual columns size and order change
* [**Progress**](https://ghostkit.io/blocks/progress/). Show the progress of your work, skills or earnings
* [**Button**](https://ghostkit.io/blocks/button/). Change important links to buttons to get more click rate
* [**Divider**](https://ghostkit.io/blocks/divider/). Divide your long texts and blocks
* [**Alert**](https://ghostkit.io/blocks/alert/). Provide contextual feedback messages for user actions
* [**Icon Box**](https://ghostkit.io/blocks/icon-box/). Icons are one of the best visual replacement for text descriptions
* [**Number Box**](https://ghostkit.io/blocks/number-box/). Show your progress and rewards using counting numbers
* [**Accordion**](https://ghostkit.io/blocks/accordion/). Toggle the visibility of content across your project
* [**Tabs**](https://ghostkit.io/blocks/tabs/). Separate content on the tabs with titles
* [**Video**](https://ghostkit.io/blocks/video/). Plain and Fullscreen YouTube, Vimeo and Self-Hosted videos
* [**Carousel**](https://ghostkit.io/blocks/carousel/). Carousel for any type of content – images or other blocks
* [**Pricing Table**](https://ghostkit.io/blocks/pricing-tables/). Sell your products or services and show all features
* [**Testimonial**](https://ghostkit.io/blocks/testimonial/). Show how your users love your products and what saying
* [**Twitter**](https://ghostkit.io/blocks/twitter/). Show Twitter feed and user data
* [**Instagram**](https://ghostkit.io/blocks/instagram/). Show Instagram feed and user data
* [**Google Maps**](https://ghostkit.io/blocks/google-maps/). Show maps with custom styles, markers and settings
* [**GitHub Gist**](https://ghostkit.io/blocks/github-gist/). Embed code parts form GitHub Gist to your site or documentation
* [**Changelog**](https://ghostkit.io/blocks/changelog/). Show the changes log of your product
* [**Table of Contents**](https://ghostkit.io/blocks/table-of-contents/). Automatically generate a table of contents by parsing page headers in content
* **Widgetized Area**. Select registered sidebars and put it in any place

### Extensions ##

* [**Spacings**](https://ghostkit.io/extensions/spacings/). Easily add spacings in Ghost Kit and Core blocks
* [**Display**](https://ghostkit.io/extensions/display/). Show and hide blocks Ghost Kit and Core blocks on different screen sizes
* [**Animate on Scroll**](https://ghostkit.io/extensions/animate-on-scroll/). Show with animation Ghost Kit and Core blocks on page scrolling
* [**Custom CSS & JavaScript**](https://ghostkit.io/extensions/custom-css-js/). This extension is available on all pages and let you add custom CSS and JavaScript for the current page and globally site wide
* [**Customizer**](https://ghostkit.io/extensions/customizer/). This extension is available on all pages and let you change customizer options on the current page

### Try Ghost Kit PRO Addon ###

[Ghost Kit PRO Addon](https://ghostkit.io/pricing/) extends Ghost Kit functionality and improve your design experience. The list of PRO features:

* 3 icon packs
* Visual Grid editor
* Grid full height option
* Google Maps custom markers
* Google Maps info boxes
* Gradient backgrounds
* Gradient text icons
* Features list will grow in updates

If you like it or if you simply want to help us keep improving Ghost Kit plugin - [Go Pro](https://ghostkit.io/pricing/).


= Real Usage Examples =

* [Skylith - Multipurpose Gutenberg Theme](https://demo.nkdev.info/#skylith)


## Installation ##

Make sure you use WordPress 5 As alternative you need to install the [Gutenberg plugin](https://wordpress.org/plugins/gutenberg/) to use Ghost Kit.

### Automatic installation ###

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don’t need to leave your web browser. To do an automatic install of Ghost Kit, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type Ghost Kit and click Search Plugins. Once you’ve found our plugin you can view details about it such as the point release, rating and description. Most importantly of course, you can install it by simply clicking “Install Now”.

### Manual installation ###

The manual installation method involves downloading our Ghost Kit plugin and uploading it to your webserver via your favourite FTP application. The WordPress codex contains [instructions on how to do this here](https://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

## Frequently Asked Questions ##

### How to disable enqueued plugins (JS, CSS) on frontend ####

There are some plugins, enqueued with Ghost Kit on your page. If you don't like the plugin and/or want to change it to your alternate plugin, you can disable it using filters. Example:

    add_filter( 'gkt_enqueue_plugin_font_awesome', '__return_false' );

Available filters:

* **gkt_enqueue_plugin_font_awesome**
* **gkt_enqueue_plugin_object_fit_images**
* **gkt_enqueue_plugin_jarallax**
* **gkt_enqueue_plugin_swiper**
* **gkt_enqueue_plugin_gist_simple**
* **gkt_enqueue_plugin_scrollreveal**

### How to add templates in theme ####

You can add templates in your theme, so users will be able to insert it on pages with a single click. This is a simple example of theme templates structure:

- wp-content/themes/YOUR_THEME/ghostkit/templates/
    - /first-template/
        - /content.php
        - /thumbnail.png
    - /second-template/
        - /content.php
        - /thumbnail.png
    - ...

`content.php` file content example:

    <?php
    /**
     * Name: Template Name
     * Category: Category Name
     */

    ?>

    <!-- wp:paragraph -->
    <p>content</p>
    <!-- /wp:paragraph -->

`thumbnail.png` is not required, but strongly recommended, because users will see what template will look like after insertion.

### How to extend typography settings ####

By default Typography options used for Body, Headings, and Buttons. You can add custom options by extending typography using PHP filter:

    add_filter( 'gkt_custom_typography', 'my_gkt_custom_typography' );
    function my_gkt_custom_typography( $custom_typography ) {

        // Add typography options for `.my-selector`.
        $custom_typography['my-selector'] = array(
            'label' => esc_html__( 'My Selector', '@@text_domain' ),
            'defaults' => array(
                'font-family-category' => 'default',
                'font-family' => '',
                'font-size' => '',
                'font-weight' => '',
                'line-height' => '',
                'letter-spacing' => '',
            ),
            'output' => array(
                array(
                    'selectors' => '.my-selector',
                ),
                array(
                    'selectors' => '.editor-styles-wrapper .my-selector',
                    'editor' => true,
                ),
            ),
        );

        // Add typography options for `.my-selector-2` with Font Size and Font Weight control only.
        $custom_typography['my-selector-2'] = array(
            'label' => esc_html__( 'My Selector 2', '@@text_domain' ),
            'defaults' => array(
                'font-size' => '10px',
                'font-weight' => '600',
            ),
            'output' => array(
                array(
                    'selectors' => '.my-selector-2',
                ),
                array(
                    'selectors' => '.editor-styles-wrapper .my-selector-2',
                    'editor' => true,
                ),
            ),
        );

        return $icons;
    }

### How to extend icons in icon picker list ####

By default icon picker contains FontAwesome icons. You can add any icons you want. First of all you need to enqueue these icons in editor and frontend pages to see it, then extend icon picker using PHP filter:

    // add icons list.
    add_filter( 'gkt_icons_list', 'my_gkt_icons' );
    function my_gkt_icons( $icons ) {
        $icons['my-icons-pack'] = array(
            'name' => 'My Icons',
            'icons' => array(
                array(
                    'class' => 'fab fa-500px',
                    'keys' => '500px',
                ),
                array(
                    'class' => 'fab fa-500px',
                    'keys' => '500px',
                ),
                ...
            ),
        );

        return $icons;
    }

    // add icons assets
    // will be automatically added in Editor and Frontend
    add_action( 'gkt_icons_enqueue_assets__my-icons-pack', 'my_gkt_icons_enqueue_assets' );
    function my_gkt_icons_enqueue_assets( $icons ) {
        wp_register_script( 'my-icons-pack', plugins_url( '/assets/my-icons-pack/script.min.js', __FILE__ ), array(), '1.0.0' );
    }

### How to extend existing blocks ####

You should use default Gutenberg hooks to extend blocks functionality. Read more here: https://wordpress.org/gutenberg/handbook/designers-developers/developers/filters/block-filters/#block-style-variations

### How to extend existing blocks classnames ####

You can extend Gutenberg blocks save attributes using core hooks. Read more here: https://developer.wordpress.org/block-editor/developers/filters/block-filters/#blocks-getsavecontent-extraprops

### jQuery frontend events ####

On frontend there are a lot of jQuery events. Usage example:

    jQuery( document ).on( 'afterInitBlocks.ghostkit', function( evt, classObject ) {
        console.log( evt, classObject );
    } );

Available events:

* **beforeInit.ghostkit**
* **afterInit.ghostkit**
* **beforeInitBlocks.ghostkit**
* **afterInitBlocks.ghostkit**
* **beforePrepareCounters.ghostkit**
* **afterPrepareCounters.ghostkit**
* **beforeRunCounters.ghostkit**
* **afterRunCounters.ghostkit**
* **beforePrepareTabs.ghostkit**
* **afterPrepareTabs.ghostkit**
* **beforePrepareAccordions.ghostkit**
* **afterPrepareAccordions.ghostkit**
* **beforePrepareCarousels.ghostkit**
* **afterPrepareCarousels.ghostkit**
* **beforePrepareVideo.ghostkit**
* **afterPrepareVideo.ghostkit**
* **beforePrepareGist.ghostkit**
* **afterPrepareGist.ghostkit**
* **beforePrepareChangelog.ghostkit**
* **afterPrepareChangelog.ghostkit**
* **beforePrepareGoogleMaps.ghostkit**
* **beforePrepareGoogleMapsStart.ghostkit**
* **beforePrepareGoogleMapsEnd.ghostkit**
* **afterPrepareGoogleMaps.ghostkit**
* **beforePrepareSR.ghostkit**
* **beforePrepareSRStart.ghostkit**
* **beforeInitSR.ghostkit**
* **beforePrepareSREnd.ghostkit**
* **afterPrepareSR.ghostkit**

## Screenshots ##

1. All blocks
2. Templates
3. Responsive Grid
4. Progress Bar
5. Button
6. Divider
7. Accordion
8. Tabs
9. Carousel
10. Alert
11. Icon Box
12. Counter Box
13. Google Maps
14. Video
15. Testimonial
16. Instagram
17. Twitter
18. GitHub Gist
19. Changelog
20. Pricing Table
21. Blocks Extensions

## Changelog ##

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
* added [Ghost Kit PRO](https://ghostkit.io/pricing/) addon support
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
