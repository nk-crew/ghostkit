// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/tabs.svg';

const { GHOSTKIT } = window;

const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
} = wp.components;

const {
    RichText,
    BlockControls,
    BlockAlignmentToolbar,
    InspectorControls,
    InnerBlocks,
} = wp.editor;

const getTabs = ( { tabsCount, tabsSettings } ) => {
    const result = [];

    for ( let k = 1; k <= tabsCount; k++ ) {
        result.push( {
            name: `ghostkit ghostkit-tab ghostkit-tab-${ k }`,
            label: tabsSettings[ 'tab_' + k ] ? tabsSettings[ 'tab_' + k ].label : sprintf( __( 'Tab %d' ), k ),
            number: k,
        } );
    }

    return result;
};

/**
 * Returns the layouts configuration for a given number of tabs.
 *
 * @param {object} attributes - block attributes.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getLayouts = ( attributes ) => {
    const result = [];

    const tabs = getTabs( attributes );
    tabs.forEach( ( tab ) => {
        result.push( {
            name: tab.name,
            label: tab.label,
            icon: 'columns',
        } );
    } );

    return result;
};

class TabsBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            tabsCount,
            tabActive,
            tabsSettings,
            buttonsAlign,
            align,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'tabs' );

        const tabs = getTabs( attributes );

        className = classnames(
            className,
            `ghostkit-tabs-active-${ tabActive }`
        );

        return (
            <Fragment>
                <BlockControls>
                    <BlockAlignmentToolbar
                        controls={ [ 'wide', 'full' ] }
                        value={ align }
                        onChange={ ( nextAlign ) => {
                            setAttributes( { align: nextAlign } );
                        } }
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
                            label={ __( 'Tabs' ) }
                            value={ tabsCount }
                            onChange={ ( value ) => setAttributes( { tabsCount: value } ) }
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
                <div className={ className }>
                    <div className={ classnames( 'ghostkit-tabs-buttons', `ghostkit-tabs-buttons-align-${ buttonsAlign }` ) }>
                        {
                            tabs.map( ( val ) => {
                                const selected = tabActive === val.number;

                                return (
                                    <RichText
                                        tagName="a"
                                        data-tab={ val.number }
                                        className={ classnames( 'ghostkit-tabs-buttons-item', selected ? 'ghostkit-tabs-buttons-item-active' : '' ) }
                                        placeholder={ __( 'Tab label…' ) }
                                        value={ val.label }
                                        unstableOnFocus={ () => setAttributes( { tabActive: val.number } ) }
                                        onChange={ ( value ) => {
                                            if ( typeof tabs[ val.number - 1 ] !== 'undefined' ) {
                                                if ( typeof tabsSettings[ `tab_${ val.number }` ] === 'undefined' ) {
                                                    tabsSettings[ `tab_${ val.number }` ] = {};
                                                }
                                                tabsSettings[ `tab_${ val.number }` ].label = value;
                                                setAttributes( { tabsSettings: Object.assign( {}, tabsSettings ) } );
                                            }
                                        } }
                                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                        format="string"
                                        inlineToolbar
                                        key={ `tab_button_${ val.number }` }
                                    />
                                );
                            } )
                        }
                    </div>
                    <div className="ghostkit-tabs-content">
                        <InnerBlocks layouts={ getLayouts( attributes ) } />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/tabs';

export const settings = {
    title: __( 'Tabs' ),
    description: __( 'Tabs.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    keywords: [
        __( 'tabs' ),
        __( 'tab' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        tabsCount: {
            type: 'number',
            default: 2,
        },
        tabActive: {
            type: 'number',
            default: 1,
        },
        tabsSettings: {
            type: 'object',
            default: {},
        },
        buttonsAlign: {
            type: 'string',
            default: 'start',
        },
        align: {
            type: 'string',
        },
    },

    getEditWrapperProps( attributes ) {
        const { align } = attributes;

        return { 'data-align': align };
    },

    edit: TabsBlock,

    save: function( { attributes, className = '' } ) {
        const {
            variant,
            tabsCount,
            tabActive,
            buttonsAlign,
        } = attributes;

        className = classnames(
            className,
            `ghostkit-tabs-${ tabsCount }`,
            `ghostkit-tabs-active-${ tabActive }`
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-tabs-variant-${ variant }` );
        }

        const tabs = getTabs( attributes );

        return (
            <div className={ className }>
                <div className={ classnames( 'ghostkit-tabs-buttons', `ghostkit-tabs-buttons-align-${ buttonsAlign }` ) }>
                    {
                        tabs.map( ( val ) => {
                            return (
                                <a data-tab={ val.number } href={ `#tab-${ val.number }` } className="ghostkit-tabs-buttons-item" key={ `tab_button_${ val.number }` } >
                                    { val.label }
                                </a>
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
