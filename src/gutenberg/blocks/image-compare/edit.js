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
    PanelBody,
    Placeholder,
    RangeControl,
    TextareaControl,
    ExternalLink,
} = wp.components;

const {
    InspectorControls,
    RichText,
    MediaPlaceholder,
} = wp.blockEditor;

const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * Block Edit Class.
 */
export default class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            captionFocus: false,
        };

        this.onUploadError = this.onUploadError.bind( this );
        this.getImgTag = this.getImgTag.bind( this );
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
                    width={ attributes[ `${ type }Width` ] }
                    height={ attributes[ `${ type }Height` ] }
                />
            </div>
        ) : false;
    }

    render() {
        const {
            attributes,
            isSelected,
            setAttributes,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            caption,
            position,
            beforeUrl,
            beforeAlt,
            afterUrl,
            afterAlt,
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
                    { beforeUrl || afterUrl ? (
                        <PanelBody title={ __( 'Image settings', '@@text_domain' ) }>
                            { beforeUrl ? (
                                <TextareaControl
                                    label={ __( 'Before image Alt text (alternative text)' ) }
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
                            ) : null }
                            { afterUrl ? (
                                <TextareaControl
                                    label={ __( 'After image Alt text (alternative text)' ) }
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
                                    setAttributes( {
                                        beforeUrl: image.url,
                                        beforeAlt: image.alt,
                                        beforeWidth: image.width,
                                        beforeHeight: image.height,
                                    } );
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
                                    setAttributes( {
                                        afterUrl: image.url,
                                        afterAlt: image.alt,
                                        afterWidth: image.width,
                                        afterHeight: image.height,
                                    } );
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
