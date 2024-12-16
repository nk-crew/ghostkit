import { debounce } from 'throttle-debounce';

import apiFetch from '@wordpress/api-fetch';
import { Button, Spinner } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Typography from '../../gutenberg/components/typography';
import {
	getCustomTypographyList,
	getInitialAdvancedState,
} from '../../gutenberg/plugins/typography';

class TypographySettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			customTypography: false,
			advanced: {},
		};

		this.maybePrepareTypographyData =
			this.maybePrepareTypographyData.bind(this);
		this.getPlaceholders = this.getPlaceholders.bind(this);
		this.updateTypography = this.updateTypography.bind(this);
		this.updateTypographyDebounce = debounce(
			1000,
			this.updateTypographyDebounce.bind(this)
		);
	}

	componentDidMount() {
		this.maybePrepareTypographyData();
	}

	componentDidUpdate() {
		this.maybePrepareTypographyData();
	}

	/**
	 * Function for setting the current state with a list of child typographies and a button status flag when a button is clicked.
	 *
	 * @param {int} key - Typography identifier.
	 */
	onClickAdvanced(key) {
		this.setState((prevState) => ({
			advanced: {
				...prevState.advanced,
				[key]: !prevState.advanced[key],
			},
		}));
	}

	/**
	 * The function returns a placeholder object.
	 *
	 * @param {string}  key      - Key of current typography.
	 * @param {boolean} isGlobal - Flag of global customization.
	 * @return {Object} - Placeholders Object.
	 */
	getPlaceholders() {
		const placeholders = {
			'font-size': '-',
			'line-height': '-',
			'letter-spacing': '-',
		};

		return placeholders;
	}

	/**
	 * Function for get Child Render Typographies.
	 *
	 * @param {Object}  typographyList - Typography List.
	 * @param {int}     key            - Typography identifier.
	 * @param {boolean} isGlobal       - Flag of global customization.
	 * @return {Array} - Array with child typography objects.
	 */
	getChildrenTypography(typographyList, key) {
		const childTypographies = [];

		Object.keys(typographyList).forEach((childKey) => {
			if (typographyList[childKey].childOf === key) {
				childTypographies.push(
					<div key={childKey}>
						{this.getTypographyComponent(typographyList, childKey)}
					</div>
				);
			}
		});

		return childTypographies;
	}

	/**
	 * Function for get Typography Component.
	 *
	 * @param {Object}  typographyList - Typography List.
	 * @param {int}     key            - Typography identifier.
	 * @param {boolean} isGlobal       - Flag of global customization.
	 * @return {*} - Typography Object.
	 */
	getTypographyComponent(typographyList, key) {
		const placeholders = this.getPlaceholders();

		return this.state.customTypography !== false ? (
			<Typography
				onChange={(opt) => {
					this.updateTypography(opt, typographyList, key);
				}}
				fontFamily={typographyList[key].fontFamily}
				fontFamilyCategory={typographyList[key].fontFamilyCategory}
				fontWeight={typographyList[key].fontWeight}
				fontSize={typographyList[key].fontSize}
				lineHeight={typographyList[key].lineHeight}
				letterSpacing={typographyList[key].letterSpacing}
				label={typographyList[key].label}
				placeholders={placeholders}
				childOf={typographyList[key].childOf}
			/>
		) : (
			<Spinner />
		);
	}

	maybePrepareTypographyData() {
		const { customTypography = {} } = this.props;

		if (customTypography && this.state.customTypography === false) {
			this.setState({
				customTypography:
					getCustomTypographyList(
						customTypography.ghostkit_typography,
						true
					) || '',
				advanced: getInitialAdvancedState(
					getCustomTypographyList(
						customTypography.ghostkit_typography,
						true
					)
				),
			});
		}
	}

	updateTypography(opt, typographyList, key) {
		this.setState(
			{
				customTypography: {
					...typographyList,
					[key]: {
						...typographyList[key],
						...opt,
					},
				},
			},
			() => {
				this.updateTypographyDebounce();
			}
		);
	}

	updateTypographyDebounce() {
		this.props.updateTypography({
			ghostkit_typography: this.state.customTypography,
		});
	}

	render() {
		const typographyList = getCustomTypographyList(
			this.state.customTypography,
			true
		);

		return (
			<div className="ghostkit-settings-content-wrapper ghostkit-settings-typography">
				{typographyList && Object.keys(typographyList).length ? (
					<>
						{Object.keys(typographyList).map((key) => {
							const advancedData = this.state.advanced[key];
							const advancedLabel =
								advancedData === true
									? __('Hide Advanced', 'ghostkit')
									: __('Show Advanced', 'ghostkit');

							if (typographyList[key].childOf === '') {
								return (
									<div
										className="ghostkit-typography-container"
										key={key}
									>
										{this.getTypographyComponent(
											typographyList,
											key
										)}
										{typeof advancedData !== 'undefined' ? (
											<div className="ghostkit-typography-advanced">
												<Button
													variant="secondary"
													onClick={() =>
														this.onClickAdvanced(
															key
														)
													}
													className="ghostkit-typography-advanced-button"
												>
													{advancedLabel}
												</Button>
											</div>
										) : null}
										{advancedData
											? this.getChildrenTypography(
													typographyList,
													key
												)
											: ''}
									</div>
								);
							}

							return '';
						})}
					</>
				) : null}
			</div>
		);
	}
}

export default compose([
	withSelect((select) => {
		const customTypography = select(
			'ghostkit/plugins/typography'
		).getCustomTypography();

		try {
			customTypography.ghostkit_typography = JSON.parse(
				customTypography.ghostkit_typography
			);
		} catch (e) {}

		return {
			customTypography,
		};
	}),
	withDispatch((dispatch) => ({
		updateTypography(value) {
			value = {
				ghostkit_typography: JSON.stringify(value.ghostkit_typography),
			};

			dispatch('ghostkit/plugins/typography').setCustomTypography(value);

			apiFetch({
				path: '/ghostkit/v1/update_custom_typography',
				method: 'POST',
				data: {
					data: value,
				},
			});
		},
	})),
])(TypographySettings);
