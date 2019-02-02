// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';
import deprecatedArray from './deprecated.jsx';

import ColorPicker from '../_components/color-picker.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    PanelBody,
    TextControl,
    RangeControl,
    ToggleControl,
    TabPanel,
    Toolbar,
    ColorIndicator,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
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
            number,
            animateInViewport,
            animateInViewportFrom,
            numberPosition,
            numberSize,
            showContent,
            numberColor,
            hoverNumberColor,
        } = attributes;

        className = classnames( 'ghostkit-counter-box', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
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
                        <BaseControl
                            label={ __( 'Number Position' ) }
                        >
                            <Toolbar controls={ [
                                {
                                    icon: 'align-center',
                                    title: __( 'Top' ),
                                    onClick: () => setAttributes( { numberPosition: 'top' } ),
                                    isActive: numberPosition === 'top',
                                },
                                {
                                    icon: 'align-left',
                                    title: __( 'Left' ),
                                    onClick: () => setAttributes( { numberPosition: 'left' } ),
                                    isActive: numberPosition === 'left',
                                },
                                {
                                    icon: 'align-right',
                                    title: __( 'Right' ),
                                    onClick: () => setAttributes( { numberPosition: 'right' } ),
                                    isActive: numberPosition === 'right',
                                },
                            ] } />
                        </BaseControl>
                    </PanelBody>
                    <PanelBody>
                        <ToggleControl
                            label={ __( 'Animate in viewport' ) }
                            checked={ !! animateInViewport }
                            onChange={ ( val ) => setAttributes( { animateInViewport: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show Content' ) }
                            checked={ !! showContent }
                            onChange={ ( val ) => setAttributes( { showContent: val } ) }
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
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: 'align-center',
                            title: __( 'Number Position Top' ),
                            onClick: () => setAttributes( { numberPosition: 'top' } ),
                            isActive: numberPosition === 'top',
                        },
                        {
                            icon: 'align-left',
                            title: __( 'Number Position Left' ),
                            onClick: () => setAttributes( { numberPosition: 'left' } ),
                            isActive: numberPosition === 'left',
                        },
                        {
                            icon: 'align-right',
                            title: __( 'Number Position Right' ),
                            onClick: () => setAttributes( { numberPosition: 'right' } ),
                            isActive: numberPosition === 'right',
                        },
                    ] } />
                </BlockControls>
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
                    { showContent ? (
                        <div className="ghostkit-counter-box-content">
                            <InnerBlocks
                                template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important counts, that you should know!' ) } ] ] }
                                templateLock={ false }
                            />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/counter-box';

export const settings = {
    title: __( 'Number Box' ),
    description: __( 'Show your progress and rewards using counting numbers.' ),
    icon: getIcon( 'block-counter-box' ),
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
        showContent: {
            type: 'boolean',
            default: true,
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
            number,
            animateInViewport,
            numberPosition,
            showContent,
        } = props.attributes;

        let {
            animateInViewportFrom,
        } = props.attributes;

        animateInViewportFrom = parseFloat( animateInViewportFrom );

        let className = 'ghostkit-counter-box';

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
                { showContent ? (
                    <div className="ghostkit-counter-box-content">
                        <InnerBlocks.Content />
                    </div>
                ) : '' }
            </div>
        );
    },

    deprecated: deprecatedArray,
};
