// Import CSS
import './editor.scss';

// External Dependencies.
if ( ! global._babelPolyfill ) {
    require( '@babel/polyfill' );
}
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/testimonial.svg';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    TextControl,
    Button,
} = wp.components;

const { apiFetch } = wp;
const {
    registerStore,
    withSelect,
} = wp.data;

const {
    InspectorControls,
    InnerBlocks,
    RichText,
    MediaUpload,
} = wp.editor;

/**
 * Camel case to Title case.
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 *
 * @param {string} str - camel case string.
 *
 * @return {string} title case string.
 */
function toTitleCase( str ) {
    return str.split( /[.,/ \-_]/ ).map( ( word ) => {
        return word && word.length ? word.replace( word[ 0 ], word[ 0 ].toUpperCase() ) : word;
    } ).join( ' ' );
}

const actions = {
    setImageTagData( query, image ) {
        return {
            type: 'SET_IMAGE_TAG_DATA',
            query,
            image,
        };
    },
    getImageTagData( query ) {
        return {
            type: 'GET_IMAGE_TAG_DATA',
            query,
        };
    },
};
registerStore( 'ghostkit/testimonial', {
    reducer( state = { images: {} }, action ) {
        switch ( action.type ) {
        case 'SET_IMAGE_TAG_DATA':
            if ( ! state.images[ action.query ] && action.image ) {
                state.images[ action.query ] = action.image;
            }
            return state;
        case 'GET_IMAGE_TAG_DATA':
            return action.images[ action.query ];
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getImageTagData( state, query ) {
            return state.images[ query ];
        },
    },
    resolvers: {
        * getImageTagData( state, query ) {
            const image = apiFetch( { path: query } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return actions.setImageTagData( query, fetchedData.response );
                    }
                    return false;
                } );
            yield image;
        },
    },
} );

/**
 * Select photo
 *
 * @param {array} media - media data.
 * @param {function} setAttributes - set attributes function.
 */
function onPhotoSelect( media, setAttributes ) {
    setAttributes( {
        photo: '',
        photoSizes: '',
    } );

    wp.media.attachment( media.id ).fetch().then( ( data ) => {
        if ( data && data.sizes ) {
            const url = ( data.sizes[ 'post-thumbnail' ] || data.sizes.medium || data.sizes.medium_large || data.sizes.full ).url;
            if ( url ) {
                setAttributes( {
                    photo: media.id,
                    photoSizes: data.sizes,
                } );
            }
        }
    } );
}

class TestimonialBlockEdit extends Component {
    constructor( props ) {
        super( props );
        this.onUpdate = this.onUpdate.bind( this );
    }
    componentDidMount() {
        this.onUpdate();
    }
    componentDidUpdate() {
        this.onUpdate();
    }
    onUpdate() {
        const {
            photoData,
            setAttributes,
            attributes,
        } = this.props;

        // set photo tag to attribute
        if ( attributes.photo && photoData ) {
            setAttributes( { photoTag: photoData } );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            icon,
            source,

            photo,
            photoTag,
            photoSizes,
            photoSize,
        } = attributes;

        className = classnames( 'ghostkit-testimonial', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-testimonial-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        const availableVariants = GHOSTKIT.getVariants( 'testimonial' );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }
                        <TextControl
                            label={ __( 'Icon' ) }
                            value={ icon }
                            help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        { photoSizes ? (
                            <SelectControl
                                label={ __( 'Photo Size' ) }
                                value={ photoSize }
                                options={ ( () => {
                                    const result = [];
                                    Object.keys( photoSizes ).forEach( ( k ) => {
                                        result.push( {
                                            value: k,
                                            label: toTitleCase( k ),
                                        } );
                                    } );
                                    return result;
                                } )() }
                                onChange={ v => setAttributes( { photoSize: v } ) }
                            />
                        ) : '' }
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { icon ? (
                        <div className="ghostkit-testimonial-icon">
                            <span className={ icon } />
                        </div>
                    ) : '' }
                    <div className="ghostkit-testimonial-content">
                        { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                        <InnerBlocks />
                    </div>
                    <div className="ghostkit-testimonial-photo">
                        { ! photo ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    onPhotoSelect( media, setAttributes );
                                } }
                                type="image"
                                value={ photo }
                                render={ ( { open } ) => (
                                    <Button onClick={ open }>
                                        <span className="dashicons dashicons-format-image" />
                                    </Button>
                                ) }
                            />
                        ) : '' }

                        { photo && photoTag ? (
                            <Fragment>
                                <MediaUpload
                                    onSelect={ ( media ) => {
                                        onPhotoSelect( media, setAttributes );
                                    } }
                                    type="image"
                                    value={ photo }
                                    render={ ( { open } ) => (
                                        <a
                                            href="#"
                                            onClick={ open }
                                            className="ghostkit-gutenberg-media-upload"
                                            style={ { display: 'block' } }
                                            dangerouslySetInnerHTML={ { __html: photoTag } }
                                        />
                                    ) }
                                />
                            </Fragment>
                        ) : '' }
                    </div>
                    <div className="ghostkit-testimonial-meta">
                        <div className="ghostkit-testimonial-name">
                            <RichText
                                tagName="div"
                                placeholder={ __( 'Write name…' ) }
                                value={ attributes.name }
                                onChange={ value => setAttributes( { name: value } ) }
                            />
                        </div>
                        <div className="ghostkit-testimonial-source">
                            <RichText
                                tagName="small"
                                placeholder={ __( 'Write source…' ) }
                                value={ source }
                                onChange={ value => setAttributes( { source: value } ) }
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

