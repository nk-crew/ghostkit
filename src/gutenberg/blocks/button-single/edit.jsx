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
    SelectControl,
    PanelBody,
    RangeControl,
    Button,
    ButtonGroup,
    TabPanel,
    ColorIndicator,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ApplyFilters from '../../components/apply-filters';
import URLInput from '../../components/url-input';

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
            text,
            icon,
            iconPosition,
            hideText,
            url,
            target,
            rel,
            size,
            color,
            textColor,
            borderRadius,
            borderWeight,
            borderColor,
            focusOutlineWeight,
            focusOutlineColor,
            hoverColor,
            hoverTextColor,
            hoverBorderColor,
        } = attributes;

        const sizes = {
            XS: 'xs',
            S: 'sm',
            M: 'md',
            L: 'lg',
            XL: 'xl',
        };

        className = classnames(
            'ghostkit-button',
            size ? `ghostkit-button-${ size }` : '',
            hideText ? 'ghostkit-button-icon-only' : '',
            className
        );

        // focus outline
        if ( focusOutlineWeight && focusOutlineColor ) {
            className = classnames( className, 'ghostkit-button-with-outline' );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const colorsTabs = [
            {
                name: 'normal',
                title: __( 'Normal' ),
                className: 'ghostkit-control-tabs-tab',
            },
            {
                name: 'hover',
                title: __( 'Hover' ),
                className: 'ghostkit-control-tabs-tab',
            },
        ];

        if ( focusOutlineWeight && focusOutlineColor ) {
            colorsTabs.push( {
                name: 'focus',
                title: __( 'Focus' ),
                className: 'ghostkit-control-tabs-tab',
            } );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <div className="blocks-size__main">
                            <ButtonGroup aria-label={ __( 'Size' ) }>
                                {
                                    Object.keys( sizes ).map( ( key ) =>
                                        <Button
                                            key={ key }
                                            isLarge
                                            isPrimary={ size === sizes[ key ] }
                                            aria-pressed={ size === sizes[ key ] }
                                            onClick={ () => setAttributes( { size: sizes[ key ] } ) }
                                        >
                                            { key }
                                        </Button>
                                    )
                                }
                            </ButtonGroup>
                            <Button
                                isLarge
                                onClick={ () => setAttributes( { size: 'md' } ) }
                            >
                                { __( 'Reset' ) }
                            </Button>
                        </div>
                    </PanelBody>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Corner Radius' ) }
                            value={ borderRadius }
                            min="0"
                            max="50"
                            onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Border Size' ) }
                            value={ borderWeight }
                            min="0"
                            max="6"
                            onChange={ ( value ) => setAttributes( { borderWeight: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Focus Outline Size' ) }
                            value={ focusOutlineWeight }
                            min="0"
                            max="6"
                            onChange={ ( value ) => setAttributes( { focusOutlineWeight: value } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        { icon ? (
                            <ToggleControl
                                label={ __( 'Show Icon Only' ) }
                                checked={ !! hideText }
                                onChange={ ( val ) => setAttributes( { hideText: val } ) }
                            />
                        ) : '' }
                        { icon && ! hideText ? (
                            <SelectControl
                                label={ __( 'Icon Position' ) }
                                value={ iconPosition }
                                options={ [
                                    {
                                        value: 'left',
                                        label: __( 'Left' ),
                                    }, {
                                        value: 'right',
                                        label: __( 'Right' ),
                                    },
                                ] }
                                onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
                            />
                        ) : '' }
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ color } />
                            <ColorIndicator colorValue={ textColor } />
                            { borderWeight ? (
                                <ColorIndicator colorValue={ borderColor } />
                            ) : '' }
                            { focusOutlineWeight && focusOutlineColor ? (
                                <ColorIndicator colorValue={ focusOutlineColor } />
                            ) : '' }
                        </Fragment>
                    ) } initialOpen={ false }>
                        <TabPanel
                            className="ghostkit-control-tabs"
                            tabs={ colorsTabs }>
                            {
                                ( tabData ) => {
                                    const isHover = tabData.name === 'hover';

                                    // focus tab
                                    if ( 'focus' === tabData.name ) {
                                        return (
                                            <ApplyFilters name="ghostkit.editor.controls" attribute="focusOutlineColor" props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Outline' ) }
                                                    value={ focusOutlineColor }
                                                    onChange={ ( val ) => setAttributes( { focusOutlineColor: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                        );
                                    }

                                    return (
                                        <Fragment>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Background' ) }
                                                    value={ isHover ? hoverColor : color }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverTextColor' : 'textColor' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Text' ) }
                                                    value={ isHover ? hoverTextColor : textColor }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverTextColor: val } : { textColor: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            { borderWeight ? (
                                                <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverBorderColor' : 'borderColor' } props={ this.props }>
                                                    <ColorPicker
                                                        label={ __( 'Border' ) }
                                                        value={ isHover ? hoverBorderColor : borderColor }
                                                        onChange={ ( val ) => setAttributes( isHover ? { hoverBorderColor: val } : { borderColor: val } ) }
                                                        alpha={ true }
                                                    />
                                                </ApplyFilters>
                                            ) : '' }
                                        </Fragment>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <div>
                    <div className={ className }>
                        { icon && iconPosition === 'left' ? (
                            <div className="ghostkit-button-icon ghostkit-button-icon-left">
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
                        { ! hideText ? (
                            <RichText
                                placeholder={ __( 'Add text…' ) }
                                value={ text }
                                onChange={ ( value ) => setAttributes( { text: value } ) }
                                formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                isSelected={ isSelected }
                                keepPlaceholderOnFocus
                            />
                        ) : '' }
                        { icon && iconPosition === 'right' ? (
                            <span className="ghostkit-button-icon ghostkit-button-icon-right">
                                <IconPicker.Preview name={ icon } />
                            </span>
                        ) : '' }
                    </div>
                </div>
                { isSelected ? (
                    <URLInput
                        url={ url }
                        target={ target }
                        rel={ rel }
                        onChange={ ( data ) => {
                            setAttributes( data );
                        } }
                        autoFocus={ false }
                        className="ghostkit-component-url-input-float"
                    />
                ) : '' }
            </Fragment>
        );
    }
}

export default BlockEdit;
