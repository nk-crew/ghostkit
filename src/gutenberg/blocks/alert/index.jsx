// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import deprecatedArray from './deprecated';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';

import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ApplyFilters from '../../components/apply-filters';

import transforms from './transforms';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
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
            color,
            hoverColor,
            icon,
            iconSize,
            hideButton,
        } = attributes;

        className = classnames( 'ghostkit-alert', className );

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
                        <IconPicker
                            label={ __( 'Icon' ) }
                            value={ icon }
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
                    </PanelBody>
                    <PanelBody>
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
                        <div className="ghostkit-alert-icon">
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
    description: __( 'Provide contextual feedback messages for user actions.' ),
    icon: getIcon( 'block-alert', true ),
    category: 'ghostkit',
    keywords: [
        __( 'alert' ),
        __( 'notification' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/alert/',
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
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
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
        } = props.attributes;

        let className = 'ghostkit-alert';

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
                        <IconPicker.Render name={ icon } />
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

    transforms,
};
