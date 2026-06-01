import type { NextConfig } from "next";
import path from "node:path";
import { withSentryConfig } from "@sentry/nextjs";

const shouldEnableSentry =
  process.env.NODE_ENV === "production" ||
  process.env.ENABLE_SENTRY === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true";

const sentryNoopModule = path.join(process.cwd(), "lib/sentry/noop.ts");

const nextConfig: NextConfig = {
  ...(shouldEnableSentry
    ? {}
    : {
        turbopack: {
          resolveAlias: {
            "@sentry/nextjs": sentryNoopModule,
          },
        },
        webpack(config) {
          config.resolve ??= {};
          config.resolve.alias ??= {};
          config.resolve.alias["@sentry/nextjs"] = sentryNoopModule;
          return config;
        },
      }),
};

export default shouldEnableSentry
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: true,
    })
  : nextConfig;
