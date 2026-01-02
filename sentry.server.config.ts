// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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
  beforeSend(event, hint) {
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

      // Sanitize mutation payload
      if (event.extra.mutationPayload && typeof event.extra.mutationPayload === 'object') {
        const payload = event.extra.mutationPayload as Record<string, unknown>;
        if (payload.email) payload.email = '[REDACTED]';
        if (payload.phone) payload.phone = '[REDACTED]';
      }

      // Sanitize formData
      if (event.extra.formData && typeof event.extra.formData === 'object') {
        const formData = event.extra.formData as Record<string, unknown>;
        if (formData.email) formData.email = '[REDACTED]';
        if (formData.phone) formData.phone = '[REDACTED]';
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
