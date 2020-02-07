/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    SelectControl,
    RangeControl,
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
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import dashCaseToTitle from '../../utils/dash-case-to-title';

import IconPicker from '../../components/icon-picker';
import URLInput from '../../components/url-input';

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

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
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

            stars,
            starsIcon,

            url,
            target,
            rel,
        } = attributes;

        className = classnames( 'ghostkit-testimonial', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon', '@@text_domain' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                    </PanelBody>
                    { photoSizes ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Photo Size', '@@text_domain' ) }
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
                        </PanelBody>
                    ) : '' }
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Stars', '@@text_domain' ) }
                            value={ stars }
                            min={ 0 }
                            max={ 5 }
                            step={ 0.5 }
                            beforeIcon="star-filled"
                            allowReset={ true }
                            onChange={ ( value ) => setAttributes( { stars: value } ) }
                        />
                        { typeof stars === 'number' ? (
                            <IconPicker
                                label={ __( 'Stars Icon', '@@text_domain' ) }
                                value={ starsIcon }
                                onChange={ ( value ) => setAttributes( { starsIcon: value } ) }
                            />
                        ) : '' }
                    </PanelBody>
                    <PanelBody title={ __( 'URL', '@@text_domain' ) } initialOpen={ false }>
                        <URLInput
                            url={ url }
                            target={ target }
                            rel={ rel }
                            onChange={ ( data ) => {
                                setAttributes( data );
                            } }
                            autoFocus={ false }
                            float={ false }
                            alwaysShowOptions
                        />
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
                            template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important testimonial, so many delights here!', '@@text_domain' ) } ] ] }
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
                            placeholder={ __( 'Write name…', '@@text_domain' ) }
                            value={ attributes.name }
                            onChange={ value => setAttributes( { name: value } ) }
                        />
                        <RichText
                            tagName="div"
                            className="ghostkit-testimonial-source"
                            placeholder={ __( 'Write source…', '@@text_domain' ) }
                            value={ source }
                            onChange={ value => setAttributes( { source: value } ) }
                        />
                    </div>
                    { typeof stars === 'number' && starsIcon ? (
                        <div className="ghostkit-testimonial-stars">
                            <div className="ghostkit-testimonial-stars-wrap">
                                <div className="ghostkit-testimonial-stars-front" style={ { width: `${ 100 * stars / 5 }%` } }>
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                </div>
                                <div className="ghostkit-testimonial-stars-back">
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                    <IconPicker.Preview name={ starsIcon } />
                                </div>
                            </div>
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default withSelect( ( select, props ) => {
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
} )( BlockEdit );
