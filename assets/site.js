/* Creative Ballet Academy: shared page script (enquiry form + language choice).
 * Enquiries go to the studio's OpalSwift leads list (crm-lead-capture). */
(function () {
  var he = document.documentElement.lang === 'he';
  var ENDPOINT = 'https://acmujrhavgbamdilzuew.supabase.co/functions/v1/crm-lead-capture';
  var EMAIL = 'info@creativeballetacademy.com';
  var WHATSAPP = 'https://wa.me/972584421987';

  var text = he ? {
    sending: 'שולחת...',
    thanks: 'תודה! הפנייה התקבלה, ונחזור אליך בקרוב.',
    needContact: 'נא למלא אימייל או טלפון, כדי שנוכל לחזור אליך.',
    spam: 'לא הצלחנו לשלוח. נא לבדוק את השם וההודעה ולנסות שוב.',
    failed: 'משהו השתבש. אפשר לכתוב לנו בוואטסאפ או במייל ל-' + EMAIL + '.'
  } : {
    sending: 'Sending...',
    thanks: "Thank you! We've received your message and will be in touch soon.",
    needContact: 'Please add an email or a phone number so we can get back to you.',
    spam: "We couldn't send that. Please check your name and message and try again.",
    failed: 'Something went wrong. Please message us on WhatsApp or email ' + EMAIL + '.'
  };

  // Remember where the visitor came from (?src=instagram&campaign=chanuka, or utm_*),
  // so the lead shows its channel and campaign in OpalSwift.
  function rememberSource() {
    try {
      var q = new URLSearchParams(location.search);
      var src = q.get('src') || q.get('utm_source');
      var campaign = q.get('campaign') || q.get('utm_campaign');
      if (src) sessionStorage.setItem('cba_src', src.slice(0, 40));
      if (campaign) sessionStorage.setItem('cba_campaign', campaign.slice(0, 500));
    } catch (e) { /* storage blocked: fine */ }
  }
  function stored(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  rememberSource();

  function val(id) {
    var el = document.getElementById(id);
    return el && el.value.trim() ? el.value.trim() : null;
  }

  var form = document.getElementById('contact-form');
  if (form) {
    var openedAt = Date.now();
    var statusEl = document.getElementById('contact-form-status');
    var submitBtn = form.querySelector('.contact-submit');

    function show(message, kind, withWhatsApp) {
      statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
      statusEl.textContent = message;
      if (withWhatsApp) {
        var a = document.createElement('a');
        a.href = WHATSAPP;
        a.className = 'status-whatsapp';
        a.textContent = he ? 'לוואטסאפ' : 'Open WhatsApp';
        a.target = '_blank';
        a.rel = 'noopener';
        statusEl.appendChild(document.createTextNode(' '));
        statusEl.appendChild(a);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = val('parent-email');
      var phone = val('parent-phone');
      if (!email && !phone) {
        show(text.needContact, 'error');
        document.getElementById('parent-email').focus();
        return;
      }

      // Home page: child's grade + which class. Workshops page: celebration type.
      var grade = val('child-grade');
      var message = val('parent-message');
      var interest = val('event-type') || val('class-choice') || 'Classes';
      if (grade) message = 'Grade: ' + grade + (message ? ' | ' + message : '');

      submitBtn.disabled = true;
      show(text.sending, '');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSubdomain: 'creativeballet',
          name: val('parent-name'),
          email: email,
          phone: phone,
          message: message,
          interest: interest.slice(0, 200),
          src: stored('cba_src') || 'website',
          campaign: stored('cba_campaign'),
          elapsedMs: Date.now() - openedAt,
          website: val('cba-website')
        })
      }).then(function (res) {
        submitBtn.disabled = false;
        if (res.ok) {
          show(text.thanks, 'ok');
          form.reset();
        } else if (res.status === 422) {
          show(text.spam, 'error');
        } else {
          show(text.failed, 'error', true);
        }
      }).catch(function () {
        submitBtn.disabled = false;
        show(text.failed, 'error', true);
      });
    });
  }

  // The language button remembers the language the visitor is switching TO.
  var langSwitch = document.getElementById('lang-switch');
  if (langSwitch) {
    langSwitch.addEventListener('click', function () {
      var to = langSwitch.getAttribute('hreflang') === 'he' ? 'he' : 'en';
      document.cookie = 'lang_pref=' + to + '; path=/; max-age=' + (60 * 60 * 24 * 365) + '; SameSite=Lax';
    });
  }
})();
