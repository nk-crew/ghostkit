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

const { Component } = wp.element;

const {
    RichText,
    InnerBlocks,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            tabActive,
            buttonsVerticalAlign,
            buttonsAlign,
            tabsData = [],
        } = this.props.attributes;

        let className = classnames(
            'ghostkit-tabs',
            buttonsVerticalAlign ? 'ghostkit-tabs-buttons-vertical' : ''
        );

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        return (
            <div className={ className } data-tab-active={ tabActive }>
                <div className={ classnames(
                    'ghostkit-tabs-buttons',
                    `ghostkit-tabs-buttons-align-${ buttonsAlign }`
                ) }>
                    {
                        tabsData.map( ( tabData ) => {
                            return (
                                <RichText.Content
                                    tagName="a"
                                    href={ `#${ tabData.slug }` }
                                    className="ghostkit-tabs-buttons-item"
                                    key={ `tab_button_${ tabData.slug }` }
                                    value={ tabData.title }
                                />
                            );
                        } )
                    }
                </div>
                <div className="ghostkit-tabs-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    }
}

export default BlockSave;
