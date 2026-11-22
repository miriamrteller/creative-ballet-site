/* Creative Ballet Academy: shared page script.
 * The sign-up and enquiry forms are OpalSwift's own forms (creativeballet.opalswift.com),
 * embedded in a frame, so leads land straight in OpalSwift with no extra setup. */
(function () {
  var OPAL = 'https://creativeballet.opalswift.com';

  // Where the visitor came from (?src=instagram&campaign=chanuka, or utm_*), kept for the visit,
  // so OpalSwift shows the lead's channel and campaign.
  function tag(names, key) {
    try {
      var q = new URLSearchParams(location.search);
      for (var i = 0; i < names.length; i++) {
        var v = q.get(names[i]);
        if (v) { sessionStorage.setItem(key, v.slice(0, 200)); return v; }
      }
      return sessionStorage.getItem(key);
    } catch (e) { return null; }
  }
  var src = tag(['src', 'utm_source'], 'cba_src') || 'website';
  var campaign = tag(['campaign', 'utm_campaign'], 'cba_campaign');

  var boxes = document.querySelectorAll('.opal-form');
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    var params = new URLSearchParams({ src: src, lang: box.getAttribute('data-lang') || 'en' });
    if (campaign) params.set('campaign', campaign);
    var path = '/f/' + box.getAttribute('data-form');
    var frame = document.createElement('iframe');
    frame.src = OPAL + '/embed' + path + '?' + params.toString();
    frame.title = box.getAttribute('data-title') || 'Form';
    frame.loading = 'lazy';
    box.appendChild(frame);
    var open = document.createElement('a');
    open.className = 'opal-form-open';
    open.href = OPAL + path + '?' + params.toString();
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = box.getAttribute('data-lang') === 'he' ? 'הטופס לא נטען? לפתיחה בחלון חדש' : "Form not showing? Open it in a new tab";
    box.appendChild(open);
  }

  // Once the form is sent, OpalSwift tells this page: shrink the frame to the
  // thank-you message and scroll it into view, so the visitor sees it.
  window.addEventListener('message', function (e) {
    if (e.origin !== OPAL || !e.data || e.data.type !== 'opalswift:form-sent') return;
    var frames = document.querySelectorAll('.opal-form iframe');
    for (var k = 0; k < frames.length; k++) {
      if (frames[k].contentWindow !== e.source) continue;
      frames[k].style.height = '320px';
      var box = frames[k].closest('.opal-form') || frames[k];
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Hero video: play only when the visitor's device allows motion and isn't saving data.
  // Otherwise the still image (poster) stays, so nobody is blocked or distracted.
  var heroVideo = document.querySelector('video[data-autoplay]');
  if (heroVideo) {
    var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      (navigator.connection && navigator.connection.saveData);
    if (!still) {
      heroVideo.preload = 'auto';
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    }
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
