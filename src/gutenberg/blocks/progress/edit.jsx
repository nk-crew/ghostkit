/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

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
    TextControl,
    RangeControl,
    ToggleControl,
    ColorIndicator,
    TabPanel,
    ResizableBox,
} = wp.components;

const {
    InspectorControls,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import ApplyFilters from '../../components/apply-filters';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            toggleSelection,
        } = this.props;

        let { className = '' } = this.props;

        const {
            caption,
            height,
            percent,
            borderRadius,
            striped,
            animateInViewport,
            showCount,
            countPrefix,
            countSuffix,
            color,
            backgroundColor,
            hoverColor,
            hoverBackgroundColor,
        } = attributes;

        className = classnames( 'ghostkit-progress', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Height', '@@text_domain' ) }
                            value={ height || '' }
                            onChange={ ( value ) => setAttributes( { height: value } ) }
                            min={ 1 }
                            max={ 30 }
                        />
                        <RangeControl
                            label={ __( 'Percent', '@@text_domain' ) }
                            value={ percent || '' }
                            onChange={ ( value ) => setAttributes( { percent: value } ) }
                            min={ 0 }
                            max={ 100 }
                        />
                        <RangeControl
                            label={ __( 'Corner Radius', '@@text_domain' ) }
                            value={ borderRadius }
                            min={ 0 }
                            max={ 10 }
                            onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <ToggleControl
                            label={ __( 'Show Count', '@@text_domain' ) }
                            checked={ !! showCount }
                            onChange={ ( val ) => setAttributes( { showCount: val } ) }
                        />
                        { showCount ? (
                            <Fragment>
                                <TextControl
                                    label={ __( 'Count Prefix', '@@text_domain' ) }
                                    value={ countPrefix }
                                    onChange={ ( value ) => setAttributes( { countPrefix: value } ) }
                                />
                                <TextControl
                                    label={ __( 'Count Suffix', '@@text_domain' ) }
                                    value={ countSuffix }
                                    onChange={ ( value ) => setAttributes( { countSuffix: value } ) }
                                />
                            </Fragment>
                        ) : '' }
                        <ToggleControl
                            label={ __( 'Striped', '@@text_domain' ) }
                            checked={ !! striped }
                            onChange={ ( val ) => setAttributes( { striped: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Animate in viewport', '@@text_domain' ) }
                            checked={ !! animateInViewport }
                            onChange={ ( val ) => setAttributes( { animateInViewport: val } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors', '@@text_domain' ) }
                            <ColorIndicator colorValue={ color } />
                            <ColorIndicator colorValue={ backgroundColor } />
                        </Fragment>
                    ) } initialOpen={ false }>
                        <TabPanel
                            className="ghostkit-control-tabs"
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
                            ] }>
                            {
                                ( tabData ) => {
                                    const isHover = tabData.name === 'hover';
                                    return (
                                        <Fragment>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Bar', '@@text_domain' ) }
                                                    value={ isHover ? hoverColor : color }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverBackgroundColor' : 'backgroundColor' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Background', '@@text_domain' ) }
                                                    value={ isHover ? hoverBackgroundColor : backgroundColor }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverBackgroundColor: val } : { backgroundColor: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                        </Fragment>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { ( ! RichText.isEmpty( caption ) || isSelected ) ? (
                        <RichText
                            tagName="div"
                            className="ghostkit-progress-caption"
                            placeholder={ __( 'Write caption…', '@@text_domain' ) }
                            value={ caption }
                            onChange={ newCaption => setAttributes( { caption: newCaption } ) }
                        />
                    ) : '' }
                    { showCount ? (
                        <div className="ghostkit-progress-bar-count" style={ { width: `${ percent }%` } }>
                            <div>{ countPrefix }{ percent }{ countSuffix }</div>
                        </div>
                    ) : '' }
                    <ResizableBox
                        className={ classnames( { 'is-selected': isSelected } ) }
                        size={ {
                            width: '100%',
                            height,
                        } }
                        minWidth="0%"
                        maxWidth="100%"
                        minHeight="5"
                        maxHeight="30"
                        enable={ { bottom: true } }
                        onResizeStart={ () => {
                            toggleSelection( false );
                        } }
                        onResizeStop={ ( event, direction, elt, delta ) => {
                            setAttributes( {
                                height: parseInt( height + delta.height, 10 ),
                            } );
                            toggleSelection( true );
                        } }
                    >
                        <div
                            className={ classnames( {
                                'ghostkit-progress-wrap': true,
                                'ghostkit-progress-bar-striped': striped,
                            } ) }
                        >
                            <ResizableBox
                                className={ classnames( 'ghostkit-progress-bar', { 'is-selected': isSelected } ) }
                                size={ {
                                    width: `${ percent }%`,
                                } }
                                minWidth="0%"
                                maxWidth="100%"
                                minHeight="100%"
                                maxHeight="100%"
                                enable={ { right: true } }
                                onResizeStart={ () => {
                                    toggleSelection( false );
                                } }
                                onResizeStop={ ( event, direction, elt, delta ) => {
                                    setAttributes( {
                                        percent: Math.min( 100, Math.max( 0, percent + parseInt( 100 * delta.width / jQuery( elt ).parent().width(), 10 ) ) ),
                                    } );
                                    toggleSelection( true );
                                } }
                            />
                        </div>
                    </ResizableBox>
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
