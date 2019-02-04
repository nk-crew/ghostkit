// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';
import { settings as pricingItemSettings } from './item.jsx';

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
    Toolbar,
    IconButton,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    AlignmentToolbar,
} = wp.editor;

const {
    createBlock,
} = wp.blocks;

const {
    compose,
} = wp.compose;
const {
    withSelect,
    withDispatch,
} = wp.data;

class PricingTableBlock extends Component {
    constructor() {
        super( ...arguments );

        this.getInnerBlocksTemplate = this.getInnerBlocksTemplate.bind( this );
        this.maybeUpdateColumnsNumber = this.maybeUpdateColumnsNumber.bind( this );
    }

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

    componentDidMount() {
        this.maybeUpdateColumnsNumber();
    }
    componentDidUpdate() {
        this.maybeUpdateColumnsNumber();
    }

    /**
     * Update current columns number.
     */
    maybeUpdateColumnsNumber() {
        const {
            count,
        } = this.props.attributes;

        const {
            block,
            setAttributes,
        } = this.props;

        if ( count !== block.innerBlocks.length ) {
            setAttributes( {
                count: block.innerBlocks.length,
            } );
        }
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelectedBlockInRoot,
            insertPricingItem,
        } = this.props;

        let { className = '' } = this.props;

        const {
            count,
            gap,
            verticalAlign,
            horizontalAlign,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-pricing-table',
            `ghostkit-pricing-table-gap-${ gap }`,
            verticalAlign ? `ghostkit-pricing-table-items-${ count }` : false,
            verticalAlign ? `ghostkit-pricing-table-align-vertical-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-pricing-table-align-horizontal-${ horizontalAlign }` : false
        );

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
                                icon: getIcon( 'icon-vertical-top', true ),
                                title: __( 'ItemsVertical Start' ),
                                onClick: () => setAttributes( { verticalAlign: '' } ),
                                isActive: verticalAlign === '',
                            },
                            {
                                icon: getIcon( 'icon-vertical-center', true ),
                                title: __( 'ItemsVertical Center' ),
                                onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                isActive: verticalAlign === 'center',
                            },
                            {
                                icon: getIcon( 'icon-vertical-bottom', true ),
                                title: __( 'ItemsVertical End' ),
                                onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                isActive: verticalAlign === 'end',
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
                <InspectorControls>
                    <PanelBody>
                        <BaseControl label={ __( 'Vertical align' ) }>
                            <Toolbar controls={ [
                                {
                                    icon: getIcon( 'icon-vertical-top', true ),
                                    title: __( 'ItemsVertical Start' ),
                                    onClick: () => setAttributes( { verticalAlign: '' } ),
                                    isActive: verticalAlign === '',
                                },
                                {
                                    icon: getIcon( 'icon-vertical-center', true ),
                                    title: __( 'ItemsVertical Center' ),
                                    onClick: () => setAttributes( { verticalAlign: 'center' } ),
                                    isActive: verticalAlign === 'center',
                                },
                                {
                                    icon: getIcon( 'icon-vertical-bottom', true ),
                                    title: __( 'ItemsVertical End' ),
                                    onClick: () => setAttributes( { verticalAlign: 'end' } ),
                                    isActive: verticalAlign === 'end',
                                },
                            ] }
                            />
                        </BaseControl>
                        <BaseControl label={ __( 'Horizontal align' ) }>
                            <AlignmentToolbar
                                value={ horizontalAlign }
                                onChange={ ( val ) => setAttributes( { horizontalAlign: val } ) }
                            />
                        </BaseControl>
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
                            allowedBlocks={ [ 'ghostkit/pricing-table-item' ] }
                        />
                    ) : '' }
                </div>
                { isSelectedBlockInRoot && count < 6 ? (
                    <div className="ghostkit-accordion-add-item">
                        <IconButton
                            icon={ 'insert' }
                            onClick={ () => {
                                insertPricingItem();
                            } }
                        >
                            { __( 'Add Pricing Table' ) }
                        </IconButton>
                    </div>
                ) : '' }
            </Fragment>
        );
    }
}

export const name = 'ghostkit/pricing-table';

export const settings = {
    title: __( 'Pricing Table' ),
    description: __( 'Sell your products or services and show all features.' ),
    icon: getIcon( 'block-pricing-table' ),
    category: 'ghostkit',
    keywords: [
        __( 'pricing' ),
        __( 'table' ),
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

    edit: compose( [
        withSelect( ( select, ownProps ) => {
            const {
                getBlock,
                isBlockSelected,
                hasSelectedInnerBlock,
            } = select( 'core/editor' );

            const { clientId } = ownProps;

            return {
                block: getBlock( clientId ),
                isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
            };
        } ),
        withDispatch( ( dispatch, ownProps ) => {
            const {
                insertBlock,
            } = dispatch( 'core/editor' );

            const { clientId } = ownProps;

            return {
                insertPricingItem() {
                    insertBlock( createBlock( 'ghostkit/pricing-table-item', pricingItemSettings ), undefined, clientId );
                },
            };
        } ),
    ] )( PricingTableBlock ),

    save: function( props ) {
        const {
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
