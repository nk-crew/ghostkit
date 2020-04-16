const unsupportedBlocks = [
    'core/shortcode',
    'core/block',
    'core/legacy-widget',
    'core/tag-cloud',
    'core/calendar',
    'core/navigation-menu',
    'core/search',
    'core/categories',
    'core/archives',
    'core/rss',
    'core/latest-posts',
    'core/latest-comments',
];

/**
 * Check if core block may be extended.
 *
 * @param {String} name - block name.
 *
 * @return {Boolean} block supported.
 */
export default function checkCoreBlock( name ) {
    return (
        name
        && /^core/.test( name )
        && -1 === unsupportedBlocks.indexOf( name )
    );
}
