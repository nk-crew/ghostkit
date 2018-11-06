// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import deprecatedArray from './deprecated.jsx';

// Internal Dependencies.
import elementIcon from '../_icons/alert.svg';

const { GHOSTKIT } = window;

import ColorPicker from '../_components/color-picker.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    RangeControl,
    TextControl,
    ToggleControl,
    Toolbar,
    DropdownMenu,
    TabPanel,
    ColorIndicator,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
} = wp.editor;

class AlertBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            color,
            hoverColor,
            icon,
            iconSize,
            hideButton,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'alert' );

        className = classnames( 'ghostkit-alert', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-alert-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <Toolbar>
                        <DropdownMenu
                            icon="info"
                            label={ __( 'Type' ) }
                            controls={ [
                                {
                                    title: __( 'Primary' ),
                                    icon: 'editor-help',
                                    onClick: () => setAttributes( { color: '#2E77C3' } ),
                                },
                                {
                                    title: __( 'Success' ),
                                    icon: 'marker',
                                    onClick: () => setAttributes( { color: '#22CF6E' } ),
                                },
                                {
                                    title: __( 'Danger' ),
                                    icon: 'dismiss',
                                    onClick: () => setAttributes( { color: '#DC3232' } ),
                                },
                                {
                                    title: __( 'Warning' ),
                                    icon: 'warning',
                                    onClick: () => setAttributes( { color: '#E47F3B' } ),
                                },
                                {
                                    title: __( 'Info' ),
                                    icon: 'info',
                                    onClick: () => setAttributes( { color: '#2DC7E8' } ),
                                },
                            ] }
                        />
                    </Toolbar>
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }
                        <TextControl
                            label={ __( 'Icon' ) }
                            value={ icon }
                            help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Icon Size' ) }
                            value={ iconSize }
                            onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                            min={ 20 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <ToggleControl
                            label={ __( 'Dismiss button' ) }
                            checked={ !! hideButton }
                            onChange={ ( val ) => setAttributes( { hideButton: val } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ color } />
                        </Fragment>
                    ) } initialOpen={ false }>
                        <TabPanel
                            className="ghostkit-control-tabs"
                            tabs={ [
                                {
                                    name: 'normal',
                                    title: __( 'Normal' ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'hover',
                                    title: __( 'Hover' ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                            ] }>
                            {
                                ( tabData ) => {
                                    const isHover = tabData.name === 'hover';
                                    return (
                                        <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                            <ColorPicker
                                                label={ __( 'Color' ) }
                                                value={ isHover ? hoverColor : color }
                                                onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                alpha={ true }
                                            />
                                        </ApplyFilters>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { icon ? (
                        <div className="ghostkit-alert-icon" dangerouslySetInnerHTML={ { __html: `<span class="${ icon }"></span>` } } />
                    ) : '' }
                    <div className="ghostkit-alert-content">
                        <InnerBlocks
                            template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important message, that you cannot miss!' ) } ] ] }
                            templateLock={ false }
                        />
                    </div>
                    { hideButton ? (
                        <div className="ghostkit-alert-hide-button">
                            <span className="fas fa-times" />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/alert';

export const settings = {
    title: __( 'Alert' ),
    description: __( 'Alert.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'alert' ),
        __( 'notification' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitStylesCallback( attributes ) {
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
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        color: {
            type: 'string',
            default: '#E47F3B',
        },
        hoverColor: {
            type: 'string',
        },
        icon: {
            type: 'string',
            default: 'fas fa-exclamation-circle',
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

    edit: AlertBlock,

    save: function( props ) {
        const {
            icon,
            hideButton,
            variant,
        } = props.attributes;

        let {
            className,
        } = props.attributes;

        className = classnames( 'ghostkit-alert', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-alert-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
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

    deprecated: deprecatedArray,
};
