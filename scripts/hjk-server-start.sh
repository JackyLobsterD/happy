#!/bin/bash
# Wrapper for launchd: run the hjk self-hosted server (standalone/PGlite).
# Foreground (launchd supervises). Migrate is idempotent so safe each boot.

set -e
cd /Users/jk/Code/jk/tool/happy/packages/happy-server

NODE=/opt/homebrew/bin/node
TSX="$NODE /Users/jk/Code/jk/tool/happy/node_modules/.bin/tsx"

$TSX --env-file=.env.dev ./sources/standalone.ts migrate
exec $TSX --env-file=.env.dev ./sources/standalone.ts serve
