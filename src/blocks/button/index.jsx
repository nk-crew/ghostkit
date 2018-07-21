// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/button.svg';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    SelectControl,
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
} = wp.editor;

class ButtonBlock extends Component {
    constructor() {
        super( ...arguments );
        this.updateAlignment = this.updateAlignment.bind( this );
        this.toggleClear = this.toggleClear.bind( this );
    }

    ghostkitStyles( attributes ) {
        return {
            '.ghostkit-button': {
                backgroundColor: attributes.color,
                color: attributes.textColor,
                borderRadius: attributes.borderRadius,
                border: attributes.borderWeight && attributes.borderColor ? `${ attributes.borderWeight }px solid ${ attributes.borderColor }` : false,
                '&:hover, &:focus': {
                    backgroundColor: attributes.hoverColor,
                    color: attributes.hoverTextColor,
                    borderColor: attributes.borderWeight && attributes.borderColor && attributes.hoverBorderColor ? attributes.hoverBorderColor : false,
                },
            },
        };
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
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'button' );

        const sizes = {
            XS: 'xs',
            S: 'sm',
            M: 'md',
            L: 'lg',
            XL: 'xl',
        };

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <BlockControls>
                    <BlockAlignmentToolbar value={ align } onChange={ this.updateAlignment } />
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
                            onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                        />
                        <PanelColor title={ __( 'Background Color' ) } colorValue={ color } >
                            <ColorPalette
                                value={ color }
                                onChange={ ( value ) => setAttributes( { color: value } ) }
                            />
                        </PanelColor>
                        <PanelColor title={ __( 'Text Color' ) } colorValue={ textColor } >
                            <ColorPalette
                                value={ textColor }
                                onChange={ ( value ) => setAttributes( { textColor: value } ) }
                            />
                        </PanelColor>
                    </PanelBody>
                    <PanelBody title={ __( 'Border' ) } initialOpen={ false }>
                        <RangeControl
                            label={ __( 'Weight' ) }
                            value={ borderWeight }
                            min="0"
                            max="6"
                            onChange={ ( value ) => setAttributes( { borderWeight: value } ) }
                        />
                        <PanelColor title={ __( 'Color' ) } colorValue={ borderColor } >
                            <ColorPalette
                                value={ borderColor }
                                onChange={ ( value ) => setAttributes( { borderColor: value } ) }
                            />
                        </PanelColor>
                    </PanelBody>
                    <PanelBody title={ __( 'Hover Colors' ) } initialOpen={ false }>
                        <PanelColor title={ __( 'Background Color' ) } colorValue={ hoverColor } >
                            <ColorPalette
                                value={ hoverColor }
                                onChange={ ( value ) => setAttributes( { hoverColor: value } ) }
                            />
                        </PanelColor>
                        <PanelColor title={ __( 'Text Color' ) } colorValue={ hoverTextColor } >
                            <ColorPalette
                                value={ hoverTextColor }
                                onChange={ ( value ) => setAttributes( { hoverTextColor: value } ) }
                            />
                        </PanelColor>
                        <PanelColor title={ __( 'Border Color' ) } colorValue={ hoverBorderColor } >
                            <ColorPalette
                                value={ hoverBorderColor }
                                onChange={ ( value ) => setAttributes( { hoverBorderColor: value } ) }
                            />
                        </PanelColor>
                    </PanelBody>
                </InspectorControls>
                <div className={ classnames( className, `align${ align }` ) } title={ title }>
                    <RichText
                        tagName="span"
                        placeholder={ __( 'Add text…' ) }
                        value={ text }
                        onChange={ ( value ) => setAttributes( { text: value } ) }
                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                        className={ classnames( 'ghostkit-button', size ? `ghostkit-button-${ size }` : '' ) }
                        isSelected={ isSelected }
                        keepPlaceholderOnFocus
                    />
                </div>
                { isSelected && (
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
                ) }
            </Fragment>
        );
    }
}

const blockAttributes = {
    variant: {
        type: 'string',
        default: 'default',
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
        default: '#016c91',
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

    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,

    category: 'layout',

    keywords: [
        __( 'btn' ),
        __( 'button' ),
        __( 'ghostkit' ),
    ],

    supports: {
        html: false,
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
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
            text,
            url,
            title,
            align,
            size,
            variant,
        } = attributes;

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-button-variant-${ variant }` );
        }

        return (
            <div className={ classnames( className, `align${ align }` ) }>
                <a className={ classnames( 'ghostkit-button', size ? `ghostkit-button-${ size }` : '' ) } href={ url } title={ title }>
                    { text }
                </a>
            </div>
        );
    },
};
