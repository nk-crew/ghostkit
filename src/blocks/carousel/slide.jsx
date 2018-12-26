// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/carousel.svg';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

class CarouselSlideBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            ghostkitClassname,
            variant,
        } = attributes;

        let {
            className,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-carousel-slide'
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-carousel-slide-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const availableVariants = GHOSTKIT.getVariants( 'carousel_slide' );

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
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks templateLock={ false } />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/carousel-slide';

export const settings = {
    title: __( 'Slide' ),
    parent: [ 'ghostkit/carousel' ],
    description: __( 'A single slide within a carousel block.' ),
    icon: elementIcon,
    category: 'ghostkit',
    supports: {
        html: false,
        className: false,
        anchor: true,
        inserter: false,
        reusable: false,
        ghostkitStyles: true,
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
    },

    edit: CarouselSlideBlock,

    save: function( props ) {
        const {
            variant,
        } = props.attributes;

        let className = 'ghostkit-carousel-slide';

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-carousel-slide-variant-${ variant }` );
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
