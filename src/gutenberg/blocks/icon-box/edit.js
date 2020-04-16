/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
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
            icon,
            iconPosition,
            iconSize,
            showContent,
            iconColor,
            hoverIconColor,
            url,
            target,
            rel,
        } = attributes;

        className = classnames( 'ghostkit-icon-box', className );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon', '@@text_domain' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        { icon ? (
                            <Fragment>
                                <RangeControl
                                    label={ __( 'Icon Size', '@@text_domain' ) }
                                    value={ iconSize }
                                    onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                                    min={ 20 }
                                    max={ 100 }
                                    beforeIcon="editor-textcolor"
                                    afterIcon="editor-textcolor"
                                />
                                <BaseControl
                                    label={ __( 'Icon Position', '@@text_domain' ) }
                                >
                                    <Toolbar controls={ [
                                        {
                                            icon: 'align-center',
                                            title: __( 'Top', '@@text_domain' ),
                                            onClick: () => setAttributes( { iconPosition: 'top' } ),
                                            isActive: 'top' === iconPosition,
                                        },
                                        {
                                            icon: 'align-left',
                                            title: __( 'Left', '@@text_domain' ),
                                            onClick: () => setAttributes( { iconPosition: 'left' } ),
                                            isActive: 'left' === iconPosition,
                                        },
                                        {
                                            icon: 'align-right',
                                            title: __( 'Right', '@@text_domain' ),
                                            onClick: () => setAttributes( { iconPosition: 'right' } ),
                                            isActive: 'right' === iconPosition,
                                        },
                                    ] }
                                    />
                                </BaseControl>
                            </Fragment>
                        ) : '' }
                        { ! showContent || icon ? (
                            <ToggleControl
                                label={ __( 'Show Content', '@@text_domain' ) }
                                checked={ !! showContent }
                                onChange={ ( val ) => setAttributes( { showContent: val } ) }
                            />
                        ) : '' }
                    </PanelBody>
                    <PanelBody
                        title={ (
                            <Fragment>
                                { __( 'Colors', '@@text_domain' ) }
                                <ColorIndicator colorValue={ iconColor } />
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
                                        <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverIconColor' : 'iconColor' } props={ this.props }>
                                            <ColorPicker
                                                label={ __( 'Icon', '@@text_domain' ) }
                                                value={ isHover ? hoverIconColor : iconColor }
                                                onChange={ ( val ) => setAttributes( isHover ? { hoverIconColor: val } : { iconColor: val } ) }
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
                { icon ? (
                    <BlockControls>
                        <Toolbar controls={ [
                            {
                                icon: 'align-center',
                                title: __( 'Icon Position Top', '@@text_domain' ),
                                onClick: () => setAttributes( { iconPosition: 'top' } ),
                                isActive: 'top' === iconPosition,
                            },
                            {
                                icon: 'align-left',
                                title: __( 'Icon Position Left', '@@text_domain' ),
                                onClick: () => setAttributes( { iconPosition: 'left' } ),
                                isActive: 'left' === iconPosition,
                            },
                            {
                                icon: 'align-right',
                                title: __( 'Icon Position Right', '@@text_domain' ),
                                onClick: () => setAttributes( { iconPosition: 'right' } ),
                                isActive: 'right' === iconPosition,
                            },
                        ] }
                        />
                    </BlockControls>
                ) : '' }
                <div className={ className }>
                    { icon ? (
                        <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition || 'left' }` }>
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
                    { showContent ? (
                        <div className="ghostkit-icon-box-content">
                            <InnerBlocks
                                template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important icons, that you should see!', '@@text_domain' ) } ] ] }
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
