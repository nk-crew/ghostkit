// External Dependencies.
import shorthash from 'shorthash';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    Dashicon,
    IconButton,
    PanelBody,
    PanelColor,
    RangeControl,
    Button,
    ButtonGroup,
} = wp.components;
const {
    InspectorControls,
    BlockControls,
    BlockAlignmentToolbar,
    RichText,
    ColorPalette,
    UrlInput,
} = wp.blocks;

/**
 * Get button styles based on attributes.
 *
 * @param {object} atts - element atts.
 * @return {object} styles object.
 */
function getStyles( atts ) {
    const {
        id,
        color,
        textColor,
        borderRadius,
        borderWeight,
        borderColor,
        hoverColor,
        hoverTextColor,
        hoverBorderColor,
    } = atts;

    const ID = `ghostkit-button-${ id }`;

    const style = {};
    style[ `.${ ID } .ghostkit-button` ] = {
        backgroundColor: color,
        color: textColor,
        borderRadius: borderRadius + 'px',
        border: borderWeight && borderColor ? `${ borderWeight }px solid ${ borderColor }` : false,
        '&:hover, &:focus': {
            backgroundColor: hoverColor,
            color: hoverTextColor,
            borderColor: borderWeight && borderColor && hoverBorderColor ? hoverBorderColor : false,
        },
    };

    return style;
}

class ButtonBlock extends Component {
    constructor( { attributes } ) {
        super( ...arguments );
        this.updateAlignment = this.updateAlignment.bind( this );
        this.toggleClear = this.toggleClear.bind( this );

        // generate unique ID.
        if ( ! attributes.id ) {
            this.props.setAttributes( { id: shorthash.unique( this.props.id ) } );
        }
    }

    updateAlignment( nextAlign ) {
        this.props.setAttributes( { align: nextAlign } );
    }

    toggleClear() {
        const { attributes, setAttributes } = this.props;
        setAttributes( { clear: ! attributes.clear } );
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className } = this.props;

        const {
            id,
            text,
            url,
            title,
            align,
            size,
            color,
            textColor,
            borderRadius,
            borderWeight,
            borderColor,
            hoverColor,
            hoverTextColor,
            hoverBorderColor,
        } = attributes;

        const sizes = {
            XS: 'xs',
            S: 'sm',
            M: 'md',
            L: 'lg',
            XL: 'xl',
        };

        // classes.
        const ID = `ghostkit-button-${ id }`;

        className += ` ${ className || '' } ${ ID } ghostkit-button-wrap align${ align }`;

        const linkClassName = `ghostkit-button${ size ? ` ghostkit-button-${ size }` : '' }`;

