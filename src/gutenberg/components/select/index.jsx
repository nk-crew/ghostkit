/**
 * Import CSS
 */
import './editor.scss';

/**
 * External dependencies
 */
if ( ! global._babelPolyfill ) {
    require( '@babel/polyfill' );
}
import Select from 'react-select-virtualized';
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

/**
 * Component Class
 */
export default class SelectComponent extends Component {
    render() {
        const props = {
            ...this.props.grouped ? {
                groupHeaderHeight: 50,
            } : {},
            ...this.props,
        };

        return (
            <Select
                styles={ {
                    control: ( styles ) => {
                        return {
                            ...styles,
                            minHeight: 32,
                        };
                    },
                    input: ( styles ) => {
                        return {
                            ...styles,
                            margin: 0,
                        };
                    },
                    dropdownIndicator: ( styles ) => {
                        return {
                            ...styles,
                            padding: 5,
                            svg: {
                                width: 15,
                                height: 15,
                            },
                        };
                    },
                    clearIndicator: ( styles ) => {
                        return {
                            ...styles,
                            padding: 5,
                            svg: {
                                width: 15,
                                height: 15,
                            },
                        };
                    },
                    multiValue: ( styles ) => {
                        return {
                            ...styles,
                        };
                    },
                    multiValueLabel: ( styles ) => {
                        return {
                            ...styles,
                            padding: 0,
                        };
                    },
                    multiValueRemove: ( styles ) => {
                        return {
                            ...styles,
                            padding: 0,
                        };
                    },
                } }
                { ...props }
                className={ classnames( props.className, 'ghostkit-control-select' ) }
            />
        );
    }
}
