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

	test('previews the breakpoint picked in a block control and leaves the View menu to core', async ({
		page,
		editor,
	}) => {
		const popover = await openCustomCSSPopover(page, editor);
		const canvas = page.locator('iframe[name="editor-canvas"]');

		await popover
			.locator('.ghostkit-control-responsive-toggle-button')
			.click();
		await popover
			.locator('.ghostkit-control-responsive-toggle-dropdown > button')
			.last()
			.click();

		expect(await getGhostKitDevice(page)).toBe('sm');
		await expect
			.poll(() => canvas.evaluate((el) => el.offsetWidth))
			.toBe(375);

		await page.keyboard.press('Escape');
		await expect(popover).toBeHidden();

		// Ghost Kit adds nothing to the View menu or the top bar.
		await expect(
			page.locator(
				'.ghostkit-preview-menu-item, .ghostkit-toolbar-responsive'
			)
		).toHaveCount(0);

		// A core device turns the Ghost Kit breakpoint off and sizes the canvas itself.
		await page.evaluate(() =>
			window.wp.data.dispatch('core/editor').setDeviceType('Tablet')
		);

		expect(await getGhostKitDevice(page)).toBe('');
		expect(await getCoreDevice(page)).toBe('Tablet');
		await expect
			.poll(() => canvas.evaluate((el) => el.offsetWidth))
			.not.toBe(375);
	});
});
