/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __ } = wp.i18n;

const {
    TextControl,
    Button,
} = wp.components;

/**
 * Field Options Class.
 */
class FieldOptions extends Component {
    render() {
        const {
            options,
            onChange,
            multiple,
        } = this.props;

        return (
            <div className="ghostkit-field-options">
                { options.map( ( data, i ) => {
                    const fieldName = `option-${ data.value }-${ i }`;
                    return (
                        <div className="ghostkit-field-options-item" key={ fieldName }>
                            <input
                                type={ multiple ? 'checkbox' : 'radio' }
                                checked={ data.selected }
                                onClick={ () => {
                                    const newOpts = [ ...options ];

                                    newOpts[ i ].selected = ! data.selected;

                                    if ( ! multiple ) {
                                        newOpts.forEach( ( newData, k ) => {
                                            if ( i !== k ) {
                                                newOpts[ k ].selected = false;
                                            }
                                        } );
                                    }

                                    onChange( newOpts );
                                } }
                            />
                            <TextControl
                                placeholder={ __( 'Write label…', '@@text_domain' ) }
                                value={ data.value }
                                onChange={ ( newVal ) => {
                                    const newOpts = [ ...options ];

                                    newOpts[ i ].value = newVal;
                                    newOpts[ i ].label = newVal;

                                    onChange( newOpts );
                                } }
                            />
                            <Button
                                onClick={ () => {
                                    if ( 1 < options.length ) {
                                        const newOpts = [ ...options ];
                                        newOpts.splice( i, 1 );

                                        onChange( newOpts );
                                    }
                                } }
                                className="components-icon-button"
                            >
                                <svg aria-hidden="true" role="img" focusable="false" className="dashicon dashicons-trash" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M12 4h3c.6 0 1 .4 1 1v1H3V5c0-.6.5-1 1-1h3c.2-1.1 1.3-2 2.5-2s2.3.9 2.5 2zM8 4h3c-.2-.6-.9-1-1.5-1S8.2 3.4 8 4zM4 7h11l-.9 10.1c0 .5-.5.9-1 .9H5.9c-.5 0-.9-.4-1-.9L4 7z" /></svg>
                            </Button>
                        </div>
                    );
                } ) }
                <Button
                    onClick={ () => {
                        onChange(
                            [
                                ...options,
                                {
                                    value: '',
                                    label: '',
                                    selected: false,
                                },
                            ]
                        );
                    } }
                    className="components-icon-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" ariaHidden="true" focusable="false"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z" /></svg>
                    &nbsp;
                    { __( 'Add Option', '@@text_domain' ) }
                </Button>
            </div>
        );
    }
}

export default FieldOptions;
