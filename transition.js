document.addEventListener('DOMContentLoaded', function () {

  /* ---- Portone che si apre al click su "Scopri" ---- */
  var overlay = document.createElement('div');
  overlay.className = 'door-overlay';
  overlay.innerHTML =
    '<div class="door-panel door-left"><span class="door-handle"></span></div>' +
    '<div class="door-panel door-right"><span class="door-handle"></span></div>' +
    '<div class="door-light"></div>';
  document.body.appendChild(overlay);

  document.querySelectorAll('.discover-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var href = btn.getAttribute('href');
      overlay.classList.add('active');
      setTimeout(function () {
        window.location.href = href;
      }, 950);
    });
  });

  /* ---- Foto che risalgono allo scroll (stile Red Bull) ---- */
  var photos = document.querySelectorAll('.full-gallery .ph');
  if (photos.length) {
    photos.forEach(function (el, i) {
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
    photos.forEach(function (el) { io.observe(el); });
  }
});
