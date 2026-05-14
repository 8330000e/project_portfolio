'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('site-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  const main = document.querySelector('main');

  const allMainSections = main ? Array.from(main.querySelectorAll('section')) : [];

  const STAGGER_SELECTOR = [
    '.skill-card',
    '.featured-card',
    '.other-card',
    '.ts-accordion__item',
    '.blog-card',
    '.gh-repo-card',
    '.contact__channel',
    '.contact__lead',
    '.contact__resume',
    '.arch-diagram',
    '.arch-summary',
    '.about__grid',
    '.links-section__panel-title',
    '.links-section__more',
    '.links-section__profile-btn',
  ].join(', ');

  const setActiveHref = (hash) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', Boolean(hash) && link.getAttribute('href') === hash);
    });
  };

  const initRevealTargets = () => {
    allMainSections.forEach((section) => {
      if (section.id === 'hero') return;

      const container = section.querySelector('.container');
      if (!container) return;

      let order = 0;

      const h2 = container.querySelector('h2');
      if (h2) {
        h2.classList.add('reveal');
        h2.style.setProperty('--reveal-order', String(order++));
      }

      const subtitle = container.querySelector('.ts-section__subtitle, .arch-section__subtitle');
      if (subtitle) {
        subtitle.classList.add('reveal');
        subtitle.style.setProperty('--reveal-order', String(order++));
      }

      container.querySelectorAll(STAGGER_SELECTOR).forEach((el) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-order', String(order++));
      });
    });
  };

  let revealObserver = null;

  const setupRevealObserver = () => {
    revealObserver?.disconnect();

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sec = entry.target;
          sec.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
          revealObserver.unobserve(sec);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: [0, 0.06, 0.12, 0.18],
      }
    );

    allMainSections.forEach((sec) => {
      if (sec.id === 'hero') return;
      revealObserver.observe(sec);
    });
  };

  const applyReducedMotionReveals = () => {
    allMainSections.forEach((sec) => {
      sec.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    });
  };

  const getActiveSectionIdFromViewportCenter = () => {
    const sections = allMainSections;
    if (sections.length === 0) return '';

    const centerY = window.innerHeight / 2;

    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= centerY && r.bottom >= centerY) {
        return sec.id || '';
      }
    }

    const doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
      return sections[sections.length - 1]?.id || '';
    }

    let best = sections[0];
    let bestDist = Infinity;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const d = Math.abs(mid - centerY);
      if (d < bestDist) {
        bestDist = d;
        best = sec;
      }
    }
    return best?.id || '';
  };

  const updateNavFromViewport = () => {
    const id = getActiveSectionIdFromViewportCenter();
    if (id === 'hero') setActiveHref('');
    else if (id) setActiveHref(`#${id}`);
    else setActiveHref('');
  };

  const updateNavScrolled = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  };

  let scrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      updateNavScrolled();
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          updateNavFromViewport();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'resize',
    () => {
      updateNavFromViewport();
    },
    { passive: true }
  );

  const closeMenu = () => {
    navMenu?.classList.remove('is-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '메뉴 열기');
    }
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  initRevealTargets();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    applyReducedMotionReveals();
  } else {
    setupRevealObserver();
  }

  updateNavScrolled();
  requestAnimationFrame(() => {
    updateNavFromViewport();
  });
});
