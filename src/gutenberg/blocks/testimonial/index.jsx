// Import CSS
import './editor.scss';

// External Dependencies.
if ( ! global._babelPolyfill ) {
    require( '@babel/polyfill' );
}
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';
import dashCaseToTitle from '../../utils/dash-case-to-title';
import fixXmlImportedContent from '../../utils/fix-xml-imported-content';

import IconPicker from '../../components/icon-picker';

import deprecatedArray from './deprecated';

import transforms from './transforms';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    Button,
} = wp.components;

const {
    withSelect,
} = wp.data;

const {
    InspectorControls,
    InnerBlocks,
    RichText,
    MediaUpload,
} = wp.editor;

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
    constructor() {
        super( ...arguments );
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
            icon,
            source,

            photo,
            photoTag,
            photoSizes,
            photoSize,
        } = attributes;

        className = classnames( 'ghostkit-testimonial', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon' ) }
                            value={ icon }
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
                                            label: dashCaseToTitle( k ),
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
                            <IconPicker.Dropdown
                                onChange={ ( value ) => setAttributes( { icon: value } ) }
                                value={ icon }
                                renderToggle={ ( { onToggle } ) => (
                                    <IconPicker.Preview
                                        onClick={ onToggle }
                                        name={ icon }
                                    />
                                ) }
                            />
                        </div>
                    ) : '' }
                    <div className="ghostkit-testimonial-content">
                        <InnerBlocks
                            template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important testimonial, so many delights here!' ) } ] ] }
                            templateLock={ false }
                        />
                    </div>
                    <div className="ghostkit-testimonial-photo">
                        { ! photo ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    onPhotoSelect( media, setAttributes );
                                } }
                                allowedTypes={ [ 'image' ] }
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
                                    allowedTypes={ [ 'image' ] }
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
                        <RichText
                            tagName="div"
                            className="ghostkit-testimonial-name"
                            placeholder={ __( 'Write name…' ) }
                            value={ attributes.name }
                            onChange={ value => setAttributes( { name: value } ) }
                        />
                        <RichText
                            tagName="div"
                            className="ghostkit-testimonial-source"
                            placeholder={ __( 'Write source…' ) }
                            value={ source }
                            onChange={ value => setAttributes( { source: value } ) }
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

class TestimonialBlockSave extends Component {
    constructor() {
        super( ...arguments );

        // fix xml imported string.
        this.props.attributes.posterTag = fixXmlImportedContent( this.props.attributes.posterTag );
    }

    render() {
        const {
            attributes,
        } = this.props;

        const {
            photoTag,
            icon,
            source,
        } = attributes;

        let className = 'ghostkit-testimonial';

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className }>
                { icon ? (
                    <div className="ghostkit-testimonial-icon">
                        <IconPicker.Render name={ icon } />
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
                { ! RichText.isEmpty( attributes.name ) || ! RichText.isEmpty( source ) ? (
                    <div className="ghostkit-testimonial-meta">
                        { ! RichText.isEmpty( attributes.name ) ? (
                            <div className="ghostkit-testimonial-name">
                                <RichText.Content value={ attributes.name } />
                            </div>
                        ) : '' }
                        { ! RichText.isEmpty( source ) ? (
                            <div className="ghostkit-testimonial-source">
                                <RichText.Content value={ source } />
                            </div>
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
    description: __( 'Show how your users love your products and what saying.' ),
    icon: getIcon( 'block-testimonial', true ),
    category: 'ghostkit',
    keywords: [
        __( 'testimonial' ),
        __( 'blockquote' ),
        __( 'quote' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/testimonial/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        icon: {
            type: 'string',
            default: 'fas fa-quote-left',
        },
        photo: {
            type: 'number',
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
            type: 'string',
            source: 'html',
            selector: '.ghostkit-testimonial-name',
            default: '<strong>Katrina Craft</strong>',
        },
        source: {
            type: 'string',
            source: 'html',
            selector: '.ghostkit-testimonial-source',
            default: 'Designer',
        },
    },

    edit: withSelect( ( select, props ) => {
        const { photo } = props.attributes;

        if ( ! photo ) {
            return false;
        }

        return {
            photoData: select( 'ghostkit/base/images' ).getImageTagData( {
                id: photo,
                size: props.attributes.photoSize,
            } ),
        };
    } )( TestimonialBlockEdit ),

    save: TestimonialBlockSave,

    deprecated: deprecatedArray,

    transforms,
};
