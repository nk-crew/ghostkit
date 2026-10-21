import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('icon picker', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('editor variables carry icon pack names, not the icons', async ({
		page,
		admin,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });

		const icons = await page.evaluate(() => window.ghostkitVariables.icons);

		expect(icons['font-awesome']).toEqual({ name: 'FontAwesome' });
		expect(JSON.stringify(icons).length).toBeLessThan(2000);
	});

	test('loads icons on open, filters them and sets the picked icon', async ({
		page,
		admin,
		editor,
	}) => {
		const errors = [];
		page.on('console', (message) => {
			if (message.type() === 'error') {
				errors.push(message.text());
			}
		});

		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const iconsResponse = page.waitForResponse((response) =>
			response.url().includes('get_icons')
		);

		await page
			.locator(
				'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
			)
			.click();

		expect((await iconsResponse).status()).toBe(200);

		const popover = page.locator('.ghostkit-component-icon-picker-content');
		const iconButtons = popover.locator(
			'.ghostkit-component-icon-picker-list .ghostkit-component-icon-picker-button'
		);

		await expect(iconButtons.first()).toBeVisible();

		// Only the rows near the visible area are mounted.
		expect(await iconButtons.count()).toBeLessThan(200);

		await popover.getByLabel('Search Icon').fill('instagram');

		// Ghost Kit Pro adds icon packs with more matches, so pick the FontAwesome ones.
		const fontAwesomeButtons = iconButtons.filter({
			has: page.locator('.ghostkit-svg-icon-fa'),
		});
		await expect(fontAwesomeButtons).toHaveCount(2);

		await fontAwesomeButtons.first().click();

		const icon = await page.evaluate(() => {
			const block = window.wp.data
				.select('core/block-editor')
				.getSelectedBlock();

			return decodeURIComponent(block.attributes.icon);
		});

		expect(icon).toContain('ghostkit-svg-icon-fa');
		expect(icon).toContain('viewBox="0 0 448 512"');

		expect(errors.filter((text) => /findDOMNode/.test(text))).toEqual([]);
	});

	test('class name icons saved by old versions render as SVG in the canvas', async ({
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({
			name: 'ghostkit/icon-box',
			attributes: { icon: 'fa-brands fa-instagram' },
		});

		await expect(
			editor.canvas.locator(
				'.ghostkit-icon-box-icon svg.ghostkit-svg-icon-fa'
			)
		).toBeVisible();
	});
});
