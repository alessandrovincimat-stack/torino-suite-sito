document.addEventListener('DOMContentLoaded', function () {

  /* ---- Transizione cinematica "swoosh" al click su "Scopri" ---- */
  var overlay = document.createElement('div');
  overlay.className = 'swoosh-overlay';
  overlay.innerHTML =
    '<div class="swoosh-panel"></div>' +
    '<div class="swoosh-tag"><span class="swoosh-eyebrow">Torino Suite</span><span class="swoosh-name"></span></div>';
  document.body.appendChild(overlay);
  var swooshName = overlay.querySelector('.swoosh-name');

  document.querySelectorAll('.discover-btn, .story-link').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var href = btn.getAttribute('href');
      var label = btn.getAttribute('data-label') || '';
      swooshName.textContent = label;
      overlay.classList.add('active');
      setTimeout(function () {
        window.location.href = href;
      }, 1050);
    });
  });

  /* ---- Reveal on scroll: gallery photos + tutti gli elementi .reveal ---- */
  var targets = document.querySelectorAll('.full-gallery .ph, .reveal, .story-section');
  if (targets.length) {
    var galleryPhotos = document.querySelectorAll('.full-gallery .ph');
    galleryPhotos.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 3) * 0.09) + 's';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }
});
