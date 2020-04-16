/**
 * External dependencies
 */
// eslint-disable-next-line import/no-unresolved
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
                    control: ( styles, state ) => ( {
                        ...styles,
                        minHeight: 32,
                        ...state.isFocused && ! state.isDisabled ? {
                            borderColor: '#00a0d2',
                        } : {},
                        ...state.isFocused ? {
                            boxShadow: '0 0 0 1px #00a0d2',
                            '&:hover': {
                                borderColor: '#00a0d2',
                            },
                        } : {},
                    } ),
                    input: ( styles ) => ( {
                        ...styles,
                        margin: 0,
                    } ),
                    dropdownIndicator: ( styles ) => ( {
                        ...styles,
                        padding: 5,
                        svg: {
                            width: 15,
                            height: 15,
                        },
                    } ),
                    clearIndicator: ( styles ) => ( {
                        ...styles,
                        padding: 5,
                        svg: {
                            width: 15,
                            height: 15,
                        },
                    } ),
                    multiValue: ( styles ) => ( {
                        ...styles,
                    } ),
                    multiValueLabel: ( styles ) => ( {
                        ...styles,
                        padding: 0,
                    } ),
                    multiValueRemove: ( styles ) => ( {
                        ...styles,
                        padding: 0,
                    } ),
                } }
                { ...props }
                className={ classnames( props.className, 'ghostkit-control-select' ) }
            />
        );
    }
}
