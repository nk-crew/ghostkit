// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/button.svg';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const {
    SelectControl,
    PanelBody,
    BaseControl,
    Button,
    ButtonGroup,
    RangeControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.editor;

class ButtonBlock extends Component {
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
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            align,
            count,
            gap,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'button_wrapper' );

        className = classnames(
            'ghostkit-button-wrapper',
            gap ? `ghostkit-button-wrapper-gap-${ gap }` : false,
            align && align !== 'none' ? `ghostkit-button-wrapper-align-${ align }` : false,
            className
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-button-wrapper-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

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
                        <RangeControl
                            label={ __( 'Buttons' ) }
                            value={ count }
                            onChange={ ( value ) => setAttributes( { count: value } ) }
                            min={ 1 }
                            max={ 5 }
                        />
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
                            allowedBlocks={ [ 'ghostkit/button-single' ] }
                        />
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

const blockAttributes = {
    variant: {
        type: 'string',
        default: 'default',
    },
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

    icon: elementIcon,

    category: 'ghostkit',

    keywords: [
        __( 'btn' ),
        __( 'button' ),
        __( 'ghostkit' ),
    ],

    supports: {
        html: false,
        className: false,
        anchor: true,
        ghostkitStyles: true,
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },

    attributes: blockAttributes,

    edit: ButtonBlock,

    save( props ) {
        const {
            variant,
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

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-button-wrapper-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },

    deprecated: deprecatedArray,
};