class TestimonialBlockSave extends Component {
    constructor() {
        super( ...arguments );

        // inside exported xml file almost all symbols are escaped.
        const posterTag = this.props.attributes.posterTag;
        if ( posterTag && /^u003c/g.test( posterTag ) ) {
            this.props.attributes.posterTag = posterTag
                .replace( /u003c/g, '<' )
                .replace( /u003e/g, '>' )
                .replace( /u0022/g, '"' )
                .replace( /u0026/g, '&' );
        }
    }

    render() {
        const {
            attributes,
        } = this.props;
        let {
            className,
        } = this.props;

        const {
            variant,
            photoTag,
            icon,
            source,
        } = attributes;

        className = classnames( 'ghostkit-testimonial', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-testimonial-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                { icon ? (
                    <div className="ghostkit-testimonial-icon">
                        <span className={ icon } />
                    </div>
                ) : '' }
                <div className="ghostkit-testimonial-content">
                    <InnerBlocks.Content />
                </div>
                { photoTag ? (
                    <div className="ghostkit-testimonial-photo"
                        dangerouslySetInnerHTML={ {
                            __html: photoTag,
                        } }
                    />
                ) : '' }
                { ( attributes.name && attributes.name.length > 0 ) || ( source && source.length > 0 ) ? (
                    <div className="ghostkit-testimonial-meta">
                        { ! RichText.isEmpty( attributes.name ) ? (
                            <RichText.Content
                                tagName="div"
                                className="ghostkit-testimonial-name"
                                value={ attributes.name }
                            />
                        ) : '' }
                        { ! RichText.isEmpty( source ) ? (
                            <RichText.Content
                                tagName="small"
                                className="ghostkit-testimonial-source"
                                value={ source }
                            />
                        ) : '' }
                    </div>
                ) : '' }
            </div>
        );
    }
}

export const name = 'ghostkit/testimonial';

export const settings = {
    title: __( 'Testimonial' ),
    description: __( 'Testimonial block.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'testimonial' ),
        __( 'quote' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        icon: {
            type: 'string',
            default: 'fas fa-quote-left',
        },
        photo: {
            type: 'string',
            default: '',
        },
        photoTag: {
            type: 'string',
            default: '',
        },
        photoSizes: {
            type: 'object',
            default: '',
        },
        photoSize: {
            type: 'string',
            default: 'thumbnail',
        },
        name: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-testimonial-name',
            default: [
                {
                    props: {
                        children: [ 'Katrina Craft' ],
                    },
                    type: 'strong',
                },
            ],
        },
        source: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-testimonial-source',
            default: 'Designer',
        },
    },

    edit: withSelect( ( select, props ) => {
        const { photo } = props.attributes;

        if ( ! photo ) {
            return false;
        }

        const query = `size=${ encodeURIComponent( props.attributes.photoSize ) }`;

        return {
            photoData: select( 'ghostkit/testimonial' ).getImageTagData( `/ghostkit/v1/get_attachment_image/${ photo }?${ query }` ),
        };
    } )( TestimonialBlockEdit ),

    save: TestimonialBlockSave,
};
