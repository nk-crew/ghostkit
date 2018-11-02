// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/counter-box.svg';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

import ColorPicker from '../_components/color-picker.jsx';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    TextControl,
    RangeControl,
    SelectControl,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    RichText,
} = wp.editor;

class CounterBoxBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className = '' } = this.props;

        const {
            variant,
            ghostkitClassname,
            number,
            animateInViewport,
            animateInViewportFrom,
            numberPosition,
            numberSize,
            numberColor,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'counter_box' );

        className = classnames( 'ghostkit-counter-box', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-counter-box-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
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
                        <ToggleControl
                            label={ __( 'Animate in viewport' ) }
                            checked={ !! animateInViewport }
                            onChange={ ( val ) => setAttributes( { animateInViewport: val } ) }
                        />
                        { animateInViewport ? (
                            <TextControl
                                label={ __( 'Animate from' ) }
                                type="number"
                                value={ animateInViewportFrom }
                                onChange={ ( value ) => setAttributes( { animateInViewportFrom: parseInt( value, 10 ) } ) }
                            />
                        ) : '' }
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
                        <ColorPicker
                            label={ __( 'Number Color' ) }
                            value={ numberColor }
                            onChange={ ( val ) => setAttributes( { numberColor: val } ) }
                            alpha={ true }
                        />
                    </PanelBody>
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
                        <InnerBlocks
                            template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important counts, that you should know!' ) } ] ] }
                            templateLock={ false }
                        />
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
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'number' ),
        __( 'counter' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitStylesCallback( attributes ) {
            return {
                '.ghostkit-counter-box-number': {
                    fontSize: attributes.numberSize,
                    color: attributes.numberColor,
                },
            };
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
        number: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-counter-box-number',
            default: '77',
        },
        animateInViewport: {
            type: 'boolean',
            default: false,
        },
        animateInViewportFrom: {
            type: 'number',
            default: 0,
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
            default: '#0366d6',
        },
    },

    edit: CounterBoxBlock,

    save: function( { attributes, className = '' } ) {
        const {
            variant,
            number,
            animateInViewport,
            numberPosition,
        } = attributes;
        let {
            animateInViewportFrom,
        } = attributes;

        animateInViewportFrom = parseFloat( animateInViewportFrom );

        className = classnames( 'ghostkit-counter-box', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-counter-box-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <RichText.Content
                    tagName="div"
                    className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }${ animateInViewport ? ' ghostkit-count-up' : '' }` }
                    value={ number }
                    { ...{
                        'data-count-from': animateInViewport && animateInViewportFrom ? animateInViewportFrom : null,
                    } }
                />
                <div className="ghostkit-counter-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },

    deprecated: deprecatedArray,
};
