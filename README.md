This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Testing

### Unit Tests

Run frontend unit tests:

```bash
pnpm test:frontend
```

Run Convex backend tests:

```bash
pnpm test:convex
```

Run all tests:

```bash
pnpm test:all
```

### End-to-End Tests

This project includes comprehensive E2E tests using Playwright that run automatically on PR creation against Vercel preview deployments.

Run E2E tests locally:

```bash
# Start dev server first
pnpm dev

# In another terminal, run tests
pnpm test:e2e

# Or run with UI mode for debugging
pnpm test:e2e:ui
```

**E2E Test Features:**

- ✅ Tests contact form submission
- ✅ Verifies data storage in Convex
- ✅ Validates form validation
- ✅ Runs automatically on PR creation
- ✅ Tests against Vercel preview deployments

For detailed E2E testing setup and configuration, see [E2E_TESTING_SETUP.md](./E2E_TESTING_SETUP.md).

**Required GitHub Secrets for E2E Tests:**

- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL

# Esens
