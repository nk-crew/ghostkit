// Import CSS
import './editor.scss';

// External Dependencies.
import { debounce } from 'throttle-debounce';

// Internal Dependencies.
import ElementIcon from '../_icons/custom-css.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    Placeholder,
} = wp.components;
const {
    PlainText,
} = wp.editor;

// style tag for preview
const $head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
const $stylePreview = document.createElement( 'style' );
$stylePreview.setAttribute( 'id', 'ghostkit-blocks-custom-css-block-preview' );
$head.appendChild( $stylePreview );

function updateStyles( newStyles ) {
    $stylePreview.innerHTML = newStyles;
}
updateStyles = debounce( 400, updateStyles );

class CustomCSSBlock extends Component {
    constructor() {
        super( ...arguments );
        updateStyles( this.props.attributes.customCSS );
    }
    render() {
        const {
            className,
            setAttributes,
            attributes,
            isPlugin,
        } = this.props;

        const {
            customCSS,
        } = attributes;

        return (
            <Placeholder
                icon={ <ElementIcon /> }
                label={ __( 'Custom CSS' ) }
                className={ className + ( isPlugin ? ' ghostkit-custom-css-plugin' : '' ) }
            >
                { ! isPlugin ? (
                    <p style={ { color: '#c72323' } }>{ __( 'This block is deprecated, please, use custom CSS in the page settings (top right corner after "Update" button).' ) }</p>
                ) : '' }
                { isPlugin ? (
                    <p>{ __( 'Custom CSS for the current post.' ) }</p>
                ) : '' }
                <PlainText
                    value={ customCSS }
                    onChange={ value => {
                        setAttributes( { customCSS: value } );
                        updateStyles( value );
                    } }
                    placeholder={ __( 'Write CSS…' ) }
                    aria-label={ __( 'CSS' ) }
                />
            </Placeholder>
        );
    }
}

export const name = 'ghostkit/custom-css';

export const settings = {
    title: __( 'Custom CSS' ),
    description: __( 'Custom CSS for current post.' ),
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'styles' ),
        __( 'css' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        customClassName: false,
        inserter: false,
    },
    attributes: {
        customCSS: {
            type: 'string',
            source: 'meta',
            meta: 'ghostkit_custom_css',
        },
    },

    edit: CustomCSSBlock,

    save: function() {
        return null;
    },
};
