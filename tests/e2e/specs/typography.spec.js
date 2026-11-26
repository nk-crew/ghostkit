import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const EXPECTED_GOOGLE_FONTS_FAMILY =
	'Inter:400,400i,700,700i|Raleway:400,400i,700,700i|Source Serif 4:400,400i,700,700i';

/**
 * Normalize Google Fonts CSS URL family param across WP encoding styles.
 *
 * @param {string} href Google Fonts stylesheet URL.
 */
function normalizeGoogleFontsFamily(href) {
	const url = new URL(href);
	const family = url.searchParams.get('family');

	if (!family) {
		return '';
	}

	return decodeURIComponent(family.replace(/\+/g, ' '));
}

/**
 * @param {string} href Google Fonts stylesheet URL.
 */
function expectGoogleFontsHref(href) {
	const url = new URL(href);

	expect(normalizeGoogleFontsFamily(href)).toBe(EXPECTED_GOOGLE_FONTS_FAMILY);
	expect(url.searchParams.get('display')).toBe('swap');
	expect(url.searchParams.get('ver')).toBeTruthy();
}

test.describe('typography', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await Promise.all([
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllPages(),
		]);
	});

	async function setFontSetting(label, font, page) {
		const wrapper = await page.locator('.ghostkit-typography', {
			hasText: label,
		});

		const fontInput = wrapper
			.locator('.ghostkit-typography-font-selector input')
			.first();

		await fontInput.click();

		await fontInput.fill(font);

		// Wait for the save, not for a guess at how long it takes. The settings
		// page debounces by exactly 1000ms and then fires the POST without
		// awaiting it, so `waitForTimeout(1000)` expired as the request was
		// being issued -- and the `page` fixture closes the page at teardown,
		// discarding anything still in flight. When it lost that race the
		// symptom appeared in a later test, as a font mismatch.
		//
		// Registered before the keypress: the response is a second away, but the
		// listener still has to exist before the thing that triggers it.
		const saved = page.waitForResponse(
			(response) =>
				response.url().includes('update_custom_typography') &&
				response.request().method() === 'POST'
		);

		await fontInput.press('Enter');

		await saved;

		return wrapper;
	}

	test('added typography settings for body', async ({ page, admin }) => {
		await admin.visitAdminPage(
			'admin.php?page=ghostkit&sub_page=typography'
		);

		const font = 'Inter';

		const wrapper = await setFontSetting('Body', font, page);

		await expect(
			wrapper.locator('.ghostkit-typography-font-selector', {
				hasText: font,
			})
		).toBeVisible();
	});

	test('added typography settings for buttons', async ({ page, admin }) => {
		await admin.visitAdminPage(
			'admin.php?page=ghostkit&sub_page=typography'
		);

		const font = 'Raleway';

		const wrapper = await setFontSetting('Buttons', font, page);

		await expect(
			wrapper.locator('.ghostkit-typography-font-selector', {
				hasText: font,
			})
		).toBeVisible();
	});

	test('added typography settings for headings', async ({ page, admin }) => {
		await admin.visitAdminPage(
			'admin.php?page=ghostkit&sub_page=typography'
		);

		const font = 'Source Serif 4';

		const wrapper = await setFontSetting('Headings', font, page);

		await expect(
			wrapper.locator('.ghostkit-typography-font-selector', {
				hasText: font,
			})
		).toBeVisible();
	});

	test('Check fonts available on backend and frontend', async ({
		page,
		admin,
		editor,
	}) => {
		// Backend.
		await admin.createNewPost({
			title: 'Test Typography',
			postType: 'page',
			showWelcomeGuide: false,
		});

		const googleFontsApi = page.locator('#ghostkit-fonts-google-css');

		await expect(googleFontsApi).toHaveAttribute('href');

		const googleFontsApiLink = await googleFontsApi.getAttribute('href');

		expectGoogleFontsHref(googleFontsApiLink);

		// Added blocks in the page editor.
		await editor.insertBlock({
			name: 'core/paragraph',
			attributes: { content: 'Just a Paragraph' },
		});

		await editor.insertBlock({
			name: 'ghostkit/button',
		});

		await editor.insertBlock({
			name: 'core/heading',
			attributes: { content: 'Just a Title', anchor: 'just-a-title' },
		});

		// Checking links to Google fonts
		await expect(
			page.locator('#ghostkit-fonts-google-css')
		).toHaveAttribute('href', /.+/);

		expectGoogleFontsHref(
			await page
				.locator('#ghostkit-fonts-google-css')
				.getAttribute('href')
		);

		// Getting added blocks to page editor.
		const paragraphBlock = editor.canvas.getByRole('document', {
			name: 'Paragraph',
		});

		const buttonBlock = editor.canvas.getByRole('document', {
			name: 'Buttons',
		});

		const titleBlock = editor.canvas.getByRole('document', {
			name: 'Heading',
		});

		// Check visible blocks on editor.
		await expect(paragraphBlock).toBeVisible();

		await expect(buttonBlock).toBeVisible();

		await expect(titleBlock).toBeVisible();

		// Checking whether the configured font matches the paragraph block.
		await expect(paragraphBlock).toHaveCSS(
			'font-family',
			'Inter, sans-serif'
		);

		// Checking whether the configured font matches the button block.
		await expect(buttonBlock.locator('.ghostkit-button')).toHaveCSS(
			'font-family',
			'Raleway, sans-serif'
		);

		// Checking whether the configured font matches the title block.
		await expect(titleBlock).toHaveCSS(
			'font-family',
			'"Source Serif 4", sans-serif'
		);

		// Publish Post.
		await editor.publishPost();

		// Go to published post.
		const viewPageButton = page
			.locator('.components-button', {
				hasText: 'View Page',
			})
			.first();

		const viewPageHref = await viewPageButton.getAttribute('href');

		let frontendPage = page;

		if (viewPageHref) {
			await page.goto(viewPageHref);
			await page.waitForLoadState('domcontentloaded');
		} else {
			const popupPromise = page
				.waitForEvent('popup', { timeout: 3000 })
				.catch(() => null);

			await viewPageButton.click();

			const popupPage = await popupPromise;

			if (popupPage) {
				frontendPage = popupPage;
				await frontendPage.waitForLoadState('domcontentloaded');
			} else {
				await page.waitForLoadState('domcontentloaded');
			}
		}

		// Frontend.
		// Checking links to Google fonts
		await expect(
			frontendPage.locator('#ghostkit-fonts-google-css')
		).toHaveAttribute('href', /.+/);

		expectGoogleFontsHref(
			await frontendPage
				.locator('#ghostkit-fonts-google-css')
				.getAttribute('href')
		);

		const paragraph = frontendPage.locator('.wp-block-post-content > p');

		const button = frontendPage.locator(
			'.wp-block-post-content .ghostkit-button-text'
		);

		const title = frontendPage.locator('#just-a-title');

		// Check visible blocks on editor.
		await expect(paragraph).toBeVisible();

		await expect(button).toBeVisible();

		await expect(title).toBeVisible();

		// Checking whether the configured font matches the blocks.
		await expect(paragraph).toHaveCSS('font-family', 'Inter, sans-serif');

		await expect(button).toHaveCSS('font-family', 'Raleway, sans-serif');

		// We have to check font with the "serif" in name and "4",
		// because it may not load as expected if we forget to add quotes in font-family.
		await expect(title).toHaveCSS(
			'font-family',
			'"Source Serif 4", sans-serif'
		);
	});
});

