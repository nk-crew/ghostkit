/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    color: attributes.color,
                    svg: {},
                };

                Object.keys( attributes ).forEach( ( key ) => {
                    if ( attributes[ key ] ) {
                        let prefix = key.split( '_' )[ 0 ];
                        let type = key.split( '_' )[ 1 ];

                        if ( ! type ) {
                            type = prefix;
                            prefix = '';
                        }

                        if ( type && ( 'height' === type || 'width' === type ) ) {
                            if ( prefix && 'undefined' === typeof styles.svg[ `media_${ prefix }` ] ) {
                                styles.svg[ `media_${ prefix }` ] = {};
                            }

                            if ( 'height' === type && prefix ) {
                                styles.svg[ `media_${ prefix }` ].height = `${ attributes[ key ] }px`;
                            } else if ( 'height' === type ) {
                                styles.svg.height = `${ attributes[ key ] }px`;
                            } else if ( 'width' === type && prefix ) {
                                styles.svg[ `media_${ prefix }` ].width = `${ attributes[ key ] }%`;
                            } else if ( 'width' === type ) {
                                styles.svg.width = `${ attributes[ key ] }%`;
                            }
                        }
                    }
                } );

                return styles;
            },
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        attributes: {
            align: {
                type: 'string',
                default: 'full',
            },

            svg: {
                type: 'string',
            },
            flipVertical: {
                type: 'boolean',
                default: false,
            },
            flipHorizontal: {
                type: 'boolean',
                default: false,
            },

            sm_height: {
                type: 'string',
                default: '',
            },
            sm_width: {
                type: 'string',
                default: '',
            },

            md_height: {
                type: 'string',
                default: '',
            },
            md_width: {
                type: 'string',
                default: '',
            },

            lg_height: {
                type: 'string',
                default: '',
            },
            lg_width: {
                type: 'string',
                default: '',
            },

            xl_height: {
                type: 'string',
                default: '',
            },
            xl_width: {
                type: 'string',
                default: '',
            },

            height: {
                type: 'string',
                default: 150,
            },
            width: {
                type: 'string',
                default: 100,
            },

            color: {
                type: 'string',
                default: '#0366d6',
            },
        },
        save,
    },
];
