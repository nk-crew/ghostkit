/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    Placeholder,
    SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

const { GHOSTKIT } = window;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
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
                    icon={ getIcon( 'block-widgetized-area' ) }
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

export default BlockEdit;
