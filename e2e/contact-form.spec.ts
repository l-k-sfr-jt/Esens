import { test, expect } from '@playwright/test';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const CONVEX_DEPLOYMENT = process.env.CONVEX_DEPLOYMENT;

if (!CONVEX_URL || !CONVEX_DEPLOYMENT) {
  throw new Error(
    'NEXT_PUBLIC_CONVEX_URL AND CONVEX_DEPLOYMENT environment variables are required for E2E tests'
  );
}

test.describe('Contact Form E2E', () => {
  test('should successfully submit form and store data in Convex', async ({ page }) => {
    // Generate unique test data using timestamp
    const timestamp = Date.now();
    const testData = {
      firstName: 'E2E',
      lastName: 'Test',
      email: `e2e-test-${timestamp}@example.com`,
      phone: '+420123456789',
      message: `This is an E2E test message created at ${new Date(timestamp).toISOString()}`,
    };

    // Navigate to contact page
    await page.goto('/contact');

    // Wait for form to be visible
    await expect(page.getByRole('form', { name: 'Kontaktní formulář' })).toBeVisible();

    // Fill out the form
    await page.getByLabel('Křestní jméno').fill(testData.firstName);
    await page.getByLabel('Příjmení').fill(testData.lastName);
    await page.getByLabel('Telefonní číslo').fill(testData.phone);
    await page.getByLabel('E-mail').fill(testData.email);
    await page.getByLabel('Zpráva').fill(testData.message);

    // Select apartment type
    await page.getByText('2+KK').click();

    // Check newsletter
    await page
      .getByLabel('Chci být součástí newsletteru Daramis a získávat všechny novinky a informace.')
      .check();

    // Check privacy policy checkbox (required)
    await page.getByText('Odesláním formuláře souhlasíte se zpracováním').click();

    // Submit the form
    await page.getByRole('button', { name: 'Odeslat' }).click();

    // Wait for success message
    await expect(page.getByRole('button', { name: 'DĚKUJEME ZA ODESLÁNÍ FORMULÁŘE!' })).toBeVisible(
      { timeout: 10000 }
    );

    // Verify data was stored in Convex
    const client = new ConvexHttpClient(CONVEX_URL);

    // Wait a bit for data to be fully persisted
    await page.waitForTimeout(20000);

    const storedLead = await client.query(api.leads.getByEmail, {
      email: testData.email,
    });

    // Verify the lead was stored with correct data
    expect(storedLead).toBeTruthy();
    expect(storedLead?.firstName).toBe(testData.firstName);
    expect(storedLead?.lastName).toBe(testData.lastName);
    expect(storedLead?.email).toBe(testData.email);
    expect(storedLead?.phone).toBe(testData.phone);
    expect(storedLead?.message).toBe(testData.message);
    expect(storedLead?.apartmentType).toEqual(['2+KK']);
    expect(storedLead?.newsletter).toBe(true);
    expect(storedLead?.createdAt).toBeTruthy();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.goto('/contact');

    // Try to submit without filling any fields
    await page.getByRole('button', { name: 'Odeslat' }).click();

    // Wait for validation errors to appear
    // The form should prevent submission or show validation errors
    // Since required fields are empty, the submit button click should not proceed
    await page.waitForTimeout(1000);

    // Verify we're still on the form page (not redirected or showing success)
    await expect(page.getByRole('form', { name: 'Kontaktní formulář' })).toBeVisible();

    // The success message should NOT appear
    await expect(
      page.getByRole('button', { name: 'DĚKUJEME ZA ODESLÁNÍ FORMULÁŘE!' })
    ).not.toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/contact');

    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'invalid-email', // Invalid email format
      phone: '+420123456789',
      message: 'Test message',
    };

    // Fill out form with invalid email
    await page.getByLabel('Křestní jméno').fill(testData.firstName);
    await page.getByLabel('Příjmení').fill(testData.lastName);
    await page.getByLabel('E-mail').fill(testData.email);
    await page.getByLabel('Telefonní číslo').fill(testData.phone);
    await page.getByLabel('Zpráva').fill(testData.message);

    // Check privacy policy
    await page.getByText('Odesláním formuláře souhlasíte se zpracováním').click();

    // Try to submit
    await page.getByRole('button', { name: 'Odeslat' }).click();

    await page.waitForTimeout(1000);

    // Success message should NOT appear
    await expect(
      page.getByRole('button', { name: 'DĚKUJEME ZA ODESLÁNÍ FORMULÁŘE!' })
    ).not.toBeVisible();
  });
});
