/* eslint-disable import/no-extraneous-dependencies */
const path = require( 'path' );

const pkg = require( 'json-file' ).read( './package.json' ).data;

const cfg = {};

// Build Paths.
cfg.name = 'ghostkit';
cfg.src = './src';
cfg.dist_root = './dist';
cfg.dist = '{dist_root}/{name}';

// Browser sync.
cfg.browser_sync = {
    proxy: '{name}.local',
};

// Template variables that will be automatically replaced.
cfg.template_files_src = '{dist}/**/*.{md,php,js,css,pot,json}';
cfg.template_files_variables = {
    text_domain: pkg.name,
    plugin_version: pkg.version,
    plugin_name: pkg.name,
    plugin_title: pkg.title,
    plugin_author: pkg.author,
};

// Copy files.
cfg.copy_files_src = [
    '{src}/**/*',
    '!{src}/**/*.{js}',
    '{src}/**/vendor/**/*.{js}',
    './node_modules/*gist-simple/dist/gist-simple.css',
    './node_modules/*gist-simple/dist/gist-simple.min.js',
    './node_modules/*gist-simple/dist/gist-simple.min.js.map',
    './node_modules/*gmaps/gmaps.min.js',
    './node_modules/*gmaps/gmaps.min.js.map',
    './node_modules/*ie11-custom-properties/ie11CustomProperties.js',
    './node_modules/*jarallax/dist/jarallax-video.min.js',
    './node_modules/*jarallax/dist/jarallax-video.min.js.map',
    './node_modules/*jarallax/dist/jarallax.min.js',
    './node_modules/*jarallax/dist/jarallax.min.js.map',
    './node_modules/*jarallax/dist/jarallax.css',
    './node_modules/*object-fit-images/dist/ofi.min.js',
    './node_modules/*parsleyjs/dist/parsley.min.js',
    './node_modules/*parsleyjs/dist/parsley.min.js.map',
    './node_modules/*scrollreveal/dist/scrollreveal.min.js',
    './node_modules/*swiper/swiper-bundle.min.js',
    './node_modules/*swiper/swiper-bundle.min.js.map',
    './node_modules/*swiper/swiper-bundle.min.css',
];

cfg.copy_files_dist = ( file ) => {
    let destPath = `${ cfg.dist_root }/${ cfg.name }`;
    const filePath = path.relative( process.cwd(), file.path );

    if ( filePath && /^node_modules/g.test( filePath ) ) {
        destPath += '/assets/vendor';
    }

    return destPath;
};

// Prefix SCSS files.
cfg.prefix_scss_files_src = [
    '{dist}/**/*.scss',
    '!{dist}/**/vendor/**/*.{scss}',
];

// Compile SCSS files.
cfg.compile_scss_files_src = [
    '{src}/*assets/**/*.scss',
    '{src}/*gutenberg/style.scss',
    '{src}/*gutenberg/editor.scss',
    '{src}/*gutenberg/blocks/*/styles/style.scss',
    '{src}/*settings/style.scss',
];
cfg.compile_scss_files_rtl = true;

// Compile JS files.
cfg.compile_js_files_src = [
    '{src}/*assets/**/*.js',
    '{src}/*gutenberg/index.js',
    '{src}/*gutenberg/blocks/*/frontend.js',
    '{src}/*settings/index.js',
    '!{src}/**/vendor/**/*',
];

// Correct line endings files.
cfg.correct_line_endings_files_src = '{dist}/**/*.{js,css}';

// ZIP files.
cfg.zip_files = [
    {
        src: '{dist}/**/*',
        src_opts: {
            base: '{dist_root}',
        },
        dist: '{dist_root}/{name}.zip',
    },
];

// Watch files.
cfg.watch_files = [ '{src}/**/*', '!{src}/**/*.{js}' ];

cfg.watch_js_files = [ '{src}/**/*.js', '{src}/**/*.json', '!{src}/*vendor/**/*' ];

cfg.watch_scss_files = '{src}/**/*.scss';

module.exports = cfg;
