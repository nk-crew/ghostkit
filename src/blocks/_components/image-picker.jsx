import classnames from 'classnames/dedupe';

// Import CSS
import './image-picker.scss';

const { Component } = wp.element;

const {
    BaseControl,
} = wp.components;

export default class ImagePicker extends Component {
    render() {
        const {
            value,
            options,
            onChange,
            label,
        } = this.props;

        return (
            <BaseControl
                label={ label }
                className="ghostkit-component-image-picker"
            >
                { options.map( ( option ) => {
                    return (
                        <button
                            key={ `image-pircker-${ option.value }` }
                            onClick={ () => {
                                onChange( option.value );
                            } }
                            className={ classnames( 'ghostkit-component-image-picker-item', value === option.value ? 'ghostkit-component-image-picker-item-active' : '' ) }
                        >
                            { option.image && typeof option.image === 'string' ? (
                                <img src={ option.image } alt={ option.label || option.value } />
                            ) : '' }
                            { option.image && typeof option.image !== 'string' ? (
                                option.image
                            ) : '' }
                            { option.label ? (
                                <span>{ option.label }</span>
                            ) : '' }
                        </button>
                    );
                } ) }
            </BaseControl>
        );
    }
}
