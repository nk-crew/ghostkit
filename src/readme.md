# GhostKit - Gutenberg Blocks Collection #

* Contributors: nko
* Tags: gutenberg, blocks, kit, collection, grid
* Requires at least: 4.8.0
* Tested up to: 4.9
* Requires PHP: 5.4
* Stable tag: @@plugin_version
* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html

GhostKit is a blocks collection and extensions for Gutenberg page builder.

## Description ##

GhostKit is a blocks collection and powerful extensions for Gutenberg page builder. All blocks are extensible and ready for developers.

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
* Google Maps
* Widgetized Area (output registered sidebars)
* Custom CSS (add custom CSS on the pages)
* Customizer (overwrite customizer options on the pages)

### Available extensions ###

* Indents (paddings, margins)
* Display (show/hide block)

### Coming soon blocks ###

* Countdown
* Pricing
* Instagram
* Twitter
* Gif

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

* **gkt_grid_variants**
* **gkt_divider_variants**
* **gkt_alert_variants**
* **gkt_button_variants**
* **gkt_counter_box_variants**
* **gkt_tabs_variants**
* **gkt_accordion_variants**
* **gkt_icon_box_variants**
* **gkt_progress_variants**
* **gkt_video_variants**
* **gkt_carousel_variants**
* **gkt_testimonial_variants**
* **gkt_gist_variants**
* **gkt_changelog_variants**
* **gkt_google_maps_variants**

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
12. Video
13. Testimonial
14. GitHub Gist
15. Changelog
16. Blocks Extensions

## Changelog ##

= 1.3.0 =

* added Google Maps block
* added !important style support in Indents extension
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
* fixed Indents (margins / paddings) responsive values change [https://wordpress.org/support/topic/indents-settings-not-working-on-desktop-laptop-table-mobile/](https://wordpress.org/support/topic/indents-settings-not-working-on-desktop-laptop-table-mobile/)

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
