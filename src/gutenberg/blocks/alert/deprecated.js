/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

import save from './save';
import metadata from './block.json';

const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.blockEditor;

const { name } = metadata;

export default [
    // v2.15.0
    {
        ...metadata,
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
                                <svg className="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L12 10.9393L16.7197 6.21967C17.0126 5.92678 17.4874 5.92678 17.7803 6.21967C18.0732 6.51256 18.0732 6.98744 17.7803 7.28033L13.0607 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4874 18.0732 17.0126 18.0732 16.7197 17.7803L12 13.0607L7.28033 17.7803C6.98744 18.0732 6.51256 18.0732 6.21967 17.7803C5.92678 17.4874 5.92678 17.0126 6.21967 16.7197L10.9393 12L6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967Z" fill="currentColor" /></svg>
                            </div>
                        ) : '' }
                    </div>
                );
            }
        },
    },

    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '--gkt-alert__border-color': attributes.color,
                    '--gkt-alert--icon__font-size': `${ attributes.iconSize }px`,
                    '--gkt-alert--icon__color': attributes.color,
                };

                if ( attributes.hoverColor ) {
                    styles[ '&:hover' ] = {
                        '--gkt-alert__border-color': attributes.hoverColor,
                        '--gkt-alert--icon__color': attributes.hoverColor,
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
        attributes: {
            color: {
                type: 'string',
                default: '#E47F3B',
            },
            hoverColor: {
                type: 'string',
            },
            icon: {
                type: 'string',
                default: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.8681 4.0311C12.7806 3.87815 12.6542 3.75104 12.5018 3.66263C12.3494 3.57422 12.1763 3.52766 12.0001 3.52766C11.8239 3.52766 11.6508 3.57422 11.4984 3.66263C11.346 3.75104 11.2196 3.87815 11.1321 4.0311L3.14706 18.0041C3.06016 18.1562 3.01475 18.3285 3.01539 18.5037C3.01602 18.6789 3.06268 18.8509 3.15068 19.0024C3.23868 19.1539 3.36494 19.2796 3.51682 19.367C3.66869 19.4543 3.84085 19.5002 4.01606 19.5001H19.9841C20.1593 19.5002 20.3315 19.4543 20.4833 19.367C20.6352 19.2796 20.7615 19.1539 20.8495 19.0024C20.9375 18.8509 20.9841 18.6789 20.9848 18.5037C20.9854 18.3285 20.94 18.1562 20.8531 18.0041L12.8681 4.0301V4.0311ZM9.83006 3.2871C10.7901 1.6071 13.2121 1.6071 14.1721 3.2871L22.1561 17.2601C23.1081 18.9261 21.9051 21.0001 19.9861 21.0001H4.01406C2.09506 21.0001 0.892055 18.9261 1.84406 17.2601L9.82906 3.2871H9.83006ZM12.0001 7.9631C12.199 7.9631 12.3898 8.04212 12.5304 8.18277C12.6711 8.32342 12.7501 8.51419 12.7501 8.7131V12.2501C12.7501 12.449 12.6711 12.6398 12.5304 12.7804C12.3898 12.9211 12.199 13.0001 12.0001 13.0001C11.8012 13.0001 11.6104 12.9211 11.4698 12.7804C11.3291 12.6398 11.2501 12.449 11.2501 12.2501V8.7131C11.2501 8.51419 11.3291 8.32342 11.4698 8.18277C11.6104 8.04212 11.8012 7.9631 12.0001 7.9631ZM12.0001 15.0001C11.7349 15.0001 11.4805 15.1055 11.293 15.293C11.1055 15.4805 11.0001 15.7349 11.0001 16.0001C11.0001 16.2653 11.1055 16.5197 11.293 16.7072C11.4805 16.8948 11.7349 17.0001 12.0001 17.0001C12.2653 17.0001 12.5197 16.8948 12.7072 16.7072C12.8947 16.5197 13.0001 16.2653 13.0001 16.0001C13.0001 15.7349 12.8947 15.4805 12.7072 15.293C12.5197 15.1055 12.2653 15.0001 12.0001 15.0001Z" fill="currentColor"/></svg>',
            },
            iconSize: {
                type: 'number',
                default: 17,
            },
            hideButton: {
                type: 'boolean',
                default: false,
            },
        },
        save,
    },

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
];
