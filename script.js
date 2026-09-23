(function () {
  var burger = document.getElementById('burger');
  var nav = document.getElementById('navLinks');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var WHATSAPP = '254708095949';
  var EMAIL = 'muhammadkmussa@gmail.com';
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('cf-name').value || '').trim();
      var biz = (document.getElementById('cf-biz').value || '').trim();
      var msg = (document.getElementById('cf-msg').value || '').trim();
      if (!name || !msg) {
        alert('Please add your name and a short message.');
        return;
      }
      var action = (e.submitter && e.submitter.getAttribute('data-action')) || 'wa';
      var subject = 'Project enquiry' + (biz ? ' \u2014 ' + biz : ' \u2014 ' + name);
      var text = 'Hello Muhammad, my name is ' + name + '.'
        + (biz ? '\nBusiness: ' + biz : '')
        + '\n\n' + msg;

      if (action === 'email') {
        var url = 'https://mail.google.com/mail/?view=cm&fs=1'
          + '&to=' + encodeURIComponent(EMAIL)
          + '&su=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(text + '\n\n(Sent from your portfolio)');
        window.open(url, '_blank', 'noopener');
      } else {
        var wa = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
        window.open(wa, '_blank', 'noopener');
      }
    });
  }
})();
