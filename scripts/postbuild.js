#!/usr/bin/env node
/**
 * Postbuild script for Cloudflare Pages deployment
 * Generates _worker.js and _routes.json for proper SSR routing
 * Copies static assets from client/ to dist root for Pages upload
 */

import { writeFileSync, cpSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');
const clientDir = join(distDir, 'client');

console.log('🔧 Running postbuild script for Cloudflare Pages...');

// 1. Copy static assets from dist/client to dist root
// Cloudflare Pages only uploads files from build output dir root
if (existsSync(clientDir)) {
  cpSync(clientDir, distDir, { recursive: true });
  console.log('✅ Copied static assets from client/ to dist/');
} else {
  console.log('⚠️  No client directory found, skipping asset copy');
}

// 2. Generate _worker.js (entry point for Cloudflare Workers)
const workerContent = `import worker from "./server/entry.mjs";
export default worker;
`;

writeFileSync(join(distDir, '_worker.js'), workerContent);
console.log('✅ Generated _worker.js');

// 3. Generate _routes.json (static vs dynamic routing)
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
