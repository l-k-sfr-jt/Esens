// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://7cdcd2e0155c23dcf14da4d19b5cc2b6@o4510586940817408.ingest.de.sentry.io/4510586941276240',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Sanitize sensitive data before sending to Sentry
  beforeSend(event) {
    // Sanitize form data in extra context
    if (event.extra) {
      // Sanitize email addresses
      if (event.extra.email) {
        event.extra.email = '[REDACTED]';
      }

      // Sanitize phone numbers
      if (event.extra.phone) {
        event.extra.phone = '[REDACTED]';
      }

      // Sanitize form state data
      if (event.extra.formState && typeof event.extra.formState === 'object') {
        const formState = event.extra.formState as Record<string, unknown>;
        if (formState.email) formState.email = '[REDACTED]';
        if (formState.phone) formState.phone = '[REDACTED]';
        if (formState.firstName) formState.firstName = '[REDACTED]';
        if (formState.lastName) formState.lastName = '[REDACTED]';
      }
    }

    // Sanitize breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          const data = { ...breadcrumb.data };
          if (data.email) data.email = '[REDACTED]';
          if (data.phone) data.phone = '[REDACTED]';
          if (data.firstName) data.firstName = '[REDACTED]';
          if (data.lastName) data.lastName = '[REDACTED]';
          if (data.value && typeof data.value === 'string') {
            // Redact values that might contain sensitive information
            if (breadcrumb.message?.includes('email') || breadcrumb.message?.includes('phone')) {
              data.value = '[REDACTED]';
            }
          }
          return { ...breadcrumb, data };
        }
        return breadcrumb;
      });
    }

    // Sanitize request data
    if (event.request?.data) {
      const data = { ...event.request.data };
      if (typeof data === 'object') {
        const sanitized = data as Record<string, unknown>;
        if (sanitized.email) sanitized.email = '[REDACTED]';
        if (sanitized.phone) sanitized.phone = '[REDACTED]';
        if (sanitized.firstName) sanitized.firstName = '[REDACTED]';
        if (sanitized.lastName) sanitized.lastName = '[REDACTED]';
        event.request.data = sanitized;
      }
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
