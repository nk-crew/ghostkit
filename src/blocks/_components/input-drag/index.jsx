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

        this.parseValue = this.parseValue.bind( this );
        this.reset = this.reset.bind( this );
        this.mouseUp = this.mouseUp.bind( this );
        this.mouseDown = this.mouseDown.bind( this );
        this.mouseMove = this.mouseMove.bind( this );
        this.keyDown = this.keyDown.bind( this );

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

    parseValue() {
        let valueNum = parseFloat( this.props.value );
        let unit = '';

        // check if value contains units and save it.
        if ( this.props.value !== `${ valueNum }` ) {
            const matchUnit = this.props.value.match( new RegExp( `${ valueNum }(${ units.join( '|' ) })`, 'i' ) );

            if ( matchUnit && matchUnit[ 1 ] ) {
                unit = matchUnit[ 1 ];
            }
        }

        if ( isNaN( valueNum ) ) {
            valueNum = 0;
        }

        return {
            num: valueNum,
            unit: unit,
            full: this.props.value,
        };
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
        const valueObj = this.parseValue();

        this.initialValue = valueObj.num;
        this.initialUnit = valueObj.unit;

        if ( e.shiftKey ) {
            this.initialShiftKey = 1;
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

    keyDown( e ) {
        if (
            this.initialPosition ||
            ( e.keyCode !== 40 && e.keyCode !== 38 )
        ) {
            return;
        }

        e.preventDefault();

        const valueObj = this.parseValue();
        let newVal = 1;

        if ( e.shiftKey ) {
            newVal = 10;
        }

        switch ( e.keyCode ) {
        // down.
        case 40:
            this.props.onChange( valueObj.num - newVal + valueObj.unit );
            break;
        // up.
        case 38:
            this.props.onChange( valueObj.num + newVal + valueObj.unit );
            break;
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
                onKeyDown={ this.keyDown }
                value={ value }
                onChange={ ( val ) => {
                    onChange( val );
                } }
                className="ghostkit-component-input-drag"
            />
        );
    }
}
