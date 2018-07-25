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

[**Demo Site**](https://ghostkit.io/)

#### Available blocks: ####

* Grid (fully responsive)
* Progress Bar
* Button
* Accordion
* Tabs
* Carousel
* Alert
* Icon Box
* Number Box
* Video
* Github Gist
* Custom CSS (let you add custom CSS on the pages)
* Customizer (let you easily overwrite customizer options on the pages)

#### Available extensions: ####

* Indents (paddings, margins)
* Display (show/hide block)

#### Coming soon blocks: ####

* Countdown
* Testimonial
* Pricing
* Instagram
* Twitter
* Gif


## Installation ##

You need to install the [Gutenberg plugin](https://wordpress.org/plugins/gutenberg/) to use GhostKit. Eventually, Gutenberg (the block editor) will be merged into WordPress and you won’t need the plugin.

#### Automatic installation ####

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don’t need to leave your web browser. To do an automatic install of GhostKit, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type GhostKit and click Search Plugins. Once you’ve found our plugin you can view details about it such as the point release, rating and description. Most importantly of course, you can install it by simply clicking “Install Now”.

#### Manual installation ####

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

* **gkt_alert_variants**
* **gkt_button_variants**
* **gkt_counter_box_variants**
* **gkt_tabs_variants**
* **gkt_accordion_variants**
* **gkt_grid_variants**
* **gkt_icon_box_variants**
* **gkt_progress_variants**
* **gkt_video_variants**
* **gkt_carousel_variants**
* **gkt_testimonial_variants**
* **gkt_gist_variants**



## Screenshots ##

1. Responsive Grid
2. Progress Bar
3. Button
4. Accordion
5. Tabs
6. Carousel
7. Alert
8. Icon Box
9. Number Box
10. Video
11. GitHub Gist
12. Blocks Extensions


## Changelog ##

= 1.0.0 =
* Initial Release
