/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    Component,
    Fragment,
} = wp.element;

const {
    withSelect,
} = wp.data;

const {
    PanelBody,
    Placeholder,
    RangeControl,
    SelectControl,
    TextareaControl,
    ExternalLink,
} = wp.components;

const {
    InspectorControls,
    RichText,
    MediaPlaceholder,
} = wp.blockEditor;

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const DEFAULT_SIZE_SLUG = 'large';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            captionFocus: false,
        };

        this.onUploadError = this.onUploadError.bind( this );
        this.getImgTag = this.getImgTag.bind( this );
        this.updateImageData = this.updateImageData.bind( this );
    }

    onUploadError( message ) {
        const { noticeOperations } = this.props;
        noticeOperations.removeAllNotices();
        noticeOperations.createErrorNotice( message );
    }

    getImgTag( type = 'before' ) {
        const {
            attributes,
        } = this.props;

        return attributes[ `${ type }Url` ] ? (
            <div className={ `ghostkit-image-compare-image-${ type }` }>
                <img
                    src={ attributes[ `${ type }Url` ] }
                    alt={ attributes[ `${ type }Alt` ] }
                    className={ attributes[ `${ type }Id` ] ? `wp-image-${ attributes[ `${ type }Id` ] }` : null }
                    width={ attributes[ `${ type }Width` ] }
                    height={ attributes[ `${ type }Height` ] }
                />
            </div>
        ) : false;
    }

    updateImageData( type = 'before', imageData, imageSize = false ) {
        const {
            attributes,
            setAttributes,
        } = this.props;

        imageSize = imageSize || attributes[ `${ type }SizeSlug` ] || DEFAULT_SIZE_SLUG;

        // Prepare full image data.
        const result = {
            [ `${ type }SizeSlug` ]: imageSize,
            [ `${ type }Id` ]: imageData.id,
            [ `${ type }Url` ]: imageData.url || imageData.source_url,
            [ `${ type }Alt` ]: imageData.alt || imageData.alt_text,
            [ `${ type }Width` ]: imageData.width || ( imageData.media_details && imageData.media_details.width ? imageData.media_details.width : undefined ),
            [ `${ type }Height` ]: imageData.height || ( imageData.media_details && imageData.media_details.height ? imageData.media_details.height : undefined ),
        };

        let sizes = imageData.sizes && imageData.sizes[ imageSize ];

        if ( ! sizes && imageData.media_details && imageData.media_details.sizes && imageData.media_details.sizes[ imageSize ] ) {
            sizes = imageData.media_details.sizes[ imageSize ];
        }

        // Prepare image data for selected size.
        if ( sizes ) {
            if ( sizes.url ) {
                result[ `${ type }Url` ] = sizes.url;
            }
            if ( sizes.source_url ) {
                result[ `${ type }Url` ] = sizes.source_url;
            }
            if ( sizes.width ) {
                result[ `${ type }Width` ] = sizes.width;
            }
            if ( sizes.height ) {
                result[ `${ type }Height` ] = sizes.height;
            }
        }

        setAttributes( result );
    }

    render() {
        const {
            attributes,
            isSelected,
            setAttributes,
            editorSettings,
            beforeImage,
            afterImage,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            caption,
            position,
            beforeUrl,
            beforeAlt,
            beforeSizeSlug,
            afterUrl,
            afterAlt,
            afterSizeSlug,
        } = attributes;

        const {
            captionFocus,
        } = this.state;

        className = classnames(
            'ghostkit-image-compare',
            className
        );

        return (
            <Fragment>
                <InspectorControls>
                    { beforeUrl && afterUrl ? (
                        <PanelBody title={ __( 'Divider', '@@text_domain' ) }>
                            <RangeControl
                                label={ __( 'Start Position', '@@text_domain' ) }
                                value={ position }
                                min={ 0 }
                                max={ 100 }
                                onChange={ ( val ) => setAttributes( { position: val } ) }
                            />
                        </PanelBody>
                    ) : null }
                    { beforeUrl ? (
                        <PanelBody title={ __( 'Before Image Settings', '@@text_domain' ) }>
                            <TextareaControl
                                label={ __( 'Alt text (alternative text)' ) }
                                value={ beforeAlt }
                                onChange={ ( val ) => setAttributes( { beforeAlt: val } ) }
                                help={ (
                                    <Fragment>
                                        <ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
                                            { __( 'Describe the purpose of the image', '@@text_domain' ) }
                                        </ExternalLink>
                                        { __( 'Leave empty if the image is purely decorative.', '@@text_domain' ) }
                                    </Fragment>
                                ) }
                            />
                            { editorSettings && editorSettings.imageSizes ? (
                                <SelectControl
                                    label={ __( 'Image Size', '@@text_domain' ) }
                                    value={ beforeSizeSlug || DEFAULT_SIZE_SLUG }
                                    onChange={ ( val ) => {
                                        this.updateImageData( 'before', beforeImage, val );
                                    } }
                                    options={ editorSettings.imageSizes.map( ( imgSize ) => ( {
                                        value: imgSize.slug,
                                        label: imgSize.name,
                                    } ) ) }
                                />
                            ) : null }
                        </PanelBody>
                    ) : null }
                    { afterUrl ? (
                        <PanelBody title={ __( 'After Image Settings', '@@text_domain' ) }>
                            <TextareaControl
                                label={ __( 'Alt text (alternative text)' ) }
                                value={ afterAlt }
                                onChange={ ( val ) => setAttributes( { afterAlt: val } ) }
                                help={ (
                                    <Fragment>
                                        <ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
                                            { __( 'Describe the purpose of the image', '@@text_domain' ) }
                                        </ExternalLink>
                                        { __( 'Leave empty if the image is purely decorative.', '@@text_domain' ) }
                                    </Fragment>
                                ) }
                            />
                            { editorSettings && editorSettings.imageSizes ? (
                                <SelectControl
                                    label={ __( 'Image Size', '@@text_domain' ) }
                                    value={ afterSizeSlug || DEFAULT_SIZE_SLUG }
                                    onChange={ ( val ) => {
                                        this.updateImageData( 'after', afterImage, val );
                                    } }
                                    options={ editorSettings.imageSizes.map( ( imgSize ) => ( {
                                        value: imgSize.slug,
                                        label: imgSize.name,
                                    } ) ) }
                                />
                            ) : null }
                        </PanelBody>
                    ) : null }
                </InspectorControls>
                { ! beforeUrl || ! afterUrl ? (
                    <Placeholder
                        className="ghostkit-image-compare-placeholder"
                        icon={ getIcon( 'block-image-compare' ) }
                        label={ __( 'Image Compare', '@@text_domain' ) }
                        instructions={ __( 'Select images to compare', '@@text_domain' ) }
                    >
                        { this.getImgTag( 'before' ) ? (
                            <div className="components-placeholder">
                                { this.getImgTag( 'before' ) }
                            </div>
                        ) : (
                            <MediaPlaceholder
                                icon="format-image"
                                labels={ {
                                    title: __( 'Image Before', '@@text_domain' ),
                                    name: __( 'image', '@@text_domain' ),
                                } }
                                onSelect={ ( image ) => {
                                    this.updateImageData( 'before', image );
                                } }
                                accept="image/*"
                                allowedTypes={ ALLOWED_MEDIA_TYPES }
                                disableMaxUploadErrorMessages
                                onError={ this.onUploadError }
                            />
                        ) }
                        { this.getImgTag( 'after' ) ? (
                            <div className="components-placeholder">
                                { this.getImgTag( 'after' ) }
                            </div>
                        ) : (
                            <MediaPlaceholder
                                icon="format-image"
                                labels={ {
                                    title: __( 'Image After', '@@text_domain' ),
                                    name: __( 'image', '@@text_domain' ),
                                } }
                                value={ afterUrl ? {
                                    src: afterUrl,
                                } : false }
                                onSelect={ ( image ) => {
                                    this.updateImageData( 'after', image );
                                } }
                                accept="image/*"
                                allowedTypes={ ALLOWED_MEDIA_TYPES }
                                disableMaxUploadErrorMessages
                                onError={ this.onUploadError }
                            />
                        ) }
                    </Placeholder>
                ) : (
                    <figure className={ className }>
                        <div className="ghostkit-image-compare-images">
                            { this.getImgTag( 'before' ) }
                            { this.getImgTag( 'after' ) }
                            <div className="ghostkit-image-compare-images-divider">
                                <div className="ghostkit-image-compare-images-divider-button-arrow-left">
                                    { getIcon( 'icon-angle-left' ) }
                                </div>
                                <div className="ghostkit-image-compare-images-divider-button-arrow-right">
                                    { getIcon( 'icon-angle-right' ) }
                                </div>
                            </div>
                        </div>
                        { ( ! RichText.isEmpty( caption ) || isSelected ) && (
                            <RichText
                                className="ghostkit-image-compare-caption"
                                inlineToolbar
                                isSelected={ captionFocus }
                                unstableOnFocus={ () => {
                                    this.setState( { captionFocus: true } );
                                } }
                                onChange={ ( value ) => setAttributes( { caption: value } ) }
                                placeholder={ __( 'Write caption…', 'jetpack' ) }
                                tagName="figcaption"
                                value={ caption }
                            />
                        ) }
                    </figure>
                ) }
            </Fragment>
        );
    }
}

export default withSelect( ( select, { attributes, isSelected } ) => {
    const { getSettings } = select( 'core/block-editor' );
    const { getMedia } = select( 'core' );

    return {
        editorSettings: getSettings(),
        beforeImage: attributes.beforeId && isSelected ? getMedia( attributes.beforeId ) : null,
        afterImage: attributes.afterId && isSelected ? getMedia( attributes.afterId ) : null,
    };
} )( BlockEdit );
