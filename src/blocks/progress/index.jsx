// External Dependencies.
import ResizableBox from 're-resizable';
import classnames from 'classnames/dedupe';
import deepAssign from 'deep-assign';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/progress.svg';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

import ColorPicker from '../_components/color-picker.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    ColorIndicator,
    TabPanel,
} = wp.components;

const {
    InspectorControls,
    RichText,
} = wp.editor;

class ProgressBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            toggleSelection,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
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
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'progress' );

        className = classnames( 'ghostkit-progress', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-progress-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

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
                            label={ __( 'Height' ) }
                            value={ height || '' }
                            onChange={ ( value ) => setAttributes( { height: value } ) }
                            min={ 5 }
                            max={ 20 }
                        />
                        <RangeControl
                            label={ __( 'Percent' ) }
                            value={ percent || '' }
                            onChange={ ( value ) => setAttributes( { percent: value } ) }
                            min={ 0 }
                            max={ 100 }
                        />
                        <RangeControl
                            label={ __( 'Corner Radius' ) }
                            value={ borderRadius }
                            min="0"
                            max="10"
                            onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show Count' ) }
                            checked={ !! showCount }
                            onChange={ ( val ) => setAttributes( { showCount: val } ) }
                        />
                        { showCount ? (
                            <Fragment>
                                <TextControl
                                    label={ __( 'Count Prefix' ) }
                                    value={ countPrefix }
                                    onChange={ ( value ) => setAttributes( { countPrefix: value } ) }
                                />
                                <TextControl
                                    label={ __( 'Count Suffix' ) }
                                    value={ countSuffix }
                                    onChange={ ( value ) => setAttributes( { countSuffix: value } ) }
                                />
                            </Fragment>
                        ) : '' }
                        <ToggleControl
                            label={ __( 'Striped' ) }
                            checked={ !! striped }
                            onChange={ ( val ) => setAttributes( { striped: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Animate in viewport' ) }
                            checked={ !! animateInViewport }
                            onChange={ ( val ) => setAttributes( { animateInViewport: val } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ color } />
                            <ColorIndicator colorValue={ backgroundColor } />
                        </Fragment>
                    ) } initialOpen={ false }>
                        <TabPanel
                            className="ghostkit-control-tabs"
                            tabs={ [
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
                            ] }>
                            {
                                ( tabData ) => {
                                    const isHover = tabData.name === 'hover';
                                    return (
                                        <Fragment>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverColor' : 'color' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Bar' ) }
                                                    value={ isHover ? hoverColor : color }
                                                    onChange={ ( val ) => setAttributes( isHover ? { hoverColor: val } : { color: val } ) }
                                                    alpha={ true }
                                                />
                                            </ApplyFilters>
                                            <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverBackgroundColor' : 'backgroundColor' } props={ this.props }>
                                                <ColorPicker
                                                    label={ __( 'Background' ) }
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
                            tagName="small"
                            placeholder={ __( 'Write caption…' ) }
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
                        className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }
                        size={ {
                            width: '100%',
                            height,
                        } }
                        minWidth="0%"
                        maxWidth="100%"
                        minHeight="5"
                        maxHeight="20"
                        enable={ { top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
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
                        <ResizableBox
                            className="ghostkit-progress-bar"
                            size={ {
                                width: `${ percent }%`,
                            } }
                            minWidth="0%"
                            maxWidth="100%"
                            minHeight="100%"
                            maxHeight="100%"
                            enable={ { top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
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
                    </ResizableBox>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/progress';

export const settings = {
    title: __( 'Progress' ),
    description: __( 'Show the progress of your work, skills or earnings.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'progress' ),
        __( 'bar' ),
        __( 'ghostkit' ),
    ],
    ghostkitAttrs: {
        previewUrl: 'https://ghostkit.io/blocks/progress/',
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-progress-wrap': {
                    height: attributes.height,
                    borderRadius: attributes.borderRadius,
                    backgroundColor: attributes.backgroundColor,
                    '.ghostkit-progress-bar': {
                        width: attributes.percent + '%',
                        backgroundColor: attributes.color,
                    },
                },
            };

            if ( attributes.hoverColor ) {
                styles[ '&:hover' ] = {
                    '.ghostkit-progress-wrap': {
                        '.ghostkit-progress-bar': {
                            backgroundColor: attributes.hoverColor,
                        },
                    },
                };
            }
            if ( attributes.hoverBackgroundColor ) {
                styles[ '&:hover' ] = deepAssign( styles[ '&:hover' ] || {}, {
                    '.ghostkit-progress-wrap': {
                        backgroundColor: attributes.hoverBackgroundColor,
                    },
                } );
            }

            return styles;
        },
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        caption: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-progress-caption',
            default: 'Progress Caption',
        },
        height: {
            type: 'number',
            default: 15,
        },
        percent: {
            type: 'number',
            default: 75,
        },
        borderRadius: {
            type: 'number',
            default: 2,
        },
        striped: {
            type: 'boolean',
            default: true,
        },
        animateInViewport: {
            type: 'boolean',
            default: false,
        },
        showCount: {
            type: 'boolean',
            default: false,
        },
        countPrefix: {
            type: 'string',
            default: '',
        },
        countSuffix: {
            type: 'string',
            default: '%',
        },
        color: {
            type: 'string',
            default: '#0366d6',
        },
        backgroundColor: {
            type: 'string',
            default: '#f3f4f5',
        },
        hoverColor: {
            type: 'string',
        },
        hoverBackgroundColor: {
            type: 'string',
        },
    },

    edit: ProgressBlock,

    save: function( props ) {
        const {
            caption,
            height,
            percent,
            striped,
            showCount,
            countPrefix,
            countSuffix,
            animateInViewport,
            variant,
        } = props.attributes;

        let className = 'ghostkit-progress';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-progress-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                { ! RichText.isEmpty( caption ) ? (
                    <RichText.Content
                        tagName="small"
                        className="ghostkit-progress-caption"
                        value={ caption }
                    />
                ) : '' }
                { showCount ? (
                    <div className="ghostkit-progress-bar-count" style={ { width: `${ percent }%` } }>
                        <div>
                            <span>{ countPrefix }</span>
                            <span>{ percent }</span>
                            <span>{ countSuffix }</span>
                        </div>
                    </div>
                ) : '' }
                <div className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }>
                    <div className={ classnames( 'ghostkit-progress-bar', animateInViewport ? 'ghostkit-count-up' : '' ) } role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } aria-valuenow={ percent } aria-valuemin="0" aria-valuemax="100" />
                </div>
            </div>
        );
    },

    deprecated: deprecatedArray,
};
