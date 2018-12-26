const { Component } = wp.element;

const {
    TextControl,
} = wp.components;

const minDistanceToStart = 5;
const units = [ 'px', '%', 'rem', 'em', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'cm', 'mm', 'in', 'pt', 'pc', 'ch' ];
const shiftKeyMultiple = 10;

export default class InputDrag extends Component {
    constructor() {
        super( ...arguments );

        this.reset = this.reset.bind( this );
        this.mouseUp = this.mouseUp.bind( this );
        this.mouseDown = this.mouseDown.bind( this );
        this.mouseMove = this.mouseMove.bind( this );

        this.reset();
    }

    componentDidMount() {
        document.addEventListener( 'mouseup', this.mouseUp, false );
        document.addEventListener( 'mousemove', this.mouseMove, false );
    }

    componentWillUnmount() {
        document.removeEventListener( 'mouseup', this.mouseUp, false );
        document.removeEventListener( 'mousemove', this.mouseMove, false );
    }

    reset() {
        this.initialPosition = 0;
        this.initialValue = 0;
        this.initialUnit = '';
        this.initialShiftKey = 0;

        // states
        // 0 - none
        // 1 - retrieving value
        // 2 - change value
        this.dragState = 0;
    }

    mouseDown( e ) {
        this.initialPosition = {
            x: e.pageX,
            y: e.pageY,
        };
        this.initialValue = this.props.value;

        const valueNum = parseFloat( this.initialValue );

        // check if value contains units and save it.
        if ( this.initialValue !== `${ valueNum }` ) {
            const matchUnit = this.initialValue.match( new RegExp( `${ valueNum }(${ units.join( '|' ) })`, 'i' ) );

            if ( matchUnit && matchUnit[ 1 ] ) {
                this.initialUnit = matchUnit[ 1 ];
            }
        }

        if ( e.shiftKey ) {
            this.initialShiftKey = 1;
        }

        this.initialValue = valueNum;

        if ( isNaN( this.initialValue ) ) {
            this.initialValue = 0;
        }

        this.dragState = 1;
    }

    mouseUp() {
        this.reset();
    }

    mouseMove( e ) {
        switch ( this.dragState ) {
        // check for drag position
        case 1:
            if ( Math.abs( this.initialPosition.x - e.pageX ) > minDistanceToStart ) {
                this.reset();
            } else if ( Math.abs( this.initialPosition.y - e.pageY ) > minDistanceToStart ) {
                this.dragState = 2;
            }

            break;
        // change input value.
        case 2:
            e.preventDefault();
            this.props.onChange( this.initialValue + ( ( this.initialPosition.y - e.pageY ) * ( this.initialShiftKey ? shiftKeyMultiple : 1 ) ) + this.initialUnit );

            break;
        // no default
        }
    }

    render() {
        const {
            value,
            onChange,
        } = this.props;

        return (
            <TextControl
                { ...this.props }
                onMouseDown={ this.mouseDown }
                value={ value }
                onChange={ ( val ) => {
                    onChange( val );
                } }
                className="ghostkit-component-input-drag"
            />
        );
    }
}
