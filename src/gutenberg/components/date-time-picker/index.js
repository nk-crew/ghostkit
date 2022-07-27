/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __ } = wp.i18n;

const { __experimentalGetSettings: getSettings, dateI18n } = wp.date;

const { BaseControl, Popover, Button, DateTimePicker: WPDateTimePicker } = wp.components;

/**
 * Component Class
 */
export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPickerOpen: false,
    };
  }

  render() {
    const { value, onChange, label, is12Hour = false } = this.props;

    const { isPickerOpen } = this.state;

    const settings = getSettings();
    const resolvedFormat = settings.formats.datetime || 'F j, Y g:i a';

    return (
      <BaseControl label={label} className="ghostkit-components-date-time-picker">
        <div>
          <Button isLink onClick={() => this.setState({ isPickerOpen: !isPickerOpen })}>
            {value
              ? `${dateI18n(resolvedFormat, value)} ${
                  settings.timezone.abbr ||
                  settings.timezone.string ||
                  `UTC${settings.timezone.offset}`
                }`
              : __('Select Date', '@@text_domain')}
          </Button>
          {isPickerOpen ? (
            <Popover onClose={() => this.setState({ isPickerOpen: false })}>
              <WPDateTimePicker
                label={label}
                currentDate={value}
                onChange={onChange}
                is12Hour={is12Hour}
              />
            </Popover>
          ) : (
            ''
          )}
        </div>
      </BaseControl>
    );
  }
}
