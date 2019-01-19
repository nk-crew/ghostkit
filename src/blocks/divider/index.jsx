// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import deepAssign from 'deep-assign';

// Internal Dependencies.
import elementIcon from '../_icons/block-divider.svg';

const { GHOSTKIT } = window;

import ColorPicker from '../_components/color-picker.jsx';
import IconPicker from '../_components/icon-picker.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
    Toolbar,
    DropdownMenu,
    ColorIndicator,
    TabPanel,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
} = wp.editor;

class DividerBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            type,
            size,
            icon,
            iconSize,
            color,
            iconColor,
            hoverColor,
            hoverIconColor,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'divider' );

        className = classnames( 'ghostkit-divider', `ghostkit-divider-type-${ type }`, className );

        if ( icon ) {
            className = classnames( className, 'ghostkit-divider-with-icon' );
        }

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-divider-variant-${ variant }` );
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
                            icon="minus"
                            label={ __( 'Type' ) }
                            controls={ [
                                {
                                    title: __( 'Line' ),
                                    onClick: () => setAttributes( { type: 'solid' } ),
                                },
                                {
                                    title: __( 'Dashed' ),
                                    onClick: () => setAttributes( { type: 'dashed' } ),
                                },
                                {
                                    title: __( 'Dotted' ),
                                    onClick: () => setAttributes( { type: 'dotted' } ),
                                },
                                {
                                    title: __( 'Double' ),
                                    onClick: () => setAttributes( { type: 'double' } ),
                                },
                            ] }
                        />
                    </Toolbar>
                </BlockControls>
                <InspectorControls>
                    { Object.keys( availableVariants ).length > 1 ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    ) : '' }
                    <PanelBody>
                        <SelectControl
                            label={ __( 'Type' ) }
                            value={ type }
                            options={ [
                                {
                                    value: 'solid',
                                    label: __( 'Line' ),
                                }, {
                                    value: 'dashed',
                                    label: __( 'Dashed' ),
                                }, {
                                    value: 'dotted',
                                    label: __( 'Dotted' ),
                                }, {
                                    value: 'double',
                                    label: __( 'Double' ),
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { type: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Size' ) }
                            value={ size }
                            onChange={ ( value ) => setAttributes( { size: value } ) }
                            min={ 1 }
                            max={ 7 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                    </PanelBody>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        { icon ? (
                            <RangeControl
                                label={ __( 'Icon Size' ) }
                                value={ iconSize }
                                onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                                min={ 10 }
                                max={ 100 }
                                beforeIcon="editor-textcolor"
                                afterIcon="editor-textcolor"
                            />
                        ) : '' }
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ color } />
                            { icon ? (
                                <ColorIndicator colorValue={ iconColor } />
                            ) : '' }
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
                                        <Fragment>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Divider' ) }
                                                    value={ isHover ? hoverColor : color }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            { icon ? (
                                                <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverIconColor' : 'iconColor' } props={ this.props }>
                                                    <ColorPicker
                                                        label={ __( 'Icon' ) }
                                                        value={ isHover ? hoverIconColor : iconColor }
                                                        onChange={ ( val ) => setAttributes( isHover ? { hoverIconColor: val } : { iconColor: val } ) }
                                                        alpha={ true }
                                                    />
                                                </ApplyFilters>
                                            ) : '' }
                                        </Fragment>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { icon ? (
                        <div className="ghostkit-divider-icon">
                            <IconPicker.Preview name={ icon } />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/divider';

export const settings = {
    title: __( 'Divider' ),
    description: __( 'Divide your long texts and blocks.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'divider' ),
        __( 'spacer' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/divider/',
        customStylesCallback( attributes ) {
            const styles = {
                '&::before, &::after': {
                    borderColor: attributes.color,
                    borderWidth: attributes.size,
                },
                '.ghostkit-divider-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.iconColor,
                },
            };

            if ( attributes.hoverColor ) {
                styles[ '&:hover' ] = {
                    '&::before, &::after': {
                        borderColor: attributes.hoverColor,
                    },
                };
            }
            if ( attributes.hoverIconColor ) {
                styles[ '&:hover' ] = deepAssign( styles[ '&:hover' ] || {}, {
                    '.ghostkit-divider-icon': {
                        color: attributes.hoverIconColor,
                    },
                } );
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
        variant: {
            type: 'string',
            default: 'default',
        },
        type: {
            type: 'string',
            default: 'solid',
        },
        size: {
            type: 'number',
            default: 2,
        },
        icon: {
            type: 'string',
            default: '',
        },
        iconSize: {
            type: 'number',
            default: 10,
        },
        color: {
            type: 'string',
            default: '#a7a9ab',
        },
        iconColor: {
            type: 'string',
            default: '#a7a9ab',
        },
        hoverColor: {
            type: 'string',
        },
        hoverIconColor: {
            type: 'string',
        },
    },

    edit: DividerBlock,

    save: function( props ) {
        const {
            icon,
            type,
            variant,
        } = props.attributes;

        let className = `ghostkit-divider ghostkit-divider-type-${ type }`;

        if ( icon ) {
            className = classnames( className, 'ghostkit-divider-with-icon' );
        }

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-divider-variant-${ variant }` );
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
                    <div className="ghostkit-divider-icon">
                        <IconPicker.Render name={ icon } />
                    </div>
                ) : '' }
            </div>
        );
    },
};
