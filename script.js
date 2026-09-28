(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('navLinks');
  const mobile = window.matchMedia('(max-width: 600px)');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    document.body?.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  if (burger && nav) {
    burger.hidden = false;
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.header')) setMenu(false);
    });
    mobile.addEventListener('change', () => setMenu(false));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const email = 'muhammadkmussa@gmail.com';
  const copyButton = document.getElementById('copyEmail');
  if (copyButton && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      const status = document.getElementById('copyStatus');
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Could not copy. Select the email address above to copy it manually.';
      }
    });
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.hidden = false;
    form.noValidate = true;
    const fields = [
      { input: document.getElementById('cf-name'), error: document.getElementById('name-error'), message: 'Please enter your name.' },
      { input: document.getElementById('cf-msg'), error: document.getElementById('message-error'), message: 'Please add a short message about your project.' }
    ];
    fields.forEach(({ input, error }) => input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
      document.getElementById('formStatus').textContent = '';
    }));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = document.getElementById('formStatus');
      status.textContent = '';
      let firstInvalid;
      fields.forEach(({ input, error, message }) => {
        const valid = Boolean(input.value.trim());
        error.textContent = valid ? '' : message;
        input.setAttribute('aria-invalid', String(!valid));
        if (!valid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }
      const name = fields[0].input.value.trim();
      const organisation = document.getElementById('cf-biz').value.trim();
      const message = fields[1].input.value.trim();
      const text = `Hello Muhammad, my name is ${name}.${organisation ? `\nBusiness: ${organisation}` : ''}\n\n${message}`;
      if (event.submitter?.dataset.action === 'email') {
        const subject = `Project enquiry — ${organisation || name}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
        status.textContent = 'Your email app will open if configured. Review and send your message there.';
      } else {
        window.open(`https://wa.me/254708095949?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
        status.textContent = 'Continue in WhatsApp to review and send. If no tab opens, allow pop-ups and try again.';
      }
    });
  }
})();
