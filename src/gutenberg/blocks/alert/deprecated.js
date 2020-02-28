/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

export default [
    // v2.8.2
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    borderLeftColor: attributes.color,
                    '.ghostkit-alert-icon': {
                        fontSize: attributes.iconSize,
                        color: attributes.color,
                    },
                };

                if ( attributes.hoverColor ) {
                    styles[ '&:hover' ] = {
                        borderLeftColor: attributes.hoverColor,
                        '.ghostkit-alert-icon': {
                            color: attributes.hoverColor,
                        },
                    };
                }

                return styles;
            },
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        supports: metadata.supports,
        attributes: {
            ...metadata.attributes,
            icon: {
                type: 'string',
                default: 'fas fa-exclamation-circle',
            },
        },
        save: class BlockSave extends Component {
            render() {
                const {
                    icon,
                    hideButton,
                } = this.props.attributes;

                let className = 'ghostkit-alert';

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                return (
                    <div className={ className }>
                        { icon ? (
                            <IconPicker.Render
                                name={ icon }
                                tag="div"
                                className="ghostkit-alert-icon"
                            />
                        ) : '' }
                        <div className="ghostkit-alert-content">
                            <InnerBlocks.Content />
                        </div>
                        { hideButton ? (
                            <div className="ghostkit-alert-hide-button">
                                <span className="fas fa-times" />
                            </div>
                        ) : '' }
                    </div>
                );
            }
        },
    },

    // v1.0.0
    {
        ghostkit: {
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
            },
        },
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            color: {
                type: 'string',
                default: '#d94f4f',
            },
            icon: {
                type: 'string',
                default: 'fas fa-exclamation-triangle',
            },
            iconSize: {
                type: 'number',
                default: 30,
            },
            hideButton: {
                type: 'boolean',
                default: false,
            },
        },
        save: function( props ) {
            const {
                icon,
                hideButton,
            } = props.attributes;

            let {
                className,
            } = props;

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/alert',
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    { icon ? (
                        <div className="ghostkit-alert-icon">
                            <span className={ icon } />
                        </div>
                    ) : '' }
                    <div className="ghostkit-alert-content">
                        <InnerBlocks.Content />
                    </div>
                    { hideButton ? (
                        <div className="ghostkit-alert-hide-button">
                            <span className="fas fa-times" />
                        </div>
                    ) : '' }
                </div>
            );
        },
    },
];
