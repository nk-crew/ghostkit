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
    RangeControl,
    ToggleControl,
    Toolbar,
    DropdownMenu,
    TabPanel,
    ColorIndicator,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ApplyFilters from '../../components/apply-filters';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            color,
            hoverColor,
            icon,
            iconSize,
            hideButton,
        } = attributes;

        className = classnames( 'ghostkit-alert', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <Toolbar>
                        <DropdownMenu
                            icon="info"
                            label={ __( 'Type', '@@text_domain' ) }
                            controls={ [
                                {
                                    title: __( 'Primary', '@@text_domain' ),
                                    icon: 'editor-help',
                                    onClick: () => setAttributes( { color: '#2E77C3' } ),
                                },
                                {
                                    title: __( 'Success', '@@text_domain' ),
                                    icon: 'marker',
                                    onClick: () => setAttributes( { color: '#22CF6E' } ),
                                },
                                {
                                    title: __( 'Danger', '@@text_domain' ),
                                    icon: 'dismiss',
                                    onClick: () => setAttributes( { color: '#DC3232' } ),
                                },
                                {
                                    title: __( 'Warning', '@@text_domain' ),
                                    icon: 'warning',
                                    onClick: () => setAttributes( { color: '#E47F3B' } ),
                                },
                                {
                                    title: __( 'Info', '@@text_domain' ),
                                    icon: 'info',
                                    onClick: () => setAttributes( { color: '#2DC7E8' } ),
                                },
                            ] }
                        />
                    </Toolbar>
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon', '@@text_domain' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Icon Size', '@@text_domain' ) }
                            value={ iconSize }
                            onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                            min={ 20 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                    </PanelBody>
                    <PanelBody>
                        <ToggleControl
                            label={ __( 'Dismiss button', '@@text_domain' ) }
                            checked={ !! hideButton }
                            onChange={ ( val ) => setAttributes( { hideButton: val } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors', '@@text_domain' ) }
                            <ColorIndicator colorValue={ color } />
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
                                        <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                            <ColorPicker
                                                label={ __( 'Color', '@@text_domain' ) }
                                                value={ isHover ? hoverColor : color }
                                                onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                alpha={ true }
                                            />
                                        </ApplyFilters>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { icon ? (
                        <div className="ghostkit-alert-icon">
                            <IconPicker.Dropdown
                                onChange={ ( value ) => setAttributes( { icon: value } ) }
                                value={ icon }
                                renderToggle={ ( { onToggle } ) => (
                                    <IconPicker.Preview
                                        onClick={ onToggle }
                                        name={ icon }
                                    />
                                ) }
                            />
                        </div>
                    ) : '' }
                    <div className="ghostkit-alert-content">
                        <InnerBlocks
                            template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important message, that you cannot miss!', '@@text_domain' ) } ] ] }
                            templateLock={ false }
                        />
                    </div>
                    { hideButton ? (
                        <div className="ghostkit-alert-hide-button">
                            <span className="fas fa-times" />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
