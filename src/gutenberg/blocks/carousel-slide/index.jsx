// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const {
    InnerBlocks,
} = wp.editor;

const {
    withSelect,
} = wp.data;

class CarouselSlideBlock extends Component {
    render() {
        const {
            attributes,
            hasChildBlocks,
        } = this.props;

        let {
            className,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-carousel-slide'
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <div className={ className }>
                    <InnerBlocks
                        templateLock={ false }
                        renderAppender={ (
                            hasChildBlocks ?
                                undefined :
                                () => <InnerBlocks.ButtonBlockAppender />
                        ) }
                    />
                </div>
            </Fragment>
        );
    }
}

const CarouselSlideBlockWithSelect = withSelect( ( select, ownProps ) => {
    const { clientId } = ownProps;
    const blockEditor = select( 'core/block-editor' );

    return {
        hasChildBlocks: blockEditor ? blockEditor.getBlockOrder( clientId ).length > 0 : false,
    };
} )( CarouselSlideBlock );

export const name = 'ghostkit/carousel-slide';

export const settings = {
    title: __( 'Slide' ),
    parent: [ 'ghostkit/carousel' ],
    description: __( 'A single slide within a carousel block.' ),
    icon: getIcon( 'block-carousel', true ),
    category: 'ghostkit',
    ghostkit: {
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
        inserter: false,
        reusable: false,
    },
    attributes: {
    },

    edit: CarouselSlideBlockWithSelect,

    save: function( props ) {
        let className = 'ghostkit-carousel-slide';

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
