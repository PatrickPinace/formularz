#!/usr/bin/env node
/**
 * Postbuild script for Cloudflare Pages deployment
 * Generates _worker.js and _routes.json for proper SSR routing
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

console.log('🔧 Running postbuild script for Cloudflare Pages...');

// 1. Generate _worker.js (entry point for Cloudflare Workers)
const workerContent = `import worker from "./server/entry.mjs";
export default worker;
`;

writeFileSync(join(distDir, '_worker.js'), workerContent);
console.log('✅ Generated _worker.js');

// 2. Generate _routes.json (static vs dynamic routing)
const routesConfig = {
  version: 1,
  include: ['/*'],
  exclude: [
    '/_astro/*',
    '/favicon.ico',
    '/favicon.svg'
  ]
};

writeFileSync(join(distDir, '_routes.json'), JSON.stringify(routesConfig, null, 2));
console.log('✅ Generated _routes.json');

console.log('🎉 Postbuild complete! Ready for Cloudflare Pages deployment.');
