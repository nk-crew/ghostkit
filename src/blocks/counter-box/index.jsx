// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/counter-box.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    RangeControl,
    PanelColor,
    SelectControl,
} = wp.components;
const {
    InspectorControls,
    ColorPalette,
    InnerBlocks,
    RichText,
} = wp.blocks;

class CounterBoxBlock extends Component {
    ghostkitStyles( attributes ) {
        return {
            '.ghostkit-counter-box-number': {
                fontSize: attributes.numberSize,
                color: attributes.numberColor,
            },
        };
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
            number,
            numberPosition,
            numberSize,
            numberColor,
        } = attributes;

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <RangeControl
                        label={ __( 'Number Size' ) }
                        value={ numberSize }
                        onChange={ ( value ) => setAttributes( { numberSize: value } ) }
                        min={ 20 }
                        max={ 100 }
                        beforeIcon="editor-textcolor"
                        afterIcon="editor-textcolor"
                    />
                    <SelectControl
                        label={ __( 'Number Position' ) }
                        value={ numberPosition }
                        onChange={ ( value ) => setAttributes( { numberPosition: value } ) }
                        options={ [
                            {
                                label: __( 'Top' ),
                                value: 'top',
                            },
                            {
                                label: __( 'Left' ),
                                value: 'left',
                            },
                            {
                                label: __( 'Right' ),
                                value: 'right',
                            },
                        ] }
                    />
                    <PanelColor title={ __( 'Number Color' ) } colorValue={ numberColor } >
                        <ColorPalette
                            value={ numberColor }
                            onChange={ ( value ) => setAttributes( { numberColor: value } ) }
                        />
                    </PanelColor>
                </InspectorControls>
                <div className={ className }>
                    <div className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }>
                        <RichText
                            tagName="div"
                            placeholder={ __( 'Add number…' ) }
                            value={ number }
                            onChange={ ( value ) => setAttributes( { number: value } ) }
                            formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                            isSelected={ isSelected }
                            keepPlaceholderOnFocus
                        />
                    </div>
                    <div className="ghostkit-counter-box-content">
                        { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                        <InnerBlocks />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/counter-box';

export const settings = {
    title: __( 'Number Box' ),
    description: __( 'Number Box.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'number' ),
        __( 'counter' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
        number: {
            type: 'string',
            default: '77',
        },
        numberPosition: {
            type: 'string',
            default: 'top',
        },
        numberSize: {
            type: 'number',
            default: 50,
        },
        numberColor: {
            type: 'string',
            default: '#008dbe',
        },
    },

    edit: CounterBoxBlock,

    save: function( { attributes, className = '' } ) {
        const {
            number,
            numberPosition,
        } = attributes;

        return (
            <div className={ className }>
                <div className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }>
                    { number }
                </div>
                <div className="ghostkit-counter-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
