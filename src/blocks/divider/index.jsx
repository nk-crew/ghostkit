// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/divider.svg';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    PanelColor,
    SelectControl,
    TextControl,
} = wp.components;

const {
    InspectorControls,
    ColorPalette,
} = wp.editor;

class DividerBlock extends Component {
    ghostkitStyles( attributes ) {
        return {
            '&::before, &::after': {
                borderColor: attributes.color,
                borderWidth: attributes.size,
            },
            '.ghostkit-divider-icon': {
                fontSize: attributes.iconSize,
                color: attributes.iconColor,
            },
        };
    }

    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            type,
            size,
            color,
            icon,
            iconSize,
            iconColor,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'divider' );

        className = classnames( 'ghostkit-divider', `ghostkit-divider-type-${ type }`, className );

        if ( icon ) {
            className = classnames( className, 'ghostkit-divider-with-icon' );
        }

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
                        <SelectControl
                            label={ __( 'Type' ) }
                            value={ type }
                            options={ [
                                {
                                    value: 'solid',
                                    label: __( 'Line' ),
                                }, {
                                    value: 'dashed',
                                    label: __( 'Dashed' ),
                                }, {
                                    value: 'dotted',
                                    label: __( 'Dotted' ),
                                }, {
                                    value: 'double',
                                    label: __( 'Double' ),
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { type: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Size' ) }
                            value={ size }
                            onChange={ ( value ) => setAttributes( { size: value } ) }
                            min={ 1 }
                            max={ 7 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <PanelColor title={ __( 'Color' ) } colorValue={ color } >
                            <ColorPalette
                                value={ color }
                                onChange={ ( value ) => setAttributes( { color: value } ) }
                            />
                        </PanelColor>
                        <TextControl
                            label={ __( 'Icon' ) }
                            value={ icon }
                            help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Icon Size' ) }
                            value={ iconSize }
                            onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                            min={ 10 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <PanelColor title={ __( 'Icon Color' ) } colorValue={ iconColor } >
                            <ColorPalette
                                value={ iconColor }
                                onChange={ ( value ) => setAttributes( { iconColor: value } ) }
                            />
                        </PanelColor>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { icon && (
                        <div
                            className="ghostkit-divider-icon"
                            dangerouslySetInnerHTML={ { __html: `<span class="${ icon }"></span>` } }
                        />
                    ) }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/divider';

export const settings = {
    title: __( 'Divider' ),
    description: __( 'Content divider.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'divider' ),
        __( 'spacer' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        align: [ 'wide', 'full' ],
        className: false,
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        type: {
            type: 'string',
            default: 'solid',
        },
        size: {
            type: 'number',
            default: 2,
        },
        color: {
            type: 'string',
            default: '#a7a9ab',
        },
        icon: {
            type: 'string',
            default: '',
        },
        iconSize: {
            type: 'number',
            default: 10,
        },
        iconColor: {
            type: 'string',
            default: '#a7a9ab',
        },
    },

    edit: DividerBlock,

    save: function( { attributes, className = '' } ) {
        const {
            icon,
            type,
            variant,
        } = attributes;

        className = classnames( 'ghostkit-divider', `ghostkit-divider-type-${ type }`, className );

        if ( icon ) {
            className = classnames( className, 'ghostkit-divider-with-icon' );
        }

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-divider-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                { icon && (
                    <div className="ghostkit-divider-icon">
                        <span className={ icon } />
                    </div>
                ) }
            </div>
        );
    },
};
