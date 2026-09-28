const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '..', 'script.js'), 'utf8');

function setup({ clipboardFails = false } = {}) {
  const elements = new Map();
  let focused;
  const opened = [];
  const copied = [];
  const documentListeners = {};
  const element = (id) => {
    const attrs = {};
    const listeners = {};
    const classes = new Set();
    const item = {
      id, value: '', textContent: '', hidden: true,
      addEventListener: (name, callback) => { listeners[name] = callback; },
      emit: (name, event = {}) => listeners[name]?.(event),
      setAttribute: (name, value) => { attrs[name] = value; },
      getAttribute: (name) => attrs[name],
      removeAttribute: (name) => { delete attrs[name]; },
      classList: {
        add: (name) => classes.add(name),
        toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name),
        contains: (name) => classes.has(name)
      },
      focus: () => { focused = id; }
    };
    elements.set(id, item);
    return item;
  };
  ['burger','navLinks','year','copyEmail','copyStatus','contactForm','cf-name','cf-biz','cf-msg','name-error','message-error','formStatus'].forEach(element);
  const window = {
    isSecureContext: true,
    matchMedia: () => ({ addEventListener() {} }),
    location: { href: '' },
    open: (...args) => opened.push(args)
  };
  runInNewContext(source, {
    window,
    navigator: { clipboard: { writeText: async (text) => {
      if (clipboardFails) throw new Error('Permission denied');
      copied.push(text);
    } } },
    document: {
      documentElement: { classList: { add() {} } },
      getElementById: (id) => elements.get(id),
      addEventListener: (name, callback) => { documentListeners[name] = callback; }
    }
  });
  return {
    get: (id) => elements.get(id), window, opened, copied,
    focused: () => focused,
    key: (key) => documentListeners.keydown({ key }),
    submit: (action) => elements.get('contactForm').emit('submit', { preventDefault() {}, submitter: { dataset: { action } } })
  };
}

test('empty or whitespace-only enquiry stays local and focuses the invalid field', () => {
  const app = setup();
  app.get('cf-name').value = '   ';
  app.submit('wa');
  assert.equal(app.opened.length, 0);
  assert.equal(app.window.location.href, '');
  assert.equal(app.focused(), 'cf-name');
  assert.equal(app.get('cf-msg').getAttribute('aria-invalid'), 'true');
  assert.match(app.get('message-error').textContent, /message/);
});

test('WhatsApp draft preserves special characters and never claims the message was sent', () => {
  const app = setup();
  app.get('cf-name').value = ' Amina & Ali ';
  app.get('cf-biz').value = 'Shop #1';
  app.get('cf-msg').value = 'Need stock + sales\nCan we talk?';
  app.submit('wa');
  const [destination, target, features] = app.opened[0];
  const url = new URL(destination);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/254708095949');
  assert.equal(url.searchParams.get('text'), 'Hello Muhammad, my name is Amina & Ali.\nBusiness: Shop #1\n\nNeed stock + sales\nCan we talk?');
  assert.equal(target, '_blank');
  assert.match(features, /noopener/);
  assert.match(app.get('formStatus').textContent, /review and send/);
});

test('email draft uses the chosen email app and preserves input', () => {
  const app = setup();
  app.get('cf-name').value = 'Amina';
  app.get('cf-msg').value = 'A booking system?';
  app.submit('email');
  const url = new URL(app.window.location.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'muhammadkmussa@gmail.com');
  assert.equal(url.searchParams.get('subject'), 'Project enquiry — Amina');
  assert.match(url.searchParams.get('body'), /A booking system\?/);
  assert.equal(app.get('cf-msg').value, 'A booking system?');
  assert.equal(app.opened.length, 0);
});

test('editing a field clears its error', () => {
  const app = setup();
  app.submit('wa');
  app.get('cf-name').value = 'Amina';
  app.get('cf-name').emit('input');
  assert.equal(app.get('name-error').textContent, '');
  assert.equal(app.get('cf-name').getAttribute('aria-invalid'), undefined);
});

test('Escape closes the mobile menu and returns keyboard focus', () => {
  const app = setup();
  app.get('burger').emit('click');
  assert.equal(app.get('burger').getAttribute('aria-expanded'), 'true');
  app.key('Escape');
  assert.equal(app.get('burger').getAttribute('aria-expanded'), 'false');
  assert.equal(app.get('navLinks').classList.contains('open'), false);
  assert.equal(app.focused(), 'burger');
});

test('clipboard feedback covers success and permission failure', async () => {
  const app = setup();
  await app.get('copyEmail').emit('click');
  assert.equal(app.copied[0], 'muhammadkmussa@gmail.com');
  assert.equal(app.get('copyStatus').textContent, 'Email address copied.');
  const failed = setup({ clipboardFails: true });
  await failed.get('copyEmail').emit('click');
  assert.match(failed.get('copyStatus').textContent, /Could not copy/);
});
