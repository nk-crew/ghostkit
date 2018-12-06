# GhostKit - Gutenberg Blocks Collection #

* Contributors: nko
* Tags: gutenberg, blocks, kit, collection, grid
* Requires at least: 4.8.0
* Tested up to: 4.9
* Requires PHP: 5.4
* Stable tag: @@plugin_version
* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html

GhostKit is a blocks collection and extensions for Gutenberg block editor.

## Description ##

GhostKit is a blocks collection and powerful extensions for Gutenberg block editor. With this collection, you will gain more control over content just like with popular page builders. Just start with responsive Grid block and you can't stop building the page ;)

We are using this plugin in our premium themes, so all the blocks are extensible and ready for developers.

### Links ###

* [Demo Site](https://ghostkit.io/)
* [GitHub](https://github.com/nk-o/ghostkit)

### Available blocks ###

* Grid (fully responsive)
* Divider
* Progress Bar
* Button
* Accordion
* Tabs
* Carousel
* Alert
* Icon Box
* Number Box
* Video
* Testimonial
* GitHub Gist
* Changelog
* Pricing Table
* Google Maps
* Instagram
* Twitter
* Widgetized Area (output registered sidebars)

### Available extensions ###

* Spacings (paddings, margins)
* Display (show/hide block)
* Animate on Scroll (show block in viewport)
* Custom CSS (add custom CSS on the pages)
* Customizer (overwrite customizer options on the pages)


## Installation ##

You need to install the [Gutenberg plugin](https://wordpress.org/plugins/gutenberg/) to use GhostKit. Eventually, Gutenberg (the block editor) will be merged into WordPress and you won’t need the plugin.

### Automatic installation ###

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don’t need to leave your web browser. To do an automatic install of GhostKit, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type GhostKit and click Search Plugins. Once you’ve found our plugin you can view details about it such as the point release, rating and description. Most importantly of course, you can install it by simply clicking “Install Now”.

### Manual installation ###

The manual installation method involves downloading our GhostKit plugin and uploading it to your webserver via your favourite FTP application. The WordPress codex contains [instructions on how to do this here](https://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

## Frequently Asked Questions ##

### How to disable enqueued plugins (JS, CSS) on frontend ####

There are some plugins, enqueued with GhostKit on your page. If you don't like the plugin and/or want to change it to your alternate plugin, you can disable it using filters. Example:

    add_filter( 'gkt_enqueue_plugin_font_awesome', '__return_false' );

Available filters:

* **gkt_enqueue_plugin_font_awesome**
* **gkt_enqueue_plugin_object_fit_images**
* **gkt_enqueue_plugin_video_worker**
* **gkt_enqueue_plugin_swiper**
* **gkt_enqueue_plugin_gist_embed**
* **gkt_enqueue_plugin_scrollreveal**

### How to extend existing blocks ####

You can add Variants to existing blocks, so you will be able to add your own styles for it:

    add_filter( 'gkt_alert_variants', 'my_alert_variants' );

    function my_alert_variants( $variants ) {
        return array_merge( $variants, array(
            'my_variant' => array(
                'title' => esc_html__( 'My Variant', '@@text_domain' ),
            ),
        ) );
    }

Then, when editing block you will see the Variants select and on frontend you will see an additional classname on the block named `ghostkit-alert-variant-my_variant`

Available filters:

* **gkt_accordion_variants**
* **gkt_accordion_item_variants**
* **gkt_alert_variants**
* **gkt_button_wrapper_variants**
* **gkt_button_variants**
* **gkt_carousel_variants**
* **gkt_carousel_slide_variants**
* **gkt_changelog_variants**
* **gkt_counter_box_variants**
* **gkt_divider_variants**
* **gkt_gist_variants**
* **gkt_google_maps_variants**
* **gkt_grid_variants**
* **gkt_grid_column_variants**
* **gkt_icon_box_variants**
* **gkt_instagram_variants**
* **gkt_pricing_table_variants**
* **gkt_pricing_table_item_variants**
* **gkt_progress_variants**
* **gkt_tabs_variants**
* **gkt_tabs_tab_variants**
* **gkt_testimonial_variants**
* **gkt_twitter_variants**
* **gkt_video_variants**

### How to extend existing blocks classnames ####

You can add additional classnames to blocks using JavaScript filters:

    /**
    * Classnames filter.
    *
    * @param {String} className Classname applied to save and edit element.
    * @param {Object} props  Block props.
    *
    * @return {String} Classname.
    */
    function customClassName( className, props ) {
        switch ( props.name ) {
        case 'ghostkit/button-single':
            className += ' my-classname';

            break;
        }

        return className;
    }

    wp.hooks.addFilter( 'ghostkit.blocks.className', 'ghostkit/my-new-className', customClassName );
    wp.hooks.addFilter( 'ghostkit.editor.className', 'ghostkit/my-new-className', customClassName );

Available filters:

* **ghostkit.blocks.className**
* **ghostkit.editor.className**

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
* **beforePrepareCustomStyles.ghostkit**
* **afterPrepareCustomStyles.ghostkit**
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
* **afterPrepareGoogleMaps.ghostkit**
* **beforePrepareSR.ghostkit**
* **afterPrepareSR.ghostkit**

## Screenshots ##

1. List of all available blocks
2. Responsive Grid
3. Progress Bar
4. Button
5. Divider
6. Accordion
7. Tabs
8. Carousel
9. Alert
10. Icon Box
11. Counter Box
12. Google Maps
13. Video
14. Testimonial
15. Instagram
16. Twitter
17. GitHub Gist
18. Changelog
19. Pricing Table
20. Blocks Extensions

## Changelog ##

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
* moved all blocks to GhostKit category
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
