// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/tabs.svg';
import deprecatedArray from './deprecated.jsx';

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
    InspectorControls,
    InnerBlocks,
} = wp.editor;

/**
 * Returns the layouts configuration for a given number of tabs.
 *
 * @param {number} attributes tabs attributes.
 *
 * @return {Object[]} Tabs layout configuration.
 */
const getTabsTemplate = ( attributes ) => {
    const {
        tabsCount,
    } = attributes;
    const result = [];

    for ( let k = 1; k <= tabsCount; k++ ) {
        result.push( [ 'ghostkit/tabs-tab', { tabNumber: k } ] );
    }

    return result;
};

const getTabs = ( { tabsCount, tabsSettings } ) => {
    const result = [];

    for ( let k = 1; k <= tabsCount; k++ ) {
        result.push( {
            label: tabsSettings[ 'tab_' + k ] ? tabsSettings[ 'tab_' + k ].label : sprintf( __( 'Tab %d' ), k ),
            number: k,
        } );
    }

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
            ghostkitClassname,
            variant,
            tabsCount,
            tabActive,
            tabsSettings,
            buttonsAlign,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'tabs' );

        const tabs = getTabs( attributes );

        className = classnames(
            className,
            'ghostkit-tabs'
        );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

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
                <div className={ className } data-tab-active={ tabActive }>
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
                                        inlineToolbar
                                        key={ `tab_button_${ val.number }` }
                                    />
                                );
                            } )
                        }
                    </div>
                    <div className="ghostkit-tabs-content">
                        <InnerBlocks
                            template={ getTabsTemplate( attributes ) }
                            templateLock="all"
                            allowedBlocks={ [ 'ghostkit/tabs-tab' ] }
                        />
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
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'tabs' ),
        __( 'tab' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
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
            'ghostkit-tabs',
            `ghostkit-tabs-${ tabsCount }`
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-tabs-variant-${ variant }` );
        }

        const tabs = getTabs( attributes );

        return (
            <div className={ className } data-tab-active={ tabActive }>
                <div className={ classnames( 'ghostkit-tabs-buttons', `ghostkit-tabs-buttons-align-${ buttonsAlign }` ) }>
                    {
                        tabs.map( ( val ) => {
                            return (
                                <RichText.Content
                                    tagName="a"
                                    data-tab={ val.number }
                                    href={ `#tab-${ val.number }` }
                                    className="ghostkit-tabs-buttons-item"
                                    key={ `tab_button_${ val.number }` }
                                    value={ val.label }
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

    deprecated: deprecatedArray,
};
