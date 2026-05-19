import type PostHog from 'posthog-react-native';

// Analytics permanently disabled for the isolated hjk fork.
// No PostHog client is ever constructed — zero telemetry phone-home.
// Typed as `PostHog | null` so existing `tracking?.capture(...)` call sites
// keep type-checking; the value is always null, so they are no-ops.
export const tracking: PostHog | null = null;
