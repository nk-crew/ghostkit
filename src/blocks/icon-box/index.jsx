// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/icon-box.svg';

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
    InnerBlocks,
} = wp.editor;

class IconBoxBlock extends Component {
    ghostkitStyles( attributes ) {
        return {
            '.ghostkit-icon-box-icon': {
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
            icon,
            iconPosition,
            iconSize,
            iconColor,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'icon_box' );

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
                            min={ 20 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <SelectControl
                            label={ __( 'Icon Position' ) }
                            value={ iconPosition }
                            onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
                            options={ [
                                {
                                    label: __( 'Top' ),
                                    value: 'top',
                                },
                                {
                                    label: __( 'Left' ),
                                    value: 'left',
                                },
                                {
                                    label: __( 'Right' ),
                                    value: 'right',
                                },
                            ] }
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
                            className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition || 'left' }` }
                            dangerouslySetInnerHTML={ { __html: `<span class="${ icon }"></span>` } }
                        />
                    ) }
                    <div className="ghostkit-icon-box-content">
                        { /* TODO: Add default blocks when this will be possible https://github.com/WordPress/gutenberg/issues/5448 */ }
                        <InnerBlocks />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/icon-box';

export const settings = {
    title: __( 'Icon Box' ),
    description: __( 'Icon Box.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'icon' ),
        __( 'icon-box' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
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
        icon: {
            type: 'string',
            default: 'fab fa-wordpress-simple',
        },
        iconPosition: {
            type: 'string',
            default: 'left',
        },
        iconSize: {
            type: 'number',
            default: 30,
        },
        iconColor: {
            type: 'string',
            default: '#016c91',
        },
    },

    edit: IconBoxBlock,

    save: function( { attributes, className = '' } ) {
        const {
            icon,
            iconPosition,
            variant,
        } = attributes;

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-icon-box-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                { icon && (
                    <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }>
                        <span className={ icon } />
                    </div>
                ) }
                <div className="ghostkit-icon-box-content">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
};
