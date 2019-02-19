// Import CSS
import './editor.scss';
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    Placeholder,
    SelectControl,
} = wp.components;

const { GHOSTKIT } = window;

class WidgetizedAreaBlock extends Component {
    render() {
        const {
            setAttributes,
            attributes,
        } = this.props;

        let {
            className,
        } = this.props;

        const {
            id,
        } = attributes;

        className = classnames(
            'ghostkit-widgetized-area',
            className
        );

        return (
            <Fragment>
                <Placeholder
                    icon={ getIcon( 'block-widgetized-area', true ) }
                    label={ __( 'Widgetized Area' ) }
                    className={ className }
                >
                    <SelectControl
                        value={ id }
                        onChange={ ( value ) => setAttributes( { id: value } ) }
                        options={ ( () => {
                            const sidebars = [ {
                                label: __( '--- Select sidebar ---' ),
                                value: '',
                            } ];

                            if ( GHOSTKIT.sidebars ) {
                                Object.keys( GHOSTKIT.sidebars ).forEach( ( k ) => {
                                    sidebars.push( {
                                        label: GHOSTKIT.sidebars[ k ].name,
                                        value: GHOSTKIT.sidebars[ k ].id,
                                    } );
                                } );
                            }

                            return sidebars;
                        } )() }
                    />
                </Placeholder>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/widgetized-area';

export const settings = {
    title: __( 'Widgetized Area' ),
    description: __( 'Select registered sidebars and put it in any place.' ),
    icon: getIcon( 'block-widgetized-area' ),
    category: 'ghostkit',
    keywords: [
        __( 'widget' ),
        __( 'sidebar' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/widgetized-area/',
    },
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        id: {
            type: 'string',
        },
    },

    edit: WidgetizedAreaBlock,

    save: function() {
        return null;
    },
};
