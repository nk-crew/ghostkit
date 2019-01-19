// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/block-counter-box.svg';
import deprecatedArray from './deprecated.jsx';

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
    TextControl,
    RangeControl,
    SelectControl,
    ToggleControl,
    TabPanel,
    ColorIndicator,
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
            hoverNumberColor,
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

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

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
                    </PanelBody>
                    <PanelBody>
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
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ numberColor } />
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
                                        <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverNumberColor' : 'numberColor' } props={ this.props }>
                                            <ColorPicker
                                                label={ __( 'Color' ) }
                                                value={ isHover ? hoverNumberColor : numberColor }
                                                onChange={ ( val ) => setAttributes( isHover ? { hoverNumberColor: val } : { numberColor: val } ) }
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
                    <div className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }>
                        <RichText
                            tagName="div"
                            className="ghostkit-counter-box-number-wrap"
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
    description: __( 'Show your progress and rewards using counting numbers.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'number' ),
        __( 'counter' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/number-box/',
        customStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-counter-box-number': {
                    fontSize: attributes.numberSize,
                    color: attributes.numberColor,
                },
            };

            if ( attributes.hoverNumberColor ) {
                styles[ '&:hover .ghostkit-counter-box-number' ] = {
                    color: attributes.hoverNumberColor,
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
        variant: {
            type: 'string',
            default: 'default',
        },
        number: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-counter-box-number-wrap',
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
        hoverNumberColor: {
            type: 'string',
        },
    },

    edit: CounterBoxBlock,

    save: function( props ) {
        const {
            variant,
            number,
            animateInViewport,
            numberPosition,
        } = props.attributes;

        let {
            animateInViewportFrom,
        } = props.attributes;

        animateInViewportFrom = parseFloat( animateInViewportFrom );

        let className = 'ghostkit-counter-box';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-counter-box-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                <div
                    className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }
                >
                    <RichText.Content
                        tagName="div"
                        className={ `ghostkit-counter-box-number-wrap${ animateInViewport ? ' ghostkit-count-up' : '' }` }
                        value={ number }
                        { ...{
                            'data-count-from': animateInViewport && animateInViewportFrom ? animateInViewportFrom : null,
                        } }
                    />
                </div>
                <div className="ghostkit-counter-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },

    deprecated: deprecatedArray,
};
