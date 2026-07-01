(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* ---------------- Language switch (AR / FR / EN) ---------------- */
  var LANG_DIR = { ar: 'rtl', fr: 'ltr', en: 'ltr' };
  var LANG_ORDER = ['ar', 'fr', 'en'];

  function setLang(lang) {
    if (LANG_ORDER.indexOf(lang) === -1) lang = 'ar';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', LANG_DIR[lang]);
    html.setAttribute('data-lang', lang);
    Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]')).forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang-btn') === lang);
    });
    try {
      localStorage.setItem('selena-lang', lang);
    } catch (e) {
      /* storage unavailable, ignore */
    }
  }

  function cycleLang() {
    var current = html.getAttribute('data-lang') || 'ar';
    var idx = LANG_ORDER.indexOf(current);
    setLang(LANG_ORDER[(idx + 1) % LANG_ORDER.length]);
  }

  var savedLang = null;
  try {
    savedLang = localStorage.getItem('selena-lang');
  } catch (e) {
    /* ignore */
  }
  setLang(LANG_ORDER.indexOf(savedLang) !== -1 ? savedLang : 'ar');

  Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang-btn'));
    });
  });
  var langToggle = document.getElementById('lang-toggle');
  var langToggleMobile = document.getElementById('lang-toggle-mobile');
  if (langToggle) langToggle.addEventListener('click', cycleLang);
  if (langToggleMobile) langToggleMobile.addEventListener('click', cycleLang);

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  var iconBurger = document.getElementById('icon-burger');
  var iconClose = document.getElementById('icon-close');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = !mobileNav.classList.contains('hidden');
      mobileNav.classList.toggle('hidden');
      mobileNav.classList.toggle('flex');
      iconBurger.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
        iconBurger.classList.remove('hidden');
        iconClose.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id], footer[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function updateActiveNav() {
    var scrollPos = window.scrollY + window.innerHeight * 0.3;
    var currentId = sections.length ? sections[0].id : null;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      var matches = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', matches);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------------- Header background on scroll ---------------- */
  var header = document.getElementById('site-header');
  function updateHeaderBg() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('bg-night-950/85', 'backdrop-blur-md', 'border-b', 'hairline-gold');
    } else {
      header.classList.remove('bg-night-950/85', 'backdrop-blur-md', 'border-b', 'hairline-gold');
    }
  }
  window.addEventListener('scroll', updateHeaderBg, { passive: true });
  updateHeaderBg();

  /* ---------------- Stagger menu/story cards ---------------- */
  Array.prototype.slice.call(document.querySelectorAll('.menu-panel')).forEach(function (panel) {
    Array.prototype.slice.call(panel.children).forEach(function (card, i) {
      card.classList.add('reveal');
      card.style.transitionDelay = (Math.min(i, 5) * 0.07) + 's';
    });
  });
  Array.prototype.slice.call(document.querySelectorAll('#story .grid')).forEach(function (grid) {
    Array.prototype.slice.call(grid.children).forEach(function (card, i) {
      card.classList.add('reveal');
      card.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  /* ---------------- Count-up stats ---------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
  function animateCount(el) {
    var to = parseInt(el.getAttribute('data-count-to'), 10);
    if (prefersReducedMotion || !to) {
      el.textContent = to + (el.getAttribute('data-suffix') || '');
      return;
    }
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * to) + (el.getAttribute('data-suffix') || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  /* ---------------- Hero parallax ---------------- */
  var heroBg = document.querySelector('#home .absolute.inset-0.z-0');
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener(
      'scroll',
      function () {
        var offset = Math.min(window.scrollY, 800);
        heroBg.style.transform = 'translateY(' + offset * 0.25 + 'px)';
      },
      { passive: true }
    );
  }

  /* ---------------- Hero mouse spotlight ---------------- */
  var heroSection = document.getElementById('home');
  var heroSpotlight = document.getElementById('heroSpotlight');
  if (heroSection && heroSpotlight && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSpotlight.style.setProperty('--spot-x', x + '%');
      heroSpotlight.style.setProperty('--spot-y', y + '%');
    });
  }

  /* ---------------- Holographic tilt cards ---------------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    var tiltTargets = Array.prototype.slice.call(document.querySelectorAll('.menu-item, #story .card-surface'));
    tiltTargets.forEach(function (card) {
      card.classList.add('tilt-card');
      card.style.position = 'relative';
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotateX = ((y - rect.height / 2) / rect.height) * -6;
        var rotateY = ((x - rect.width / 2) / rect.width) * 6;
        card.style.setProperty('--tx', x + 'px');
        card.style.setProperty('--ty', y + 'px');
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .reveal-title, .reveal-eyebrow'));
  if (prefersReducedMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ---------------- Menu tabs ---------------- */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.menu-tab-btn'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.menu-panel'));

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');

      tabButtons.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      panels.forEach(function (panel) {
        var match = panel.getAttribute('data-panel') === target;
        panel.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------------- Reservation form → WhatsApp ---------------- */
  var form = document.getElementById('reservation-form');
  var waBtn = document.getElementById('whatsapp-reserve-btn');

  if (form && waBtn) {
    waBtn.addEventListener('click', function () {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var lang = html.getAttribute('data-lang') || 'ar';
      var msg;
      if (lang === 'ar') {
        msg =
          '🍽️ *طلب حجز — مطعم سيلينا*\n' +
          'الاسم: ' + data.get('name') + '\n' +
          'الهاتف: ' + data.get('phone') + '\n' +
          'التاريخ: ' + data.get('date') + '\n' +
          'الوقت: ' + data.get('time') + '\n' +
          'عدد الضيوف: ' + data.get('guests') + '\n' +
          'المناسبة: ' + (data.get('occasion') || '—') + '\n' +
          'ملاحظات: ' + (data.get('notes') || '—');
      } else if (lang === 'fr') {
        msg =
          '🍽️ *Demande de réservation — Restaurant Selena*\n' +
          'Nom : ' + data.get('name') + '\n' +
          'Téléphone : ' + data.get('phone') + '\n' +
          'Date : ' + data.get('date') + '\n' +
          'Heure : ' + data.get('time') + '\n' +
          'Convives : ' + data.get('guests') + '\n' +
          'Occasion : ' + (data.get('occasion') || '—') + '\n' +
          'Notes : ' + (data.get('notes') || '—');
      } else {
        msg =
          '🍽️ *Reservation Request — Selena Restaurant*\n' +
          'Name: ' + data.get('name') + '\n' +
          'Phone: ' + data.get('phone') + '\n' +
          'Date: ' + data.get('date') + '\n' +
          'Time: ' + data.get('time') + '\n' +
          'Guests: ' + data.get('guests') + '\n' +
          'Occasion: ' + (data.get('occasion') || '—') + '\n' +
          'Notes: ' + (data.get('notes') || '—');
      }
      window.open('https://wa.me/9647850505098?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  /* ---------------- Smooth scroll offset for fixed header ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerOffset = 84;
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
})();
