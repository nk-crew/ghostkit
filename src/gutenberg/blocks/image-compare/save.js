/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    Component,
} = wp.element;

const { RichText } = wp.blockEditor;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            caption,
            beforeId,
            beforeUrl,
            beforeAlt,
            beforeWidth,
            beforeHeight,
            afterId,
            afterUrl,
            afterAlt,
            afterWidth,
            afterHeight,
        } = this.props.attributes;

        if ( ! beforeUrl || ! afterUrl ) {
            return null;
        }

        let {
            className,
        } = this.props.attributes;

        className = classnames(
            'ghostkit-image-compare',
            className
        );

        return (
            <figure className={ className }>
                <div className="ghostkit-image-compare-images">
                    <div className="ghostkit-image-compare-image-before">
                        <img
                            src={ beforeUrl }
                            alt={ beforeAlt }
                            className={ beforeId ? `wp-image-${ beforeId }` : null }
                            width={ beforeWidth }
                            height={ beforeHeight }
                        />
                    </div>
                    <div className="ghostkit-image-compare-image-after">
                        <img
                            src={ afterUrl }
                            alt={ afterAlt }
                            className={ afterId ? `wp-image-${ afterId }` : null }
                            width={ afterWidth }
                            height={ afterHeight }
                        />
                    </div>
                    <div className="ghostkit-image-compare-images-divider">
                        <div className="ghostkit-image-compare-images-divider-button-arrow-left">
                            <svg className="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7803 17.7803C14.4874 18.0732 14.0126 18.0732 13.7197 17.7803L8.4697 12.5303C8.1768 12.2374 8.1768 11.7626 8.4697 11.4697L13.7197 6.21967C14.0126 5.92678 14.4874 5.92678 14.7803 6.21967C15.0732 6.51256 15.0732 6.98744 14.7803 7.28033L10.0607 12L14.7803 16.7197C15.0732 17.0126 15.0732 17.4874 14.7803 17.7803Z" fill="currentColor" /></svg>
                        </div>
                        <div className="ghostkit-image-compare-images-divider-button-arrow-right">
                            <svg className="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z" fill="currentColor" /></svg>
                        </div>
                    </div>
                </div>
                { ! RichText.isEmpty( caption ) ? (
                    <RichText.Content className="ghostkit-image-compare-caption" tagName="figcaption" value={ caption } />
                ) : '' }
            </figure>
        );
    }
}

export default BlockSave;
