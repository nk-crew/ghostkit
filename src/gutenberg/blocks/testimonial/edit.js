/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import dashCaseToTitle from '../../utils/dash-case-to-title';
import IconPicker from '../../components/icon-picker';
import URLPicker from '../../components/url-picker';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';

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
    BaseControl,
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
            const { url } = data.sizes[ 'post-thumbnail' ] || data.sizes.medium || data.sizes.medium_large || data.sizes.full;
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
            setAttributes( { photoTag: maybeEncode( photoData ) } );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            hasChildBlocks,
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
                    <PanelBody title={ __( 'Photo', '@@text_domain' ) }>
                        { ! photo ? (
                            <MediaUpload
                                onSelect={ ( media ) => {
                                    onPhotoSelect( media, setAttributes );
                                } }
                                allowedTypes={ [ 'image' ] }
                                value={ photo }
                                render={ ( { open } ) => (
                                    <Button onClick={ open } isPrimary>
                                        { __( 'Select Image', '@@text_domain' ) }
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
                                        <BaseControl help={ __( 'Click the image to edit or update', '@@text_domain' ) }>
                                            { /* eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-is-valid */ }
                                            <a
                                                href="#"
                                                onClick={ open }
                                                className="ghostkit-gutenberg-media-upload"
                                                style={ { display: 'block' } }
                                                // eslint-disable-next-line react/no-danger
                                                dangerouslySetInnerHTML={ { __html: maybeDecode( photoTag ) } }
                                            />
                                        </BaseControl>
                                    ) }
                                />
                                <Button
                                    isLink
                                    onClick={ ( e ) => {
                                        setAttributes( {
                                            photo: '',
                                            photoTag: '',
                                            photoSizes: '',
                                        } );
                                        e.preventDefault();
                                    } }
                                    className="button button-secondary"
                                >
                                    { __( 'Remove Image', '@@text_domain' ) }
                                </Button>
                                <div style={ { marginBottom: 13 } } />
                                { photoSizes ? (
                                    <SelectControl
                                        label={ __( 'Size', '@@text_domain' ) }
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
                                        onChange={ ( v ) => setAttributes( { photoSize: v } ) }
                                    />
                                ) : '' }
                            </Fragment>
                        ) : '' }
                    </PanelBody>
                    <PanelBody title={ __( 'Stars', '@@text_domain' ) }>
                        <RangeControl
                            value={ stars }
                            min={ 0 }
                            max={ 5 }
                            step={ 0.5 }
                            beforeIcon="star-filled"
                            allowReset
                            onChange={ ( value ) => setAttributes( { stars: value } ) }
                        />
                        { 'number' === typeof stars ? (
                            <IconPicker
                                label={ __( 'Icon', '@@text_domain' ) }
                                value={ starsIcon }
                                onChange={ ( value ) => setAttributes( { starsIcon: value } ) }
                            />
                        ) : '' }
                    </PanelBody>
                </InspectorControls>
                <URLPicker
                    url={ url }
                    rel={ rel }
                    target={ target }
                    onChange={ ( data ) => {
                        setAttributes( data );
                    } }
                    isSelected={ isSelected }
                    toolbarSettings
                    inspectorSettings
                />
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
                            templateLock={ false }
                            renderAppender={ (
                                hasChildBlocks
                                    ? undefined
                                    : () => <InnerBlocks.ButtonBlockAppender />
                            ) }
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
                                        // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-is-valid
                                        <a
                                            href="#"
                                            onClick={ open }
                                            className="ghostkit-gutenberg-media-upload"
                                            style={ { display: 'block' } }
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={ { __html: maybeDecode( photoTag ) } }
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
                            onChange={ ( value ) => setAttributes( { name: value } ) }
                        />
                        <RichText
                            tagName="div"
                            className="ghostkit-testimonial-source"
                            placeholder={ __( 'Write source…', '@@text_domain' ) }
                            value={ source }
                            onChange={ ( value ) => setAttributes( { source: value } ) }
                        />
                    </div>
                    { 'number' === typeof stars && starsIcon ? (
                        <div className="ghostkit-testimonial-stars">
                            <div className="ghostkit-testimonial-stars-wrap">
                                <div className="ghostkit-testimonial-stars-front" style={ { width: `${ ( 100 * stars ) / 5 }%` } }>
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
    const { clientId } = props;
    const { photo } = props.attributes;
    const blockEditor = select( 'core/block-editor' );

    return {
        hasChildBlocks: blockEditor ? 0 < blockEditor.getBlockOrder( clientId ).length : false,
        photoData: photo ? select( 'ghostkit/base/images' ).getImageTagData( {
            id: photo,
            size: props.attributes.photoSize,
        } ) : false,
    };
} )( BlockEdit );
