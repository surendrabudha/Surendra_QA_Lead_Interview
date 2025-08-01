import { Given, When, Then, IWorld } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorldImpl } from '../support/world'; // Adjust path if needed

// --- Scenario: Successfully retrieve activity rankings for a valid city with autocomplete ---

Given('the application is accessible', async function (this: CustomWorldImpl) {
  await this.page.goto('http://localhost:3000'); // Replace with your application's URL
  await expect(this.page).toHaveTitle(/Activity Ranking/); // Basic check for application load
});

Given('the search box is visible', async function (this: CustomWorldImpl) {
  await expect(this.page.locator('#city-search-input')).toBeVisible(); // Assuming ID for search input
});

When('I type {string} into the search box', async function (this: CustomWorldImpl, cityPrefix: string) {
  await this.page.locator('#city-search-input').fill(cityPrefix);
  await this.page.waitForTimeout(500); // Small delay to allow suggestions to appear
});

Then('I should see {string} in the autocomplete suggestions', async function (this: CustomWorldImpl, suggestion: string) {
  const suggestionLocator = this.page.locator('.autocomplete-suggestions li', { hasText: suggestion }); // Assuming class for suggestions
  await expect(suggestionLocator).toBeVisible(); 
});

When('I select {string} from the suggestions', async function (this: CustomWorldImpl, suggestion: string) {
  const suggestionLocator = this.page.locator('.autocomplete-suggestions li', { hasText: suggestion });
  await suggestionLocator.click(); 
  await this.page.waitForResponse(response => response.url().includes('/api/rank-activities') && response.status() === 200); // Wait for API call
});

Then('the activity ranking request should be sent for {string}', async function (this: CustomWorldImpl, cityName: string) {
  // This is implicitly checked by waiting for the response in the previous step,
  // but we can add more explicit checks if needed, e.g., by mocking network requests.
  // For now, rely on UI update or direct API response storage.
  console.log(`Activity ranking request expected for: ${cityName}`);
});

Then('I should receive a successful response', async function (this: CustomWorldImpl) {
  // For UI tests, this means the UI updates successfully with data.
  // For API tests, this means storing the API response with status 2xx.
  // Assuming UI reflects success by displaying data.
  await expect(this.page.locator('.activity-rankings')).toBeVisible(); // Assuming a container for results
});

Then('the response should contain activity rankings for the next {int} days', async function (this: CustomWorldImpl, days: number) {
  const rankingCards = await this.page.locator('.activity-ranking-card').count(); // Assuming each day/activity is a card
  // This might need more refinement if the UI structure is different.
  // A rough check: At least 4 activities * 7 days = 28 cards (if displaying each activity individually per day)
  expect(rankingCards).toBeGreaterThanOrEqual(days * 4); // At least one card per activity per day
});

Then('each ranking should include {string}, {string}, {string}, and {string}', async function (this: CustomWorldImpl, date: string, activityName: string, rank: string, reasoning: string) {
  // This is a generic check. In a real scenario, you'd iterate through displayed items.
  // Example for one card:
  const firstRankingCard = this.page.locator('.activity-ranking-card').first();
  await expect(firstRankingCard.locator('.date')).toBeVisible(); 
  await expect(firstRankingCard.locator('.activity-name')).toBeVisible(); 
  await expect(firstRankingCard.locator('.rank')).toBeVisible(); 
  await expect(firstRankingCard.locator('.reasoning')).toBeVisible(); 
});

Then('{string} should be ranked high if {string} is the reasoning', async function (this: CustomWorldImpl, activity: string, reasoning: string) {
  // This step requires inspecting specific ranking results.
  // Mocking API response for predictable results is ideal here for automation.
  // For a UI-driven test, you'd parse the displayed text.
  // Example: Find a card with the activity and check its rank/reasoning.
  const skiingCard = this.page.locator('.activity-ranking-card', { hasText: activity });
  // This is a simplified check. A more robust test would get the actual rank value and assert its range.
  await expect(skiingCard.locator('.reasoning', { hasText: reasoning })).toBeVisible(); 

// --- Scenario: No autocomplete suggestions returned for an unknown input ---

Then('I should not see any autocomplete suggestions', async function (this: CustomWorldImpl) {
  await expect(this.page.locator('.autocomplete-suggestions')).not.toBeVisible(); 
});

Then('the activity ranking request should not be sent', async function (this: CustomWorldImpl) {
  // This can be verified by not observing any network requests to the ranking API
  // or by ensuring the results area remains empty.
  await expect(this.page.locator('.activity-rankings')).not.toBeVisible();
});

// --- Scenario: Handle API failure when fetching weather data ---

Given('the Open-Meteo API is configured to return an error', async function (this: CustomWorldImpl) {
  // This requires setting up a mock server or a test environment that can simulate API failures.
  // For Playwright, you can mock network requests.
  await this.page.route('**/api/open-meteo/*', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error from weather API' }),
    });
  }); [cite: 15, 38]
});

When('I enter {string} into the search box', async function (this: CustomWorldImpl, cityName: string) {
  await this.page.locator('#city-search-input').fill(cityName);
});

When('I trigger the activity ranking request', async function (this: CustomWorldImpl) {
  await this.page.keyboard.press('Enter'); // Simulate pressing Enter
  // Wait for the API call that should now fail
  const responsePromise = this.page.waitForResponse(response => response.url().includes('/api/rank-activities'));
  this.response = await responsePromise;
});

Then('I should receive an error response', async function (this: CustomWorldImpl) {
  expect(this.response.status()).toBeGreaterThanOrEqual(400); // Check for client or server error status
});

Then('an error message indicating weather data unavailability should be displayed', async function (this: CustomWorldImpl) {
  const errorMessageLocator = this.page.locator('.error-message'); // Assuming a class for error messages
  await expect(errorMessageLocator).toBeVisible();
  const errorMessageText = await errorMessageLocator.textContent();
  expect(errorMessageText).toContain('Unable to fetch weather data' || 'An internal error occurred'); // Example messages
});

Then('no activity rankings should be shown', async function (this: CustomWorldImpl) {
  await expect(this.page.locator('.activity-rankings')).not.toBeVisible();
});