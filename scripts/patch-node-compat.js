/**
 * Patches fork-ts-checker-webpack-plugin's bundled ajv-keywords@3
 * so it doesn't crash on Node 20+.
 *
 * The bug: ajv-keywords@3 _formatLimit.js does `ajv._formats.date`
 * but that property no longer exists in ajv@6 on Node 20+.
 * We replace the file with a safe no-op that exports an empty function.
 */
const fs = require('fs');
const path = require('path');

const targets = [
  // Standard location inside fork-ts-checker-webpack-plugin
  path.join(__dirname, '..', 'node_modules', 'fork-ts-checker-webpack-plugin',
    'node_modules', 'ajv-keywords', 'keywords', '_formatLimit.js'),
];

let patched = 0;
for (const target of targets) {
  if (!fs.existsSync(target)) continue;
  const content = fs.readFileSync(target, 'utf8');
  if (content.includes('/* node-compat-patched */')) continue;

  fs.writeFileSync(
    target,
    '/* node-compat-patched */\n' +
    '// Replaced to fix Node 20+ crash (ajv-keywords@3 _formatLimit.js bug)\n' +
    'module.exports = function() {};\n'
  );
  console.log('[patch-node-compat] Patched:', target);
  patched++;
}

if (patched === 0) {
  console.log('[patch-node-compat] Nothing to patch (target not found or already patched).');
}
