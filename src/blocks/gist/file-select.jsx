const { jQuery } = window;
const { Component } = wp.element;

const { __ } = wp.i18n;

const {
    SelectControl,
    DropdownMenu,
} = wp.components;

const cache = {};

class GistFilesSelect extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            error: null,
            isLoaded: false,
            items: [ '' ],
        };
        this.updateState = this.updateState.bind( this );
        this.onUpdate = this.onUpdate.bind( this );
    }
    componentDidMount() {
        this.onUpdate();
    }
    componentDidUpdate() {
        this.onUpdate();
    }
    updateState( data ) {
        const {
            items,
        } = this.state;

        if ( items.toString() !== data.items.toString() ) {
            this.setState( data );
        }
    }

    onUpdate() {
        let { url } = this.props;
        const updateState = this.updateState.bind( this );

        const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec( url );

        if ( match && typeof match[ 1 ] !== 'undefined' ) {
            url = `https://gist.github.com/${ match[ 1 ].split( '#' )[ 0 ] }.json`;
        } else {
            return;
        }

        // request the json version of this gist
        jQuery.ajax( {
            url: url,
            // data: data,
            dataType: 'jsonp',
            timeout: 20000,
            beforeSend() {
                if ( cache[ url ] ) {
                    // loading the response from cache and preventing the ajax call
                    cache[ url ].then( function( response ) {
                        updateState( {
                            items: [ '' ].concat( response.files ),
                        } );
                    }, () => {
                        updateState( {
                            items: [ '' ],
                        } );
                    } );
                    return false;
                }

                // saving the promise for the requested json as a proxy for the actual response
                cache[ url ] = jQuery.Deferred();
            },
            success( response ) {
                if ( cache[ url ] ) {
                    cache[ url ].resolve( response );
                }
                updateState( {
                    items: [ '' ].concat( response.files ),
                } );
            },
            error() {
                updateState( {
                    items: [ '' ],
                } );
            },
        } );
    }

    render() {
        const {
            label,
            value,
            onChange,
            isToolbar,
            className,
        } = this.props;

        const {
            items,
        } = this.state;

        return (
            isToolbar ? (
                <DropdownMenu
                    icon={ 'media-default' }
                    label={ label }
                    controls={ items.map( ( item ) => ( {
                        title: item || __( 'Show all files' ),
                        isActive: item === value,
                        onClick: () => onChange( item ),
                    } ) ) }
                    className={ className }
                />
            ) : (
                <SelectControl
                    label={ label }
                    value={ value }
                    options={ items.map( ( item ) => ( {
                        value: item,
                        label: item || __( 'Show all files' ),
                    } ) ) }
                    onChange={ onChange }
                    className={ className }
                />
            )
        );
    }
}

export default GistFilesSelect;
