import * as Sentry from "@sentry/nextjs";

const shouldEnableSentry =
  process.env.NODE_ENV === "production" ||
  process.env.ENABLE_SENTRY === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true";

export async function register() {
  if (!shouldEnableSentry) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError: typeof Sentry.captureRequestError = (
  error,
  request,
  errorContext,
) => {
  if (!shouldEnableSentry) {
    return;
  }

  Sentry.captureRequestError(error, request, errorContext);
};