test.describe('Font Library typography', () => {
	const family = 'Ghost Kit Fixture Serif';
	const slug = 'ghost-kit-fixture-serif';
	const fontFamily = `"${family}", serif`;

	async function selectLibrary(wrapper, page) {
		await wrapper
			.locator('.ghostkit-typography-font-category-control-toggle')
			.click();
		await page
			.locator('.ghostkit-typography-font-category-control-menu')
			.getByText('Font Library', { exact: true })
			.click();
	}

	async function expectFont(paragraph, style, source) {
		await expect(paragraph).toHaveCSS('font-family', fontFamily);
		await expect(paragraph).toHaveCSS('font-style', style);
		const result = await paragraph.evaluate(
			async (element, { css, sourceUrl }) => {
				const { defaultView, fonts } = element.ownerDocument;
				const computed = defaultView.getComputedStyle(element);
				const loaded = await fonts.load(
					`${computed.fontStyle} ${computed.fontWeight} 18px ${css}`
				);
				return {
					faces: loaded.map((face) => face.style),
					file:
						defaultView.performance.getEntriesByName(sourceUrl)
							.length > 0,
				};
			},
			{
				css: fontFamily,
				sourceUrl: Array.isArray(source) ? source[0] : source,
			}
		);
		expect(result).toEqual({ faces: [style], file: true });
	}

	for (const theme of ['empty-theme', 'empty-theme-php']) {
		test(`applies uploaded faces globally and per post in ${theme}`, async ({
			admin,
			editor,
			page,
			request,
			requestUtils,
		}) => {
			const typographyPath = '/ghostkit/v1/update_custom_typography';
			const { response: originalTypography } = await requestUtils.rest({
				path: '/ghostkit/v1/get_custom_typography',
			});
			const familiesPath = '/wp/v2/font-families';
			let familyId;
			let globalStylesPath;
			let originalSettings;
			let post;

			try {
				await requestUtils.activateTheme(theme);
				const { _links: links } = await requestUtils.rest({
					path: `/wp/v2/themes/${theme}?context=edit`,
				});
				const { href } = links['wp:user-global-styles'][0];
				globalStylesPath = `/wp/v2/global-styles/${href.split('/').at(-1)}`;
				({ settings: originalSettings } = await requestUtils.rest({
					path: `${globalStylesPath}?context=edit`,
				}));

				const { id, font_family_settings: preset } =
					await requestUtils.rest({
						path: familiesPath,
						method: 'POST',
						data: {
							font_family_settings: JSON.stringify({
								name: family,
								slug,
								fontFamily,
							}),
						},
					});
				familyId = id;

				const faces = [];
				for (const style of ['normal', 'italic']) {
					const name = `cardo_${style}_400.woff2`;
					const response = await request.get(
						`/wp-content/themes/twentytwentyfour/assets/fonts/cardo/${name}`
					);
					expect(response.ok()).toBe(true);
					const { font_face_settings: face } =
						await requestUtils.rest({
							path: `${familiesPath}/${familyId}/font-faces`,
							method: 'POST',
							multipart: {
								font_face_settings: JSON.stringify({
									fontFamily: family,
									fontWeight: '400',
									fontStyle: style,
									src: ['fixture'],
								}),
								fixture: {
									name,
									mimeType: 'font/woff2',
									buffer: await response.body(),
								},
							},
						});
					faces.push(face);
				}

				await requestUtils.rest({
					path: globalStylesPath,
					method: 'POST',
					data: {
						settings: {
							...originalSettings,
							typography: {
								...originalSettings.typography,
								fontFamilies: [
									{ ...preset, fontFace: faces },
									{
										name: 'Inter',
										slug: 'fixture-inter',
										fontFamily: 'serif',
									},
								],
							},
						},
					},
				});

				await admin.visitAdminPage(
					'admin.php?page=ghostkit&sub_page=typography'
				);
				const body = page.locator('.ghostkit-typography').filter({
					has: page.getByText('Body', { exact: true }),
				});
				await selectLibrary(body, page);

				const input = body.locator(
					'.ghostkit-typography-font-selector input'
				);
				await input.fill('Inter');
				await expect(
					page.getByRole('option', { name: 'Inter', exact: true })
				).toHaveCount(0);
				await input.fill(family);
				const saved = page.waitForResponse(
					(response) =>
						response.url().includes('update_custom_typography') &&
						response.request().method() === 'POST' &&
						response.request().postData()?.includes(slug)
				);
				await page
					.getByRole('option', { name: family, exact: true })
					.click();
				expect((await saved).ok()).toBe(true);

				post = await requestUtils.createPost({
					title: 'Uploaded Font Library Faces',
					status: 'publish',
					content:
						'<!-- wp:paragraph --><p>Font fixture</p><!-- /wp:paragraph -->',
				});
				await page.goto(post.link);
				await expectFont(
					page.getByText('Font fixture', { exact: true }),
					'normal',
					faces[0].src
				);
				await admin.editPost(post.id);
				const paragraph = editor.canvas.getByRole('document', {
					name: 'Paragraph',
				});
				await expectFont(paragraph, 'normal', faces[0].src);

				await page
					.getByRole('button', { name: 'Options', exact: true })
					.click();
				await page
					.getByRole('menuitem', { name: 'Typography' })
					.click();
				const dialog = page.getByRole('dialog', { name: 'Typography' });
				const localBody = dialog
					.locator('.ghostkit-typography')
					.filter({
						has: page.getByText('Body', { exact: true }),
					});
				await selectLibrary(localBody, page);
				await localBody
					.locator('.ghostkit-typography-font-selector input')
					.fill(family);
				await page
					.getByRole('option', { name: family, exact: true })
					.click();
				await localBody
					.locator('.ghostkit-typography-weight-control input')
					.fill('Regular Italic');
				await page
					.getByRole('option', { name: 'Regular Italic' })
					.click();
				await dialog.getByRole('button', { name: 'Close' }).click();

				await expectFont(paragraph, 'italic', faces[1].src);
				await page
					.getByRole('button', { name: 'Save', exact: true })
					.click();
				await expect(
					page.getByText('Post updated.', { exact: true })
				).toBeVisible();
				await admin.editPost(post.id);
				await expectFont(paragraph, 'italic', faces[1].src);

				await page.goto(post.link);
				await expectFont(
					page.getByText('Font fixture', { exact: true }),
					'italic',
					faces[1].src
				);
			} finally {
				await requestUtils.rest({
					path: typographyPath,
					method: 'POST',
					data: {
						data: {
							ghostkit_typography: '{}',
							...originalTypography,
						},
					},
				});
				if (originalSettings) {
					await requestUtils.rest({
						path: globalStylesPath,
						method: 'POST',
						data: { settings: originalSettings },
					});
				}
				if (familyId) {
					await requestUtils.rest({
						path: `${familiesPath}/${familyId}?force=true`,
						method: 'DELETE',
					});
				}
				if (post) {
					await requestUtils.deleteAllPosts();
				}
				await requestUtils.activateTheme('empty-theme');
			}
		});
	}
});
