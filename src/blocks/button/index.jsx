// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/button.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
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
 * @param {object} attributes - element atts.
 * @return {object} styles object.
 */
function getStyles( attributes ) {
    const {
        ghostkitClassname,
        ghostkitGetStylesAttr,
        color,
        textColor,
        borderRadius,
        borderWeight,
        borderColor,
        hoverColor,
        hoverTextColor,
        hoverBorderColor,
    } = attributes;

    if ( ! ghostkitClassname || ! ghostkitGetStylesAttr ) {
        return false;
    }

    const style = {};
    style[ `.${ ghostkitClassname } .ghostkit-button` ] = {
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

    return ghostkitGetStylesAttr( style );
}

class ButtonBlock extends Component {
    constructor() {
        super( ...arguments );
        this.updateAlignment = this.updateAlignment.bind( this );
        this.toggleClear = this.toggleClear.bind( this );
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

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
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

        className += ' ' + ghostkitClassname;

        return (
            <Fragment>
                <BlockControls>
                    <BlockAlignmentToolbar value={ align } onChange={ this.updateAlignment } />
                </BlockControls>
                <InspectorControls>
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
                </InspectorControls>
                <div className={ `${ className } align${ align }` } title={ title } { ...getStyles( attributes ) }>
                    <RichText
                        tagName="span"
                        placeholder={ __( 'Add text…' ) }
                        value={ text }
                        onChange={ ( value ) => setAttributes( { text: value } ) }
                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                        className={ `ghostkit-button${ size ? ` ghostkit-button-${ size }` : '' }` }
                        isSelected={ isSelected }
                        keepPlaceholderOnFocus
                    />
                </div>
                <form
                    className="ghostkit-button__inline-link"
                    onSubmit={ ( event ) => event.preventDefault() }>
                    <Dashicon icon="admin-links" />
                    <UrlInput
                        value={ url }
                        onChange={ ( value ) => setAttributes( { url: value } ) }
                    />
                    <IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
                </form>
            </Fragment>
        );
    }
}

const blockAttributes = {
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

    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,

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

    save( { attributes, className = '' } ) {
        const {
            ghostkitClassname,
            text,
            url,
            title,
            align,
            size,
        } = attributes;

        className += ' ' + ghostkitClassname;

        return (
            <div className={ `${ className } align${ align }` } { ...getStyles( attributes ) }>
                <a className={ `ghostkit-button${ size ? ` ghostkit-button-${ size }` : '' }` } href={ url } title={ title }>
                    { text }
                </a>
            </div>
        );
    },
};
