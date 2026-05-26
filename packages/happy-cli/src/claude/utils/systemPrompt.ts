import { trimIdent } from "@/utils/trimIdent";
import { shouldIncludeCoAuthoredBy } from "./claudeSettings";

/**
 * Co-authored-by credits to append when enabled. Standard Claude Code credit;
 * no mention of this wrapper.
 */
const CO_AUTHORED_CREDITS = (() => trimIdent(`
    When making commit messages, append:

    <main commit message>

    Generated with [Claude Code](https://claude.ai/code)

    Co-Authored-By: Claude <noreply@anthropic.com>
`))();

/**
 * System prompt with conditional Co-Authored-By lines based on Claude's settings.json configuration.
 * Settings are read once on startup for performance.
 * No wrapper-specific instructions are injected — the upstream's chat-title MCP nudge has been
 * removed so the user's prompt is not polluted.
 */
export const systemPrompt = (() => {
  const includeCoAuthored = shouldIncludeCoAuthoredBy();
  return includeCoAuthored ? CO_AUTHORED_CREDITS : '';
})();