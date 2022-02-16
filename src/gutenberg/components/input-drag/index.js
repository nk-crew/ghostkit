/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { TextControl } = wp.components;

/**
 * Internal dependencies
 */
const minDistanceToStart = 5;
const units = [
  'px',
  '%',
  'rem',
  'em',
  'vh',
  'vw',
  'vmin',
  'vmax',
  'ex',
  'cm',
  'mm',
  'in',
  'pt',
  'pc',
  'ch',
];

/**
 * The function counts the number of digits after the decimal point.
 *
 * @param {number} number - Any Number.
 * @return {number} - Number of decimal places.
 */
const numberOfDecimal = (number) =>
  number.toString().includes('.') ? number.toString().split('.').pop().length : 0;

/**
 * Component Class
 */
export default class InputDrag extends Component {
  constructor(props) {
    super(props);

    this.parseValue = this.parseValue.bind(this);
    this.reset = this.reset.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.keyDown = this.keyDown.bind(this);

    this.reset();
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUp, false);
    document.addEventListener('mousemove', this.mouseMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.mouseUp, false);
    document.removeEventListener('mousemove', this.mouseMove, false);
  }

  parseValue() {
    let valueNum = parseFloat(this.props.value);
    let unit = '';
    // check if value contains units and save it.
    if (this.props.value !== `${valueNum}`) {
      const matchUnit = this.props.value.match(new RegExp(`${valueNum}(${units.join('|')})`, 'i'));

      if (matchUnit && matchUnit[1]) {
        // eslint-disable-next-line prefer-destructuring
        unit = matchUnit[1];
      }
    }

    if (Number.isNaN(valueNum)) {
      valueNum = 0;
      if ('undefined' !== typeof this.props.defaultUnit) {
        unit = this.props.defaultUnit;
      }
    }

    return {
      num: valueNum,
      unit,
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

  mouseDown(e) {
    this.initialPosition = {
      x: e.pageX,
      y: e.pageY,
    };
    const valueObj = this.parseValue();

    this.initialValue = valueObj.num;
    this.initialUnit = valueObj.unit;

    if (e.shiftKey) {
      this.initialShiftKey = 1;
    }

    this.dragState = 1;
  }

  mouseUp() {
    this.reset();
  }

  mouseMove(e) {
    const startDistance = this.props.startDistance || minDistanceToStart;

    switch (this.dragState) {
      // check for drag position
      case 1:
        if (Math.abs(this.initialPosition.x - e.pageX) > startDistance) {
          this.reset();
        } else if (Math.abs(this.initialPosition.y - e.pageY) > startDistance) {
          this.dragState = 2;
        }

        break;
      // change input value.
      case 2: {
        e.preventDefault();
        let step = 1;
        let shiftKeyMultiple = 10;

        if ('undefined' !== typeof this.props.step && !Number.isNaN(this.props.step)) {
          step = this.props.step;
          shiftKeyMultiple *= step;
        }

        const numbersOfDigit = numberOfDecimal(step);
        let mouseValue =
          this.initialValue +
          (this.initialPosition.y - e.pageY) * (this.initialShiftKey ? shiftKeyMultiple : step);

        // conversion for decimal steps
        if (0 < numbersOfDigit) {
          mouseValue = +mouseValue.toFixed(numbersOfDigit);
        }

        this.props.onChange(mouseValue + this.initialUnit);
        break;
      }
      // no default
    }
  }

  keyDown(e) {
    if (this.initialPosition || (40 !== e.keyCode && 38 !== e.keyCode)) {
      return;
    }

    e.preventDefault();

    const valueObj = this.parseValue();
    let newVal = 1;
    let shiftVal = 10;

    if ('undefined' !== typeof this.props.step && !Number.isNaN(this.props.step)) {
      newVal = this.props.step;
      if (e.shiftKey) {
        shiftVal *= this.props.step;
      }
    }

    const numbersOfDigit = numberOfDecimal(newVal);
    let keyDown = valueObj.num - newVal;
    let keyUp = valueObj.num + newVal;

    if (e.shiftKey) {
      keyDown = valueObj.num - shiftVal;
      keyUp = valueObj.num + shiftVal;
    }

    // conversion for decimal steps
    if (0 < numbersOfDigit) {
      keyDown = +keyDown.toFixed(numbersOfDigit);
      keyUp = +keyUp.toFixed(numbersOfDigit);
    }

    switch (e.keyCode) {
      // down.
      case 40:
        this.props.onChange(keyDown + valueObj.unit);
        break;
      // up.
      case 38:
        this.props.onChange(keyUp + valueObj.unit);
        break;
      // no default
    }
  }

  render() {
    const { value, onChange, icon, placeholder, autoComplete, className } = this.props;

    let classHasIcon = 'ghostkit-component-input-drag-no-icon';

    if ('undefined' !== typeof icon) {
      classHasIcon = 'ghostkit-component-input-drag-has-icon';
    }

    return (
      <div className={classnames(classHasIcon, className)}>
        {icon}
        <TextControl
          onMouseDown={this.mouseDown}
          onKeyDown={this.keyDown}
          value={value}
          onChange={(val) => {
            onChange(val);
          }}
          className="ghostkit-component-input-drag"
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      </div>
    );
  }
}
