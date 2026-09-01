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
      var lang = 'it';
      try { lang = localStorage.getItem('ts-lang') || 'it'; } catch (err) {}
      var label = btn.getAttribute('data-label') || '';
      if (lang === 'en' && btn.getAttribute('data-label-en')) {
        label = btn.getAttribute('data-label-en');
      }
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

  /* ---- Carosello alloggi trascinabile (stile Red Bull) ---- */
  document.querySelectorAll('.apt-carousel').forEach(function (track) {
    var isDown = false, startX = 0, startScroll = 0, moved = false;

    function pointerDown(e) {
      isDown = true;
      moved = false;
      track.classList.add('dragging');
      startX = (e.touches ? e.touches[0].pageX : e.pageX);
      startScroll = track.scrollLeft;
    }
    function pointerMove(e) {
      if (!isDown) return;
      var x = (e.touches ? e.touches[0].pageX : e.pageX);
      var delta = x - startX;
      if (Math.abs(delta) > 4) moved = true;
      track.scrollLeft = startScroll - delta;
      if (!e.touches) e.preventDefault();
    }
    function pointerUp() {
      isDown = false;
      track.classList.remove('dragging');
    }

    track.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);
    track.addEventListener('touchstart', pointerDown, { passive: true });
    track.addEventListener('touchmove', pointerMove, { passive: true });
    track.addEventListener('touchend', pointerUp);

    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // ---- avanzamento automatico ogni 7s, in pausa durante il drag/hover ----
    var autoTimer = null;
    function scrollToNextCard() {
      var card = track.querySelector('.apt-card');
      if (!card) return;
      var step = card.offsetWidth + 20; // width + gap
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' });
    }
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(scrollToNextCard, 7000);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    track.addEventListener('touchstart', stopAuto, { passive: true });
    startAuto();

    // ---- frecce avanti/indietro ----
    var wrap = track.closest('.apt-carousel-wrap');
    if (wrap) {
      wrap.querySelectorAll('.apt-nav-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          stopAuto();
          var card = track.querySelector('.apt-card');
          var step = card ? card.offsetWidth + 20 : 320;
          var dir = parseInt(btn.getAttribute('data-dir'), 10);
          var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
          var atStart = track.scrollLeft <= 4;
          if (dir > 0 && atEnd) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else if (dir < 0 && atStart) {
            track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
          } else {
            track.scrollBy({ left: step * dir, behavior: 'smooth' });
          }
          startAuto();
        });
      });
    }
  });

  /* ---- Rotazione foto nelle card alloggi ogni 5s ---- */
  document.querySelectorAll('.apt-card-photo').forEach(function (photoBox) {
    var imgs = photoBox.querySelectorAll('img');
    if (imgs.length < 2) return;
    var i = 0;
    setInterval(function () {
      imgs[i].classList.remove('active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('active');
    }, 5000);
  });

  /* ---- Menu capitoli (Torino da Vivere) ---- */
  var chaptersToggle = document.getElementById('chaptersToggle');
  var chaptersPanel = document.getElementById('chaptersPanel');
  if (chaptersToggle && chaptersPanel) {
    chaptersToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      chaptersToggle.classList.toggle('open');
      chaptersPanel.classList.toggle('open');
    });
    chaptersPanel.querySelectorAll('.chapters-link').forEach(function (link) {
      link.addEventListener('click', function () {
        chaptersToggle.classList.remove('open');
        chaptersPanel.classList.remove('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!chaptersPanel.contains(e.target) && !chaptersToggle.contains(e.target)) {
        chaptersToggle.classList.remove('open');
        chaptersPanel.classList.remove('open');
      }
    });
  }

  /* ---- Cookie banner ---- */
  var cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    var consent = null;
    try { consent = localStorage.getItem('ts-cookie-consent'); } catch (e) {}
    if (!consent) {
      cookieBanner.classList.add('visible');
    }
    var acceptBtn = document.getElementById('cookieAccept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        cookieBanner.classList.remove('visible');
        try { localStorage.setItem('ts-cookie-consent', 'accepted'); } catch (e) {}
      });
    }
  }
});
