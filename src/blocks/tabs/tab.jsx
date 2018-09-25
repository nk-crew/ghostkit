// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/tabs.svg';

const { GHOSTKIT } = window;

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

        const availableVariants = GHOSTKIT.getVariants( 'tabs_tab' );

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

export const name = 'ghostkit/tabs-tab';

export const settings = {
    title: __( 'Tab' ),
    parent: [ 'ghostkit/tabs' ],
    description: __( 'A single tab within a tabs block.' ),
    icon: elementIcon,
    category: 'ghostkit',
    supports: {
        html: false,
        className: false,
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
        tabNumber: {
            type: 'number',
        },
    },

    edit: TabBlock,

    getEditWrapperProps( attributes ) {
        return { 'data-tab': attributes.tabNumber };
    },

    save: function( { attributes } ) {
        const {
            variant,
            tabNumber,
        } = attributes;

        let {
            className,
        } = attributes;

        className = classnames( className, 'ghostkit-tab' );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-tab-variant-${ variant }` );
        }

        return (
            <div className={ className } data-tab={ tabNumber }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
