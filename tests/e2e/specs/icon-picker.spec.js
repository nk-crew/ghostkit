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
		const iconButtons = popover.getByRole('option');

		await expect(iconButtons.first()).toBeVisible();

		// Only the rows near the visible area are mounted.
		expect(await iconButtons.count()).toBeLessThan(200);

		await popover.getByRole('searchbox').fill('instagram');

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

	test('picks an icon with the keyboard and closes with Escape', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const toggle = page.locator(
			'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
		);
		await toggle.click();

		const popover = page.locator('.ghostkit-component-icon-picker-content');
		const search = popover.getByRole('searchbox');

		await expect(search).toBeFocused();
		await search.fill('arrow-right');
		await expect(popover.getByRole('option').first()).toBeVisible();

		await page.keyboard.press('ArrowDown');
		await expect(popover.getByRole('option').first()).toBeFocused();

		await page.keyboard.press('ArrowRight');
		const second = popover.getByRole('option').nth(1);
		await expect(second).toBeFocused();
		const secondName = await second.getAttribute('aria-label');

		await page.keyboard.press('Enter');
		await expect(second).toHaveAttribute('aria-selected', 'true');
		await expect(
			popover.locator('.ghostkit-component-icon-picker-current')
		).toHaveText(secondName);

		const icon = await page.evaluate(() =>
			decodeURIComponent(
				window.wp.data.select('core/block-editor').getSelectedBlock()
					.attributes.icon
			)
		);
		expect(icon).toContain('<svg');

		// Typing in the grid goes back to the search field.
		await page.keyboard.press('Home');
		await page.keyboard.type('s');
		await expect(search).toBeFocused();
		await expect(search).toHaveValue('arrow-rights');

		// The first Escape clears the search, the second closes the picker.
		await page.keyboard.press('Escape');
		await expect(search).toHaveValue('');
		await page.keyboard.press('Escape');
		await expect(popover).toBeHidden();
		await expect(toggle).toBeFocused();
	});

	test('shows a picked icon under Recent in the next editor session', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const toggle = page.locator(
			'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
		);
		const popover = page.locator('.ghostkit-component-icon-picker-content');

		await toggle.click();
		await popover.getByRole('searchbox').fill('dragon');

		const option = popover.getByRole('option').first();
		const name = await option.getAttribute('aria-label');

		// Core saves preferences to the user meta with a debounce.
		const saved = page.waitForResponse(
			(response) =>
				/users(\/|%2F)me/.test(response.url()) &&
				response.request().method() !== 'GET'
		);
		await option.click();
		expect((await saved).ok()).toBe(true);

		// Drop the local copy so the next editor load reads the user meta.
		await page.evaluate(() => window.localStorage.clear());
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();
		await toggle.click();

		const recent = popover.locator(
			'.ghostkit-component-icon-picker-heading',
			{ hasText: 'Recent' }
		);
		await expect(recent.first()).toBeVisible();
		await expect(popover.getByRole('option').first()).toHaveAttribute(
			'aria-label',
			name
		);
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
