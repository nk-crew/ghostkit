/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import slugify from 'slugify';
import striptags from 'striptags';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    BaseControl,
    IconButton,
    Tooltip,
} = wp.components;

const {
    RichText,
    InspectorControls,
    InnerBlocks,
    BlockControls,
    AlignmentToolbar,
} = wp.blockEditor;

const {
    compose,
} = wp.compose;

const {
    withSelect,
    withDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import RemoveButton from '../../components/remove-button';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
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
            newSlug = slugify( `tab-${ striptags( newTitle ) }${ i ? `-${ i }` : '' }`, {
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
            isSelectedBlockInRoot,
            block,
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

        let buttonsAlignValForControl = buttonsAlign;
        if ( buttonsAlignValForControl === 'start' ) {
            buttonsAlignValForControl = 'left';
        } else if ( buttonsAlignValForControl === 'end' ) {
            buttonsAlignValForControl = 'right';
        }

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={ buttonsAlignValForControl }
                        onChange={ ( value ) => {
                            if ( value === 'left' ) {
                                value = 'start';
                            } else if ( value === 'right' ) {
                                value = 'end';
                            }
                            setAttributes( { buttonsAlign: value } );
                        } }
                        controls={ [ 'left', 'center', 'right' ] }
                    />
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        <BaseControl label={ __( 'Tabs Align' ) }>
                            <AlignmentToolbar
                                value={ buttonsAlignValForControl }
                                onChange={ ( value ) => {
                                    if ( value === 'left' ) {
                                        value = 'start';
                                    } else if ( value === 'right' ) {
                                        value = 'end';
                                    }
                                    setAttributes( { buttonsAlign: value } );
                                } }
                                controls={ [ 'left', 'center', 'right' ] }
                            />
                        </BaseControl>
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
                                    <div
                                        className={ classnames( 'ghostkit-tabs-buttons-item', selected ? 'ghostkit-tabs-buttons-item-active' : '' ) }
                                        key={ `tab_button_${ i }` }
                                    >
                                        <RichText
                                            tagName="span"
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
                                        />
                                        <RemoveButton
                                            show={ isSelectedBlockInRoot }
                                            tooltipText={ __( 'Remove tab?' ) }
                                            onRemove={ () => {
                                                if ( block.innerBlocks.length <= 1 ) {
                                                    this.props.removeBlock( block.clientId );
                                                } else if ( block.innerBlocks[ i ] ) {
                                                    this.props.removeBlock( block.innerBlocks[ i ].clientId );

                                                    if ( tabsData[ i ] ) {
                                                        const newTabsData = Object.assign( [], tabsData );
                                                        newTabsData.splice( i, 1 );

                                                        setAttributes( {
                                                            tabsData: newTabsData,
                                                        } );
                                                    }
                                                }
                                            } }
                                        />
                                    </div>
                                );
                            } )
                        }
                        { isSelectedBlockInRoot ? (
                            <Tooltip text={ __( 'Add Tab' ) }>
                                <IconButton
                                    icon={ 'insert' }
                                    onClick={ () => {
                                        const newTabsData = [];
                                        const newDataLength = tabsData.length + 1;

                                        for ( let k = 0; k < newDataLength; k += 1 ) {
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
                                />
                            </Tooltip>
                        ) : '' }
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

export default compose( [
    withSelect( ( select, ownProps ) => {
        const {
            getBlock,
            isBlockSelected,
            hasSelectedInnerBlock,
        } = select( 'core/block-editor' );

        const { clientId } = ownProps;

        return {
            block: getBlock( clientId ),
            isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
        };
    } ),
    withDispatch( ( dispatch ) => {
        const {
            updateBlockAttributes,
            removeBlock,
        } = dispatch( 'core/block-editor' );

        return {
            updateBlockAttributes,
            removeBlock,
        };
    } ),
] )( BlockEdit );
