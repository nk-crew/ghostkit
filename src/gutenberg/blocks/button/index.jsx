// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';
import deprecatedArray from './deprecated';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const {
    PanelBody,
    BaseControl,
    Button,
    ButtonGroup,
    IconButton,
    Tooltip,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    BlockAlignmentToolbar,
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

class ButtonBlock extends Component {
    constructor() {
        super( ...arguments );

        this.maybeUpdateItemsCount = this.maybeUpdateItemsCount.bind( this );
    }

    componentDidMount() {
        this.maybeUpdateItemsCount();
    }
    componentDidUpdate() {
        this.maybeUpdateItemsCount();
    }

    /**
     * Update current items number.
     */
    maybeUpdateItemsCount() {
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
                result.push( [ 'ghostkit/button-single' ] );
            }
        }

        return result;
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelectedBlockInRoot,
            insertButtonSingle,
        } = this.props;

        let { className = '' } = this.props;

        const {
            align,
            gap,
        } = attributes;

        className = classnames(
            'ghostkit-button-wrapper',
            gap ? `ghostkit-button-wrapper-gap-${ gap }` : false,
            align && align !== 'none' ? `ghostkit-button-wrapper-align-${ align }` : false,
            className
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <BlockAlignmentToolbar
                        value={ align }
                        onChange={ ( value ) => setAttributes( { align: value } ) }
                        controls={ [ 'left', 'center', 'right' ] }
                    />
                </BlockControls>
                <InspectorControls>
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
                        <BaseControl label={ __( 'Align' ) }>
                            <BlockAlignmentToolbar
                                value={ align }
                                onChange={ ( value ) => setAttributes( { align: value } ) }
                                controls={ [ 'left', 'center', 'right' ] }
                            />
                        </BaseControl>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks
                        template={ this.getInnerBlocksTemplate() }
                        allowedBlocks={ [ 'ghostkit/button-single' ] }
                    />
                    { isSelectedBlockInRoot ? (
                        <Tooltip text={ __( 'Add Button' ) }>
                            <IconButton
                                icon={ 'insert' }
                                onClick={ () => {
                                    insertButtonSingle();
                                } }
                            />
                        </Tooltip>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

const blockAttributes = {
    align: {
        type: 'string',
        default: 'none',
    },
    count: {
        type: 'number',
        default: 1,
    },
    gap: {
        type: 'string',
        default: 'md',
    },

    // Deprecated attributes, but we can't remove it from there just because block can't be migrated from deprecated block to actual...
    // TODO: remove it when this issue will be fixed https://github.com/WordPress/gutenberg/issues/10406
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
        selector: '.ghostkit-button',
        default: 'Button',
    },
    size: {
        type: 'string',
        default: 'md',
    },
    color: {
        type: 'string',
        default: '#0366d6',
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
    title: __( 'Buttons' ),

    description: __( 'Change important links to buttons to get more click rate.' ),

    icon: getIcon( 'block-button' ),

    category: 'ghostkit',

    keywords: [
        __( 'btn' ),
        __( 'button' ),
    ],

    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/button/',
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
    },

    attributes: blockAttributes,

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
                insertButtonSingle() {
                    insertBlock( createBlock( 'ghostkit/button-single' ), undefined, clientId );
                },
            };
        } ),
    ] )( ButtonBlock ),

    save( props ) {
        const {
            align,
            gap,
        } = props.attributes;

        let className = classnames(
            'ghostkit-button-wrapper',
            gap ? `ghostkit-button-wrapper-gap-${ gap }` : false,
            align && align !== 'none' ? `ghostkit-button-wrapper-align-${ align }` : false
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

    deprecated: deprecatedArray,
};
