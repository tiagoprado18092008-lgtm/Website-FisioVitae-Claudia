#!/usr/bin/env node
/**
 * Bump the cache-busting query string on assets/main.js across every .html file.
 * Usage: node scripts/bust-js.js [version]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const version = process.argv[2] || String(Date.now());

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let touched = 0;
for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;
  html = html.replace(
    /src="assets\/main\.js(?:\?[^"]*)?"/g,
    `src="assets/main.js?v=${version}"`
  );
  if (html !== before) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`OK ${f}`);
    touched++;
  } else {
    console.log(`-- ${f}`);
  }
}
console.log(`Done. Updated ${touched} files. version=${version}`);
