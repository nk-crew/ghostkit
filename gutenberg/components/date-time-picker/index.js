/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

import { getSettings, dateI18n } from '@wordpress/data';

import { BaseControl, Popover, Button, DateTimePicker as WPDateTimePicker } from '@wordpress/components';

const { luxon } = window;

/**
 * Component Class
 */
export default function DateTimePicker(props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { value, onChange, label, is12Hour = false } = props;

  const settings = getSettings();
  const resolvedFormat = settings.formats.datetime || 'F j, Y g:i a';

  return (
    <BaseControl label={label} className="ghostkit-components-date-time-picker">
      <div>
        <Button isLink onClick={() => setIsPickerOpen(!isPickerOpen)}>
          {value
            ? `${dateI18n(resolvedFormat, value)} ${
                settings.timezone.abbr ||
                settings.timezone.string ||
                `UTC${settings.timezone.offset}`
              }`
            : __('Select Date', '@@text_domain')}
        </Button>
        {isPickerOpen ? (
          <Popover
            className="ghostkit-components-date-time-picker-popover"
            onClose={() => setIsPickerOpen(false)}
          >
            <WPDateTimePicker
              label={label}
              currentDate={luxon.DateTime.fromISO(value).isValid ? value : ''}
              onChange={onChange}
              is12Hour={is12Hour}
            />
          </Popover>
        ) : null}
      </div>
    </BaseControl>
  );
}
