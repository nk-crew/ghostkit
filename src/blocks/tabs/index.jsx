// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import slugify from 'slugify';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
} = wp.components;

const {
    RichText,
    InspectorControls,
    InnerBlocks,
} = wp.editor;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    compose,
} = wp.compose;

class TabsBlockEdit extends Component {
    constructor() {
        super( ...arguments );

        this.getTabsTemplate = this.getTabsTemplate.bind( this );
        this.getTabs = this.getTabs.bind( this );
        this.isUniqueSlug = this.isUniqueSlug.bind( this );
        this.getUniqueSlug = this.getUniqueSlug.bind( this );
    }

    /**
     * Returns the layouts configuration for a given number of tabs.
     *
     * @param {number} attributes tabs attributes.
     *
     * @return {Object[]} Tabs layout configuration.
     */
    getTabsTemplate() {
        const {
            tabsData = [],
        } = this.props.attributes;
        const result = [];

        tabsData.forEach( ( tabData ) => {
            result.push( [ 'ghostkit/tabs-tab-v2', tabData ] );
        } );

        return result;
    }

    getTabs() {
        return this.props.block.innerBlocks;
    }

    isUniqueSlug( slug, ignoreClientId ) {
        const tabs = this.getTabs();
        let isUnique = true;

        tabs.forEach( ( tabProps ) => {
            if ( tabProps.clientId !== ignoreClientId && tabProps.attributes.slug === slug ) {
                isUnique = false;
            }
        } );

        return isUnique;
    }

    getUniqueSlug( newTitle, tabData ) {
        let newSlug = '';
        let i = 0;

        while ( ! newSlug || ! this.isUniqueSlug( newSlug, tabData.clientId ) ) {
            if ( newSlug ) {
                i += 1;
            }
            newSlug = slugify( `tab-${ newTitle }${ i ? `-${ i }` : '' }`, {
                replacement: '-',
                lower: true,
            } );
        }

        return newSlug;
    }

    render() {
        const {
            attributes,
            setAttributes,
            updateBlockAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            tabActive,
            buttonsAlign,
            tabsData = [],
        } = attributes;

        const tabs = this.getTabs();

        className = classnames(
            className,
            'ghostkit-tabs'
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Tabs' ) }
                            value={ tabsData.length }
                            onChange={ ( value ) => {
                                const newTabsData = [];

                                for ( let k = 0; k < value; k += 1 ) {
                                    if ( tabsData[ k ] ) {
                                        newTabsData.push( tabsData[ k ] );
                                    } else {
                                        newTabsData.push( {
                                            slug: `tab-${ k + 1 }`,
                                            title: `Tab ${ k + 1 }`,
                                        } );
                                    }
                                }

                                setAttributes( { tabsData: newTabsData } );
                            } }
                            min={ 1 }
                            max={ 6 }
                        />
                        <SelectControl
                            label={ __( 'Tabs align' ) }
                            value={ buttonsAlign }
                            options={ [
                                {
                                    value: 'start',
                                    label: __( 'Start' ),
                                }, {
                                    value: 'center',
                                    label: __( 'Center' ),
                                }, {
                                    value: 'end',
                                    label: __( 'End' ),
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { buttonsAlign: value } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className } data-tab-active={ tabActive }>
                    <div className={ classnames( 'ghostkit-tabs-buttons', `ghostkit-tabs-buttons-align-${ buttonsAlign }` ) }>
                        {
                            tabsData.map( ( tabData, i ) => {
                                const {
                                    slug,
                                    title,
                                } = tabData;
                                const selected = tabActive === slug;

                                return (
                                    <RichText
                                        tagName="div"
                                        className={ classnames( 'ghostkit-tabs-buttons-item', selected ? 'ghostkit-tabs-buttons-item-active' : '' ) }
                                        placeholder={ __( 'Tab label' ) }
                                        value={ title }
                                        unstableOnFocus={ () => setAttributes( { tabActive: slug } ) }
                                        onChange={ ( value ) => {
                                            if ( tabs[ i ] ) {
                                                const newSlug = this.getUniqueSlug( value, tabs[ i ] );
                                                const newTabsData = tabsData.map( ( oldTabData, newIndex ) => {
                                                    if ( i === newIndex ) {
                                                        return {
                                                            ...oldTabData,
                                                            ...{
                                                                title: value,
                                                                slug: newSlug,
                                                            },
                                                        };
                                                    }

                                                    return oldTabData;
                                                } );

                                                setAttributes( {
                                                    tabActive: newSlug,
                                                    tabsData: newTabsData,
                                                } );
                                                updateBlockAttributes( tabs[ i ].clientId, {
                                                    slug: newSlug,
                                                } );
                                            }
                                        } }
                                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                        keepPlaceholderOnFocus
                                        key={ `tab_button_${ i }` }
                                    />
                                );
                            } )
                        }
                    </div>
                    <div className="ghostkit-tabs-content">
                        <InnerBlocks
                            template={ this.getTabsTemplate() }
                            templateLock="all"
                            allowedBlocks={ [ 'ghostkit/tabs-tab-v2' ] }
                        />
                    </div>
                </div>
                <style>
                    { `
                    [data-block="${ this.props.clientId }"] > .ghostkit-tabs > .ghostkit-tabs-content > .editor-inner-blocks > .editor-block-list__layout [data-tab="${ tabActive }"] {
                        display: block;
                    }
                    ` }
                </style>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/tabs-v2';

export const settings = {
    title: __( 'Tabs' ),
    description: __( 'Separate content on the tabs with titles.' ),
    icon: getIcon( 'block-tabs' ),
    category: 'ghostkit',
    keywords: [
        __( 'tabs' ),
        __( 'tab' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/tabs/',
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
        tabActive: {
            type: 'string',
            default: 'tab-1',
        },
        buttonsAlign: {
            type: 'string',
            default: 'start',
        },

        // as we can't access innerBlocks array in save() function,
        // we need this attribute to get tabs slug and titles
        tabsData: {
            type: 'array',
            default: [
                {
                    slug: 'tab-1',
                    title: 'Tab 1',
                },
                {
                    slug: 'tab-2',
                    title: 'Tab 2',
                },
            ],
        },
    },

    edit: compose( [
        withSelect( ( select, ownProps ) => {
            const {
                getBlock,
            } = select( 'core/editor' );

            const { clientId } = ownProps;

            return {
                block: getBlock( clientId ),
            };
        } ),
        withDispatch( ( dispatch ) => {
            const {
                updateBlockAttributes,
            } = dispatch( 'core/editor' );

            return {
                updateBlockAttributes,
            };
        } ),
    ] )( TabsBlockEdit ),

    save( props ) {
        const {
            tabActive,
            buttonsAlign,
            tabsData = [],
        } = props.attributes;

        let className = 'ghostkit-tabs';

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className } data-tab-active={ tabActive }>
                <div className={ classnames( 'ghostkit-tabs-buttons', `ghostkit-tabs-buttons-align-${ buttonsAlign }` ) }>
                    {
                        tabsData.map( ( tabData ) => {
                            return (
                                <RichText.Content
                                    tagName="a"
                                    href={ `#${ tabData.slug }` }
                                    className="ghostkit-tabs-buttons-item"
                                    key={ `tab_button_${ tabData.slug }` }
                                    value={ tabData.title }
                                />
                            );
                        } )
                    }
                </div>
                <div className="ghostkit-tabs-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
