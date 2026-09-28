const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const pages = fs.readdirSync(path.join(__dirname, '..')).filter(file => file.endsWith('.html'));

function runLoader(html, hostname, now) {
  const written = [];
  const scripts = [];
  const document = {
    write: html => written.push(html),
    createElement: () => ({ async: true }),
    body: { append: tag => scripts.push(tag) },
  };
  const window = { location: { hostname } };
  const context = { document, window, location: window.location, Date: { now: () => now } };
  for (const id of ['portfolio-assets', 'portfolio-scripts']) {
    const match = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`));
    assert.ok(match, `missing ${id}`);
    vm.runInNewContext(match[1], context);
  }
  return { written, scripts };
}

test('all pages load the ordered CSS and JS with fresh local URLs', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
    const first = runLoader(html, '127.0.0.1', 1000);
    const second = runLoader(html, '127.0.0.1', 2000);
    assert.equal(first.written.length, 3, page);
    assert.deepEqual(first.scripts.map(script => script.async), [false, false, false], page);
    assert.notEqual(first.written[0], second.written[0], page);
    assert.match(first.written[2], /fidelity\.css\?v=/);
    assert.match(first.scripts[2].src, /interactions\.js\?v=/);
    assert.match(html, /<noscript><link rel="stylesheet"/);
  }
});

test('production asset URLs stay stable for caching and revalidation', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.deepEqual(runLoader(html, 'muhammadmussa.vercel.app', 1000).written,
    runLoader(html, 'muhammadmussa.vercel.app', 2000).written);
});
