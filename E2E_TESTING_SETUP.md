# E2E Testing Setup Guide

This guide explains how to set up and run end-to-end (E2E) tests for the contact form using Playwright, with automatic execution on Vercel preview deployments.

## Overview

The E2E testing setup includes:

- **Playwright** for browser automation and testing
- **Convex verification** to ensure data is properly stored
- **GitHub Actions** workflow that runs on PR creation
- **Vercel preview deployment** integration for testing live deployments

## Prerequisites

1. Vercel project with preview deployments configured
2. Convex backend deployed and accessible
3. GitHub repository with Actions enabled

## Local Setup

### 1. Install Dependencies

All dependencies are already included in `package.json`. Run:

```bash
pnpm install
```

### 2. Install Playwright Browsers

```bash
pnpm playwright:install
```

### 3. Set Environment Variables

Create a `.env.local` file (if not already present) with:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 4. Run Tests Locally

Start your development server:

```bash
pnpm dev
```

In another terminal, run the E2E tests:

```bash
pnpm test:e2e
```

### Available Test Commands

- `pnpm test:e2e` - Run all E2E tests in headless mode
- `pnpm test:e2e:ui` - Run tests with Playwright UI (interactive mode)
- `pnpm test:e2e:debug` - Run tests in debug mode with step-by-step execution

## GitHub Actions Setup

### Required GitHub Secrets

To run E2E tests on PR creation, configure the following secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

1. **`NEXT_PUBLIC_CONVEX_URL`** (Required)
   - Your Convex deployment URL
   - Example: `https://your-project.convex.cloud`
   - Used by tests to verify data storage in Convex

2. **`GITHUB_TOKEN`** (Automatically provided)
   - This is automatically provided by GitHub Actions
   - No manual configuration needed
   - Used to wait for Vercel deployment and comment on PRs

### How It Works

When a PR is created or updated:

1. **Vercel deploys** a preview build automatically
2. **GitHub Actions workflow** (`.github/workflows/e2e.yml`) triggers
3. **Workflow waits** for Vercel deployment to complete (max 5 minutes)
4. **Playwright tests run** against the Vercel preview URL
5. **Tests verify**:
   - Form submission works correctly
   - Data is stored in Convex
   - Success message displays
   - Validation works properly
6. **Results posted** as a comment on the PR
7. **Artifacts uploaded** (test reports and screenshots if tests fail)

## Test Coverage

The E2E test suite includes:

### 1. Successful Form Submission

- Fills out all form fields with valid data
- Submits the form
- Verifies success message appears
- **Queries Convex** to confirm data was stored correctly
- Validates all form data matches what was submitted

### 2. Validation Testing

- Tests empty required fields
- Tests invalid email format
- Ensures proper error handling

### 3. Data Verification

- Uses unique email addresses (timestamped) for each test run
- Queries Convex database to verify data persistence
- Validates all fields including apartment type and newsletter preferences

## Architecture

### Files Created

```
├── playwright.config.ts              # Playwright configuration
├── e2e/
│   └── contact-form.spec.ts         # E2E test suite
├── .github/
│   └── workflows/
│       └── e2e.yml                  # GitHub Actions workflow
└── convex/
    └── leads.ts                     # Added getByEmail query
```

### Convex Query Function

Added to `convex/leads.ts`:

```typescript
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('leads')
      .filter((q) => q.eq(q.field('email'), args.email))
      .order('desc')
      .first();
  },
});
```

This query allows tests to verify that form submissions are properly stored in Convex.

## Troubleshooting

### Tests Fail Locally

1. **Check Convex URL**: Ensure `NEXT_PUBLIC_CONVEX_URL` is set correctly
2. **Dev server running**: Make sure `pnpm dev` is running on port 3000
3. **Clear cache**: Try `rm -rf .next && pnpm dev`

### Tests Fail on GitHub Actions

1. **Check GitHub Secrets**: Verify `NEXT_PUBLIC_CONVEX_URL` is set in repository secrets
2. **Vercel deployment**: Ensure Vercel preview deployments are enabled
3. **Check workflow logs**: Review the GitHub Actions logs for specific errors
4. **Review artifacts**: Download test screenshots and reports from failed runs

### Vercel Deployment Timeout

If the workflow times out waiting for Vercel:

1. Check Vercel dashboard for deployment issues
2. Increase `max_timeout` in `.github/workflows/e2e.yml` (currently 300 seconds)
3. Ensure Vercel GitHub integration is properly configured

## Viewing Test Results

### In GitHub Actions

1. Go to the **Actions** tab in your repository
2. Select the **E2E Tests** workflow
3. View the test results in the workflow run logs
4. Check PR comments for a summary of test results

### Test Artifacts

When tests run on CI:

- **Playwright HTML Report**: Full test report with timeline and traces
- **Screenshots**: Captured on test failures
- **Videos**: Recorded if configured (currently disabled)

Download artifacts from the workflow run page.

## Best Practices

1. **Unique Test Data**: Tests use timestamps to generate unique email addresses, avoiding data conflicts
2. **Wait Strategies**: Tests use proper waits for form submission and Convex storage
3. **Isolation**: Each test is independent and doesn't rely on other tests
4. **Cleanup**: Consider adding a cleanup step to remove test data (optional)

## Future Enhancements

Potential improvements:

- Add more test scenarios (edge cases, error conditions)
- Test different apartment type selections
- Add visual regression testing
- Implement test data cleanup after runs
- Add performance metrics
- Test on multiple browsers (currently only Chromium)

## Support

For issues or questions:

1. Check GitHub Actions logs
2. Review Playwright documentation: https://playwright.dev
3. Verify Convex deployment status
4. Check Vercel deployment logs
