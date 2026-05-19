/**
 * Patches react-native-audio-api so its C++ headers compile under the
 * Xcode 26 / newer libc++ toolchain.
 *
 * audioapi/core/Constants.h uses bare `size_t` (e.g.
 * `static constexpr size_t MAX_FFT_SIZE`) but only includes <cmath> and
 * <limits>. Older libc++ transitively pulled in <cstddef>, so `size_t`
 * resolved in the global namespace. Newer libc++ (shipped with Xcode 26+)
 * no longer does, producing:
 *
 *   error: unknown type name 'size_t'; did you mean 'std::size_t'?
 *
 * Fix: ensure <cstddef> is included. Idempotent — safe to run repeatedly
 * and a no-op if the include is already present.
 */
const fs = require('fs');
const path = require('path');

const nodeModulesRoots = [
    path.resolve(__dirname, '..', 'node_modules'),
    path.resolve(__dirname, '..', 'packages/happy-app/node_modules'),
];

const RELATIVE = 'react-native-audio-api/common/cpp/audioapi/core/Constants.h';

let patched = 0;
for (const root of nodeModulesRoots) {
    const file = path.join(root, RELATIVE);
    if (!fs.existsSync(file)) {
        continue;
    }
    const original = fs.readFileSync(file, 'utf8');
    if (original.includes('#include <cstddef>')) {
        continue;
    }
    const updated = original.replace(
        '#include <cmath>\n#include <limits>',
        '#include <cmath>\n#include <cstddef>\n#include <limits>'
    );
    if (updated !== original) {
        fs.writeFileSync(file, updated, 'utf8');
        patched++;
    }
}

if (patched > 0) {
    console.log(`[patch] fix-rn-audio-api-cstddef: patched ${patched} file(s)`);
}