        return [
            isSelected &&
            <BlockControls key="controls">
                <BlockAlignmentToolbar value={ align } onChange={ this.updateAlignment } />
            </BlockControls>,
            isSelected &&
            <InspectorControls key="inspector">
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
                    <RangeControl
                        label={ __( 'Corner Radius' ) }
                        value={ borderRadius }
                        min="0"
                        max="50"
                        onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
                    />
                    <PanelColor title={ __( 'Background Color' ) } colorValue={ color } >
                        <ColorPalette
                            value={ color }
                            onChange={ ( colorValue ) => setAttributes( { color: colorValue } ) }
                        />
                    </PanelColor>
                    <PanelColor title={ __( 'Text Color' ) } colorValue={ textColor } >
                        <ColorPalette
                            value={ textColor }
                            onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
                        />
                    </PanelColor>
                </PanelBody>
                <PanelBody title={ __( 'Border' ) } initialOpen={ false }>
                    <RangeControl
                        label={ __( 'Weight' ) }
                        value={ borderWeight }
                        min="0"
                        max="6"
                        onChange={ ( val ) => setAttributes( { borderWeight: val } ) }
                    />
                    <PanelColor title={ __( 'Color' ) } colorValue={ borderColor } >
                        <ColorPalette
                            value={ color }
                            onChange={ ( colorValue ) => setAttributes( { borderColor: colorValue } ) }
                        />
                    </PanelColor>
                </PanelBody>
                <PanelBody title={ __( 'Hover Colors' ) } initialOpen={ false }>
                    <PanelColor title={ __( 'Background Color' ) } colorValue={ hoverColor } >
                        <ColorPalette
                            value={ hoverColor }
                            onChange={ ( colorValue ) => setAttributes( { hoverColor: colorValue } ) }
                        />
                    </PanelColor>
                    <PanelColor title={ __( 'Text Color' ) } colorValue={ hoverTextColor } >
                        <ColorPalette
                            value={ hoverTextColor }
                            onChange={ ( colorValue ) => setAttributes( { hoverTextColor: colorValue } ) }
                        />
                    </PanelColor>
                    <PanelColor title={ __( 'Border Color' ) } colorValue={ hoverBorderColor } >
                        <ColorPalette
                            value={ hoverBorderColor }
                            onChange={ ( colorValue ) => setAttributes( { hoverBorderColor: colorValue } ) }
                        />
                    </PanelColor>
                </PanelBody>
            </InspectorControls>,
            <div className={ className } title={ title } key="button" { ...getCustomStylesAttr( getStyles( attributes ) ) }>
                <RichText
                    tagName="span"
                    placeholder={ __( 'Add text…' ) }
                    value={ text }
                    onChange={ ( value ) => setAttributes( { text: value } ) }
                    formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                    className={ linkClassName }
                    isSelected={ isSelected }
                    keepPlaceholderOnFocus
                />
            </div>,
            isSelected && (
                <form
                    key="form-link"
                    className="ghostkit-button__inline-link"
                    onSubmit={ ( event ) => event.preventDefault() }>
                    <Dashicon icon="admin-links" />
                    <UrlInput
                        value={ url }
                        onChange={ ( value ) => setAttributes( { url: value } ) }
                    />
                    <IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
                </form>
            ),
        ];
    }
}

const blockAttributes = {
    id: {
        type: 'string',
        default: false,
    },
    url: {
        type: 'string',
        source: 'attribute',
        selector: 'a',
        attribute: 'href',
    },
    title: {
        type: 'string',
        source: 'attribute',
        selector: 'a',
        attribute: 'title',
    },
    text: {
        type: 'array',
        source: 'children',
        selector: 'a',
    },
    align: {
        type: 'string',
        default: 'none',
    },
    size: {
        type: 'string',
        default: 'md',
    },
    color: {
        type: 'string',
        default: '#008dbe',
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
    hoverColor: {
        type: 'string',
    },
    hoverTextColor: {
        type: 'string',
    },
    hoverBorderColor: {
        type: 'string',
    },
};

export const name = 'ghostkit/button';

export const settings = {
    title: __( 'Button' ),

    description: __( 'Add button block.' ),

    icon: 'button',

    category: 'layout',

    keywords: [
        __( 'btn' ),
        __( 'button' ),
        __( 'ghostkit' ),
    ],

    supports: {
        html: false,
    },

    attributes: blockAttributes,

    getEditWrapperProps( attributes ) {
        const { align, clear } = attributes;
        const props = { 'data-resized': true };

        if ( 'left' === align || 'right' === align || 'center' === align ) {
            props[ 'data-align' ] = align;
        }

        if ( clear ) {
            props[ 'data-clear' ] = 'true';
        }

        return props;
    },

    edit: ButtonBlock,

    save( { attributes, className } ) {
        const {
            id,
            text,
            url,
            title,
            align,
            size,
        } = attributes;

        // classes.
        const ID = `ghostkit-button-${ id }`;

        className = `${ className || '' } ${ ID } ghostkit-button-wrap align${ align }`;

        const linkClassName = `ghostkit-button${ size ? ` ghostkit-button-${ size }` : '' }`;

        return (
            <div className={ className } { ...getCustomStylesAttr( getStyles( attributes ) ) }>
                <a className={ linkClassName } href={ url } title={ title }>
                    { text }
                </a>
            </div>
        );
    },
};
