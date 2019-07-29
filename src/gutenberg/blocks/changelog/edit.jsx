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
    InnerBlocks,
    RichText,
} = wp.editor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            version,
            date,
        } = attributes;

        className = classnames( 'ghostkit-changelog', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <div className={ className }>
                    <div className="ghostkit-changelog-version">
                        <RichText
                            tagName="span"
                            placeholder={ __( '1.0.0' ) }
                            value={ version }
                            onChange={ value => setAttributes( { version: value } ) }
                        />
                    </div>
                    <div className="ghostkit-changelog-date">
                        <RichText
                            tagName="h2"
                            placeholder={ __( '18 September 2018' ) }
                            value={ date }
                            onChange={ value => setAttributes( { date: value } ) }
                        />
                    </div>
                    <div className="ghostkit-changelog-more">
                        <InnerBlocks
                            allowedBlocks={ [ 'core/list', 'core/paragraph', 'ghostkit/alert' ] }
                            template={ [ [ 'core/list', {
                                values: [
                                    <li key="list-item-1">
                                        <span className="ghostkit-badge" style="background-color: #4ab866;">{ __( 'Added' ) }</span>
                                        { __( 'Something' ) }
                                    </li>,
                                    <li key="list-item-2">
                                        <span className="ghostkit-badge" style="background-color: #0366d6;">{ __( 'Fixed' ) }</span>
                                        { __( 'Something' ) }
                                    </li>,
                                    <li key="list-item-3">
                                        <span className="ghostkit-badge" style="background-color: #0366d6;">{ __( 'Improved' ) }</span>
                                        { __( 'Something' ) }
                                    </li>,
                                ],
                            } ] ] }
                            templateLock={ false }
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
