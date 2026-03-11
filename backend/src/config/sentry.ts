import * as Sentry from "@sentry/node";

export const initSentry = () => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });
};