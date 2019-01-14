// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/block-tabs.svg';

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

class TabBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let {
            className = '',
        } = this.props;

        const {
            ghostkitClassname,
            variant,
        } = attributes;

        className = classnames( className, 'ghostkit-tab' );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-tab-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const availableVariants = GHOSTKIT.getVariants( 'tabs_tab' );

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
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks templateLock={ false } />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/tabs-tab-v2';

export const settings = {
    title: __( 'Tab' ),
    parent: [ 'ghostkit/tabs-v2' ],
    description: __( 'A single tab within a tabs block.' ),
    icon: elementIcon,
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
        variant: {
            type: 'string',
            default: 'default',
        },
        slug: {
            type: 'string',
        },
    },

    edit: TabBlock,

    getEditWrapperProps( attributes ) {
        return { 'data-tab': attributes.slug };
    },

    save: function( props ) {
        const {
            variant,
            slug,
        } = props.attributes;

        let className = 'ghostkit-tab';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-tab-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className } data-tab={ slug }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
