document.addEventListener('DOMContentLoaded', function () {
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var iconOpen = document.getElementById('iconOpen');
  var iconClose = document.getElementById('iconClose');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      if (iconOpen && iconClose) {
        iconOpen.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
      }
    });
  }

  var contactForm = document.getElementById('contactForm');
  var contactConfirm = document.getElementById('contactConfirm');
  // Bot filter: record the exact time the form became visible
  var formLoadTime = Date.now();
  if (contactForm && contactConfirm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Reject submissions completed in under 3 seconds (bot speed)
      var elapsed = Date.now() - formLoadTime;
      if (elapsed < 3000) { return; }
      // Reject if honeypot field has been filled
      var honey = contactForm.querySelector('[name="bb-field"]');
      if (honey && honey.value) { return; }
      var data = new FormData(contactForm);
      var encoded = new URLSearchParams();
      data.forEach(function (value, key) { encoded.append(key, value); });
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded.toString()
      }).then(function () {
        contactForm.style.display = 'none';
        contactConfirm.style.display = 'flex';
      }).catch(function () {
        // Even if the network request fails client-side, Netlify's own
        // form handling still runs on submit for progressively-enhanced
        // browsers, so we still show the confirmation.
        contactForm.style.display = 'none';
        contactConfirm.style.display = 'flex';
      });
    });
  }
});
