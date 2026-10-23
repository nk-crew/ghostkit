import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const POPOVER = '.ghostkit-extension-customCSS-custom__dropdown-content';

function getGhostKitDevice(page) {
	return page.evaluate(() =>
		window.wp.data.select('ghostkit/responsive').getDevice()
	);
}

function getCoreDevice(page) {
	return page.evaluate(() =>
		window.wp.data.select('core/editor').getDeviceType()
	);
}

// WordPress 7.1 puts the description into the accessible name, 7.2 does not.
function ghostKitItem(page, width) {
	return page
		.getByRole('menuitemcheckbox')
		.filter({ hasText: `Devices with screen width <= ${width}` });
}

async function openCustomCSSPopover(page, editor) {
	await editor.insertBlock({
		name: 'core/paragraph',
		attributes: { content: 'Responsive' },
	});
	await editor.openDocumentSettingsSidebar();
	await page
		.getByRole('region', { name: 'Editor settings' })
		.getByRole('tab', { name: 'Styles' })
		.click();
	await page.getByRole('button', { name: 'Custom CSS options' }).click();
	await page.getByRole('menuitemcheckbox', { name: 'Custom' }).click();
	await page.keyboard.press('Escape');
	await page
		.locator(
			'.ghostkit-extension-customCSS-custom__dropdown-content-toggle'
		)
		.click();

	const popover = page.locator(POPOVER);
	await expect(popover).toBeVisible();

	return popover;
}

test.describe('responsive switcher', () => {
	test.beforeEach(async ({ admin }) => {
		await admin.createNewPost();
	});

	test('keeps the Edit CSS popover open after switching the breakpoint', async ({
		page,
		editor,
	}) => {
		const popover = await openCustomCSSPopover(page, editor);

		await popover
			.locator('.ghostkit-control-responsive-toggle-button')
			.click();
		await popover
			.locator('.ghostkit-control-responsive-toggle-dropdown > button')
			.last()
			.click();

		expect(await getGhostKitDevice(page)).toBe('sm');
		await expect(popover).toBeVisible();
		await expect(
			popover.locator('.ghostkit-control-responsive-toggle-button')
		).toBeFocused();
	});

	test('shows every breakpoint in the Edit CSS popover when Mobile is selected', async ({
		page,
		editor,
	}) => {
		await page.evaluate(() =>
			window.wp.data.dispatch('ghostkit/responsive').setDevice('sm')
		);
		const popover = await openCustomCSSPopover(page, editor);

		await popover
			.locator('.ghostkit-control-responsive-toggle-button')
			.click();

		// The top item must be the element under its own center, not clipped by the popover.
		const topItemIsReachable = await popover
			.locator('.ghostkit-control-responsive-toggle-dropdown > button')
			.first()
			.evaluate((item) => {
				const rect = item.getBoundingClientRect();
				const hit = document.elementFromPoint(
					rect.left + rect.width / 2,
					rect.top + rect.height / 2
				);

				return !!hit && item.contains(hit);
			});

		expect(topItemIsReachable).toBe(true);
	});

	test('keeps Ghost Kit breakpoints and core devices in one View menu, in sync', async ({
		page,
	}) => {
		const viewButton = page
			.getByRole('region', { name: 'Editor top bar' })
			.getByRole('button', { name: 'View', exact: true });

		await expect(viewButton).toBeVisible();
		await expect(page.locator('.ghostkit-toolbar-responsive')).toHaveCount(
			0
		);

		// Ghost Kit breakpoint sets core back to Desktop.
		await page.evaluate(() =>
			window.wp.data.dispatch('core/editor').setDeviceType('Tablet')
		);
		await viewButton.click();
		await ghostKitItem(page, '576px').click();

		expect(await getGhostKitDevice(page)).toBe('sm');
		expect(await getCoreDevice(page)).toBe('Desktop');

		// A core device turns the Ghost Kit breakpoint off.
		await viewButton.click();
		await expect(ghostKitItem(page, '576px')).toHaveAttribute(
			'aria-checked',
			'true'
		);
		await page.getByRole('menuitemradio', { name: /^Mobile/ }).click();
		// WordPress 7.1 keeps the menu open after a device pick.
		await page.keyboard.press('Escape');

		expect(await getCoreDevice(page)).toBe('Mobile');
		expect(await getGhostKitDevice(page)).toBe('');

		await page.evaluate(() =>
			window.wp.data.dispatch('core/editor').setDeviceType('Desktop')
		);
		await viewButton.click();
		const laptop = ghostKitItem(page, '1200px');
		await laptop.click();
		expect(await getGhostKitDevice(page)).toBe('xl');

		// Clicking the active Ghost Kit breakpoint again turns it off.
		await viewButton.click();
		await laptop.click();
		expect(await getGhostKitDevice(page)).toBe('');
	});
});
