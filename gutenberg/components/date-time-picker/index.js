import {
	BaseControl,
	Button,
	DateTimePicker as WPDateTimePicker,
	Popover,
} from '@wordpress/components';
import { dateI18n, getSettings } from '@wordpress/date';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const { luxon } = window;

/**
 * Component Class
 *
 * @param props
 */
export default function DateTimePicker(props) {
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const { value, onChange, label, is12Hour = false } = props;

	const settings = getSettings();
	const resolvedFormat = settings.formats.datetime || 'F j, Y g:i a';

	return (
		<BaseControl
			id={label}
			label={label}
			className="ghostkit-components-date-time-picker"
			__nextHasNoMarginBottom
		>
			<div>
				<Button isLink onClick={() => setIsPickerOpen(!isPickerOpen)}>
					{value
						? `${dateI18n(resolvedFormat, value)} ${
								settings.timezone.abbr ||
								settings.timezone.string ||
								`UTC${settings.timezone.offset}`
							}`
						: __('Select Date', 'ghostkit')}
				</Button>
				{isPickerOpen ? (
					<Popover
						className="ghostkit-components-date-time-picker-popover"
						onClose={() => setIsPickerOpen(false)}
					>
						<WPDateTimePicker
							label={label}
							currentDate={
								luxon.DateTime.fromISO(value).isValid
									? value
									: ''
							}
							onChange={onChange}
							is12Hour={is12Hour}
						/>
					</Popover>
				) : null}
			</div>
		</BaseControl>
	);
}
