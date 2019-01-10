// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/pricing.svg';

// layout icons.
import IconVerticalCenter from './icons/vertical-center.svg';
import IconVerticalTop from './icons/vertical-top.svg';
import IconVerticalBottom from './icons/vertical-bottom.svg';
import IconVerticalCenterWhite from './icons/vertical-center-white.svg';
import IconVerticalTopWhite from './icons/vertical-top-white.svg';
import IconVerticalBottomWhite from './icons/vertical-bottom-white.svg';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    Button,
    ButtonGroup,
    PanelBody,
    RangeControl,
    SelectControl,
    Toolbar,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    AlignmentToolbar,
} = wp.editor;

class PricingTableBlock extends Component {
    /**
     * Returns the layouts configuration for a given number of items.
     *
     * @return {Object[]} Items layout configuration.
     */
    getInnerBlocksTemplate() {
        const {
            attributes,
        } = this.props;

        const {
            count,
        } = attributes;

        const result = [];

        if ( count > 0 ) {
            for ( let k = 1; k <= count; k++ ) {
                result.push( [ 'ghostkit/pricing-table-item' ] );
            }
        }

        return result;
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            count,
            gap,
            verticalAlign,
            horizontalAlign,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'pricing_table' );

        className = classnames(
            className,
            'ghostkit-pricing-table',
            `ghostkit-pricing-table-gap-${ gap }`,
            verticalAlign ? `ghostkit-pricing-table-items-${ count }` : false,
            verticalAlign ? `ghostkit-pricing-table-align-vertical-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-pricing-table-align-horizontal-${ horizontalAlign }` : false
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-pricing-table-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={ horizontalAlign }
                        onChange={ ( val ) => setAttributes( { horizontalAlign: val } ) }
                    />
                </BlockControls>
                { count > 1 ? (
                    <BlockControls>
                        <Toolbar controls={ [
                            {
                                icon: verticalAlign === '' ? <IconVerticalTopWhite viewBox="0 0 24 24" /> : <IconVerticalTop viewBox="0 0 24 24" />,
                                title: __( 'ItemsVertical Start' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: verticalAlign === '',
                            },
                            {
                                icon: verticalAlign === 'center' ? <IconVerticalCenterWhite viewBox="0 0 24 24" /> : <IconVerticalCenter viewBox="0 0 24 24" />,
                                title: __( 'ItemsVertical Center' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: verticalAlign === 'center',
                            },
                            {
                                icon: verticalAlign === 'end' ? <IconVerticalBottomWhite viewBox="0 0 24 24" /> : <IconVerticalBottom viewBox="0 0 24 24" />,
                                title: __( 'ItemsVertical End' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: verticalAlign === 'end',
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
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
                            label={ __( 'Items' ) }
                            value={ count }
                            onChange={ ( value ) => setAttributes( { count: value } ) }
                            min={ 1 }
                            max={ 5 }
                        />
                    </PanelBody>
                    <PanelBody>
                        <SelectControl
                            label={ __( 'Vertical alignment' ) }
                            value={ verticalAlign }
                            onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
                            options={ [
                                {
                                    label: __( 'Start' ),
                                    value: '',
                                }, {
                                    label: __( 'Center' ),
                                    value: 'center',
                                }, {
                                    label: __( 'End' ),
                                    value: 'end',
                                },
                            ] }
                        />
                        <SelectControl
                            label={ __( 'Horizontal alignment' ) }
                            value={ horizontalAlign }
                            onChange={ ( value ) => setAttributes( { horizontalAlign: value } ) }
                            options={ [
                                {
                                    label: __( 'Left' ),
                                    value: 'left',
                                }, {
                                    label: __( 'Center' ),
                                    value: 'center',
                                }, {
                                    label: __( 'Right' ),
                                    value: 'right',
                                },
                            ] }
                        />
                    </PanelBody>
                    <PanelBody>
                        <BaseControl label={ __( 'Gap' ) }>
                            <ButtonGroup>
                                {
                                    [
                                        {
                                            label: __( 'none' ),
                                            value: 'no',
                                        },
                                        {
                                            label: __( 'sm' ),
                                            value: 'sm',
                                        },
                                        {
                                            label: __( 'md' ),
                                            value: 'md',
                                        },
                                        {
                                            label: __( 'lg' ),
                                            value: 'lg',
                                        },
                                    ].map( ( val ) => {
                                        const selected = gap === val.value;

                                        return (
                                            <Button
                                                isLarge
                                                isPrimary={ selected }
                                                aria-pressed={ selected }
                                                onClick={ () => setAttributes( { gap: val.value } ) }
                                                key={ `gap_${ val.label }` }
                                            >
                                                { val.label }
                                            </Button>
                                        );
                                    } )
                                }
                            </ButtonGroup>
                        </BaseControl>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { count > 0 ? (
                        <InnerBlocks
                            template={ this.getInnerBlocksTemplate() }
                            templateLock="all"
                            allowedBlocks={ [ 'ghostkit/pricing-table-item' ] }
                        />
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/pricing-table';

export const settings = {
    title: __( 'Pricing Table' ),
    description: __( 'Sell your products or services and show all features.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'pricing' ),
        __( 'table' ),
        __( 'ghostkit' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/pricing-tables/',
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
        count: {
            type: 'number',
            default: 2,
        },
        gap: {
            type: 'string',
            default: 'md',
        },
        verticalAlign: {
            type: 'string',
            default: 'center',
        },
        horizontalAlign: {
            type: 'string',
            default: 'center',
        },
    },

    edit: PricingTableBlock,

    save: function( props ) {
        const {
            variant,
            count,
            gap,
            verticalAlign,
            horizontalAlign,
        } = props.attributes;

        let className = classnames(
            'ghostkit-pricing-table',
            `ghostkit-pricing-table-gap-${ gap }`,
            count ? `ghostkit-pricing-table-items-${ count }` : false,
            verticalAlign ? `ghostkit-pricing-table-align-vertical-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-pricing-table-align-horizontal-${ horizontalAlign }` : false
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-pricing-table-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
