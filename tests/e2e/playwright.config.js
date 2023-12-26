import { defineConfig, devices } from '@playwright/test';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const STORAGE_STATE_PATH =
	process.env.STORAGE_STATE_PATH ||
	path.join(process.cwd(), 'artifacts/storage-states/admin.json');

const config = defineConfig({
	reporter: process.env.CI
		? [['github'], ['./config/flaky-tests-reporter.js']]
		: 'list',
	forbidOnly: !!process.env.CI,
	workers: 1,
	retries: process.env.CI ? 2 : 0,
	timeout: parseInt(process.env.TIMEOUT || '', 10) || 100_000, // Defaults to 100 seconds.
	// Don't report slow test "files", as we will be running our tests in serial.
	reportSlowTests: null,
	testDir: fileURLToPath(new URL('./specs', `file:${__filename}`).href),
	outputDir: path.join(process.cwd(), 'artifacts/test-results'),
	snapshotPathTemplate:
		'{testDir}/{testFileDir}/__snapshots__/{arg}-{projectName}{ext}',
	globalSetup: fileURLToPath(
		new URL('./config/global-setup.js', `file:${__filename}`).href
	),
	use: {
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8889',
		headless: true,
		viewport: {
			width: 960,
			height: 700,
		},
		ignoreHTTPSErrors: true,
		locale: 'en-US',
		contextOptions: {
			reducedMotion: 'reduce',
			strictSelectors: true,
		},
		storageState: STORAGE_STATE_PATH,
		actionTimeout: 10000, // 10 seconds.
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
	},
	webServer: {
		command: 'npm run env:start',
		port: 8889,
		timeout: 120000, // 120 seconds.
		reuseExistingServer: true,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			grepInvert: /-chromium/,
		},
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
				/**
				 * Headless webkit won't receive dataTransfer with custom types in the
				 * drop event on Linux. The solution is to use `xvfb-run` to run the tests.
				 * ```sh
				 * xvfb-run npm run test:e2e:playwright
				 * ```
				 * See `.github/workflows/end2end-test-playwright.yml` for advanced usages.
				 */
				headless: os.type() !== 'Linux',
			},
			grep: /@webkit/,
			grepInvert: /-webkit/,
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
			grep: /@firefox/,
			grepInvert: /-firefox/,
		},
	],
});

export default config;
