// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';
import deprecatedArray from './deprecated-button.jsx';

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
    SelectControl,
    Dashicon,
    IconButton,
    PanelBody,
    RangeControl,
    Button,
    ButtonGroup,
    TabPanel,
    ColorIndicator,
} = wp.components;

const {
    InspectorControls,
    RichText,
    URLInput,
} = wp.editor;

class ButtonSingleBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            text,
            icon,
            iconPosition,
            url,
            size,
            color,
            textColor,
            borderRadius,
            borderWeight,
            borderColor,
            focusOutlineWeight,
            focusOutlineColor,
            hoverColor,
            hoverTextColor,
            hoverBorderColor,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'button' );

        const sizes = {
            XS: 'xs',
            S: 'sm',
            M: 'md',
            L: 'lg',
            XL: 'xl',
        };

        className = classnames(
            'ghostkit-button',
            size ? `ghostkit-button-${ size }` : '',
            className
        );

        // focus outline
        if ( focusOutlineWeight && focusOutlineColor ) {
            className = classnames( className, 'ghostkit-button-with-outline' );
        }

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-button-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const colorsTabs = [
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
        ];

        if ( focusOutlineWeight && focusOutlineColor ) {
            colorsTabs.push( {
                name: 'focus',
                title: __( 'Focus' ),
                className: 'ghostkit-control-tabs-tab',
            } );
        }

        return (
            <Fragment>
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
                        <div className="blocks-size__main">
                            <ButtonGroup aria-label={ __( 'Size' ) }>
                                {
                                    Object.keys( sizes ).map( ( key ) =>
                                        <Button
                                            key={ key }
                                            isLarge
                                            isPrimary={ size === sizes[ key ] }
                                            aria-pressed={ size === sizes[ key ] }
                                            onClick={ () => setAttributes( { size: sizes[ key ] } ) }
                                        >
                                            { key }
                                        </Button>
                                    )
                                }
                            </ButtonGroup>
                            <Button
                                isLarge
                                onClick={ () => setAttributes( { size: 'md' } ) }
                            >
                                { __( 'Reset' ) }
                            </Button>
                        </div>
                    </PanelBody>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Corner Radius' ) }
                            value={ borderRadius }
                            min="0"
                            max="50"
                            onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Border Size' ) }
                            value={ borderWeight }
                            min="0"
                            max="6"
                            onChange={ ( value ) => setAttributes( { borderWeight: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Focus Outline Size' ) }
                            value={ focusOutlineWeight }
                            min="0"
                            max="6"
                            onChange={ ( value ) => setAttributes( { focusOutlineWeight: value } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        { icon ? (
                            <SelectControl
                                label={ __( 'Icon Position' ) }
                                value={ iconPosition }
                                options={ [
                                    {
                                        value: 'left',
                                        label: __( 'Left' ),
                                    }, {
                                        value: 'right',
                                        label: __( 'Right' ),
                                    },
                                ] }
                                onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
                            />
                        ) : '' }
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ color } />
                            <ColorIndicator colorValue={ textColor } />
                            { borderWeight ? (
                                <ColorIndicator colorValue={ borderColor } />
                            ) : '' }
                            { focusOutlineWeight && focusOutlineColor ? (
                                <ColorIndicator colorValue={ focusOutlineColor } />
                            ) : '' }
                        </Fragment>
                    ) } initialOpen={ false }>
                        <TabPanel
                            className="ghostkit-control-tabs"
                            tabs={ colorsTabs }>
                            {
                                ( tabData ) => {
                                    const isHover = tabData.name === 'hover';

                                    // focus tab
                                    if ( 'focus' === tabData.name ) {
                                        return (
                                            <ApplyFilters name="ghostkit.editor.controls" attribute="focusOutlineColor" props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Outline' ) }
                                                    value={ focusOutlineColor }
                                                    onChange={ ( val ) => setAttributes( { focusOutlineColor: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                        );
                                    }

                                    return (
                                        <Fragment>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Background' ) }
                                                    value={ isHover ? hoverColor : color }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverTextColor' : 'textColor' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Text' ) }
                                                    value={ isHover ? hoverTextColor : textColor }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverTextColor: val } : { textColor: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            { borderWeight ? (
                                                <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverBorderColor' : 'borderColor' } props={ this.props }>
                                                    <ColorPicker
                                                        label={ __( 'Border' ) }
                                                        value={ isHover ? hoverBorderColor : borderColor }
                                                        onChange={ ( val ) => setAttributes( isHover ? { hoverBorderColor: val } : { borderColor: val } ) }
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
                <div>
                    <span className={ className }>
                        { icon && iconPosition === 'left' ? (
                            <div className="ghostkit-button-icon ghostkit-button-icon-left">
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
                        <RichText
                            tagName="span"
                            placeholder={ __( 'Add text…' ) }
                            value={ text }
                            onChange={ ( value ) => setAttributes( { text: value } ) }
                            formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                            isSelected={ isSelected }
                            keepPlaceholderOnFocus
                        />
                        { icon && iconPosition === 'right' ? (
                            <span className="ghostkit-button-icon ghostkit-button-icon-right">
                                <IconPicker.Preview name={ icon } />
                            </span>
                        ) : '' }
                    </span>
                </div>
                { isSelected ? (
                    <form
                        className="ghostkit-button__inline-link"
                        onSubmit={ ( event ) => event.preventDefault() }
                    >
                        <Dashicon icon="admin-links" />
                        <URLInput
                            value={ url }
                            onChange={ ( value ) => setAttributes( { url: value } ) }
                            autoFocus={ false }
                        />
                        <IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
                    </form>
                ) : '' }
            </Fragment>
        );
    }
}

export const name = 'ghostkit/button-single';

export const settings = {
    title: __( 'Button' ),
    parent: [ 'ghostkit/button' ],
    description: __( 'A single button within a buttons wrapper block.' ),
    icon: getIcon( 'block-button' ),
    category: 'ghostkit',
    ghostkit: {
        customStylesCallback( attributes ) {
            const result = {
                backgroundColor: attributes.color,
                color: attributes.textColor,
                borderRadius: attributes.borderRadius,
                border: attributes.borderWeight && attributes.borderColor ? `${ attributes.borderWeight }px solid ${ attributes.borderColor }` : false,
                '&:hover, &:focus': {
                    backgroundColor: attributes.hoverColor,
                    color: attributes.hoverTextColor,
                    borderColor: attributes.borderWeight && attributes.borderColor && attributes.hoverBorderColor ? attributes.hoverBorderColor : false,
                },
            };

            if ( attributes.focusOutlineWeight && attributes.focusOutlineColor ) {
                result[ '&:focus' ] = result[ '&:focus' ] || {};
                result[ '&:focus' ][ 'box-shadow' ] = `0 0 0 ${ attributes.focusOutlineWeight }px ${ attributes.focusOutlineColor }`;
            }

            return result;
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
        inserter: false,
        reusable: false,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        url: {
            type: 'string',
            source: 'attribute',
            selector: 'a.ghostkit-button',
            attribute: 'href',
        },
        text: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-button .ghostkit-button-text',
            default: 'Button',
        },
        icon: {
            type: 'string',
            default: '',
        },
        iconPosition: {
            type: 'string',
            default: 'left',
        },
        size: {
            type: 'string',
            default: 'md',
        },
        color: {
            type: 'string',
            default: '#0366d6',
        },
        textColor: {
            type: 'string',
            default: '#ffffff',
        },

        borderRadius: {
            type: 'number',
            default: 2,
        },
        borderWeight: {
            type: 'number',
            default: 0,
        },
        borderColor: {
            type: 'string',
            default: '#00669b',
        },

        focusOutlineWeight: {
            type: 'number',
            default: 0,
        },

        hoverColor: {
            type: 'string',
        },
        hoverTextColor: {
            type: 'string',
        },
        hoverBorderColor: {
            type: 'string',
        },

        focusOutlineColor: {
            type: 'string',
            default: 'rgba(3, 102, 214, 0.5)',
        },
    },

    edit: ButtonSingleBlock,

    save: function( props ) {
        const {
            variant,
            text,
            icon,
            iconPosition,
            url,
            size,
            focusOutlineWeight,
            focusOutlineColor,
        } = props.attributes;

        let className = classnames(
            'ghostkit-button',
            size ? `ghostkit-button-${ size }` : ''
        );

        // focus outline
        if ( focusOutlineWeight && focusOutlineColor ) {
            className = classnames( className, 'ghostkit-button-with-outline' );
        }

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-button-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        const result = [
            <RichText.Content tagName="span" className="ghostkit-button-text" value={ text } key="button-text" />,
        ];

        // add icon.
        if ( icon ) {
            if ( iconPosition === 'right' ) {
                result.push(
                    <span className="ghostkit-button-icon ghostkit-button-icon-right" key="button-icon">
                        <IconPicker.Render name={ icon } />
                    </span>
                );
            } else {
                result.unshift(
                    <span className="ghostkit-button-icon ghostkit-button-icon-left" key="button-icon">
                        <IconPicker.Render name={ icon } />
                    </span>
                );
            }
        }

        return url ? (
            <a className={ className } href={ url }>
                { result }
            </a>
        ) : (
            <span className={ className }>
                { result }
            </span>
        );
    },

    deprecated: deprecatedArray,
};
