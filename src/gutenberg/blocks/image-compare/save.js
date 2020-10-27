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
            beforeUrl,
            beforeAlt,
            beforeWidth,
            beforeHeight,
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
                            width={ beforeWidth }
                            height={ beforeHeight }
                        />
                    </div>
                    <div className="ghostkit-image-compare-image-after">
                        <img
                            src={ afterUrl }
                            alt={ afterAlt }
                            width={ afterWidth }
                            height={ afterHeight }
                        />
                    </div>
                    <div className="ghostkit-image-compare-images-divider">
                        <div className="ghostkit-image-compare-images-divider-button-arrow-left">
                            { getIcon( 'icon-angle-left' ) }
                        </div>
                        <div className="ghostkit-image-compare-images-divider-button-arrow-right">
                            { getIcon( 'icon-angle-right' ) }
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
