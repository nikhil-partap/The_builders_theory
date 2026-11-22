/* RaktDoot contact address: the ONE place to set it.
   REPLACE the placeholder below with the team's real, monitored inbox before launch.
   Every page loads this file (index, privacy, terms, 404). It fills every link marked data-contact:
     <a data-contact data-subject="Optional subject">Write to us</a>   -> mailto:CONTACT_EMAIL?subject=...
     <span data-contact-text></span>                                  -> the address as text
   page.js reads window.RAKTDOOT_CONTACT for the partner form. */
(function () {
  var CONTACT_EMAIL = 'support@example.com'; // REPLACE ME: the only copy of the address on the site

  window.RAKTDOOT_CONTACT = CONTACT_EMAIL;
  function fill() {
    var links = document.querySelectorAll('a[data-contact]');
    for (var i = 0; i < links.length; i++) {
      var s = links[i].getAttribute('data-subject');
      links[i].setAttribute('href', 'mailto:' + CONTACT_EMAIL + (s ? '?subject=' + encodeURIComponent(s) : ''));
    }
    var texts = document.querySelectorAll('[data-contact-text]');
    for (var j = 0; j < texts.length; j++) texts[j].textContent = CONTACT_EMAIL;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
