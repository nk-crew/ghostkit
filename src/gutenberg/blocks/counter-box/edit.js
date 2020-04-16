/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import URLPicker from '../../components/url-picker';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    BaseControl,
    PanelBody,
    TextControl,
    RangeControl,
    ToggleControl,
    TabPanel,
    Toolbar,
    ColorIndicator,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    RichText,
} = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className = '' } = this.props;

        const {
            number,
            animateInViewport,
            animateInViewportFrom,
            numberPosition,
            numberSize,
            showContent,
            numberColor,
            hoverNumberColor,
            url,
            target,
            rel,
        } = attributes;

        className = classnames( 'ghostkit-counter-box', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Number Size', '@@text_domain' ) }
                            value={ numberSize }
                            onChange={ ( value ) => setAttributes( { numberSize: value } ) }
                            min={ 20 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <BaseControl
                            label={ __( 'Number Position', '@@text_domain' ) }
                        >
                            <Toolbar controls={ [
                                {
                                    icon: 'align-center',
                                    title: __( 'Top', '@@text_domain' ),
                                    onClick: () => setAttributes( { numberPosition: 'top' } ),
                                    isActive: 'top' === numberPosition,
                                },
                                {
                                    icon: 'align-left',
                                    title: __( 'Left', '@@text_domain' ),
                                    onClick: () => setAttributes( { numberPosition: 'left' } ),
                                    isActive: 'left' === numberPosition,
                                },
                                {
                                    icon: 'align-right',
                                    title: __( 'Right', '@@text_domain' ),
                                    onClick: () => setAttributes( { numberPosition: 'right' } ),
                                    isActive: 'right' === numberPosition,
                                },
                            ] }
                            />
                        </BaseControl>
                    </PanelBody>
                    <PanelBody>
                        <ToggleControl
                            label={ __( 'Animate in viewport', '@@text_domain' ) }
                            checked={ !! animateInViewport }
                            onChange={ ( val ) => setAttributes( { animateInViewport: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show Content', '@@text_domain' ) }
                            checked={ !! showContent }
                            onChange={ ( val ) => setAttributes( { showContent: val } ) }
                        />
                        { animateInViewport ? (
                            <TextControl
                                label={ __( 'Animate from', '@@text_domain' ) }
                                type="number"
                                value={ animateInViewportFrom }
                                onChange={ ( value ) => setAttributes( { animateInViewportFrom: parseInt( value, 10 ) } ) }
                            />
                        ) : '' }
                    </PanelBody>
                    <PanelBody
                        title={ (
                            <Fragment>
                                { __( 'Colors', '@@text_domain' ) }
                                <ColorIndicator colorValue={ numberColor } />
                            </Fragment>
                        ) }
                        initialOpen={ false }
                    >
                        <TabPanel
                            className="ghostkit-control-tabs ghostkit-control-tabs-wide"
                            tabs={ [
                                {
                                    name: 'normal',
                                    title: __( 'Normal', '@@text_domain' ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'hover',
                                    title: __( 'Hover', '@@text_domain' ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                            ] }
                        >
                            {
                                ( tabData ) => {
                                    const isHover = 'hover' === tabData.name;
                                    return (
                                        <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverNumberColor' : 'numberColor' } props={ this.props }>
                                            <ColorPicker
                                                label={ __( 'Color', '@@text_domain' ) }
                                                value={ isHover ? hoverNumberColor : numberColor }
                                                onChange={ ( val ) => setAttributes( isHover ? { hoverNumberColor: val } : { numberColor: val } ) }
                                                alpha
                                            />
                                        </ApplyFilters>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <URLPicker
                    url={ url }
                    rel={ rel }
                    target={ target }
                    onChange={ ( data ) => {
                        setAttributes( data );
                    } }
                    isSelected={ isSelected }
                    toolbarSettings
                    inspectorSettings
                />
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: 'align-center',
                            title: __( 'Number Position Top', '@@text_domain' ),
                            onClick: () => setAttributes( { numberPosition: 'top' } ),
                            isActive: 'top' === numberPosition,
                        },
                        {
                            icon: 'align-left',
                            title: __( 'Number Position Left', '@@text_domain' ),
                            onClick: () => setAttributes( { numberPosition: 'left' } ),
                            isActive: 'left' === numberPosition,
                        },
                        {
                            icon: 'align-right',
                            title: __( 'Number Position Right', '@@text_domain' ),
                            onClick: () => setAttributes( { numberPosition: 'right' } ),
                            isActive: 'right' === numberPosition,
                        },
                    ] }
                    />
                </BlockControls>
                <div className={ className }>
                    <div className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition || 'left' }` }>
                        <RichText
                            tagName="div"
                            className="ghostkit-counter-box-number-wrap"
                            placeholder={ __( 'Write number…', '@@text_domain' ) }
                            value={ number }
                            onChange={ ( value ) => setAttributes( { number: value } ) }
                            withoutInteractiveFormatting
                            keepPlaceholderOnFocus
                        />
                    </div>
                    { showContent ? (
                        <div className="ghostkit-counter-box-content">
                            <InnerBlocks
                                template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important counts, that you should know!', '@@text_domain' ) } ] ] }
                                templateLock={ false }
                            />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
