'use strict';

/**
 * 김가연 Portfolio — 메인 스크립트
 * 1. 모바일 메뉴 토글
 * 2. 스크롤 시 네비게이션 active 상태
 * 3. Debug 섹션 아코디언
 */

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

/* ── 모바일 메뉴 ── */
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', '메뉴 열기');
    });
  });
}

/* ── 스크롤 네비게이션 active ── */
const activateNav = () => {
  const scrollPosition = window.scrollY + 140;
  const pageHeight = document.documentElement.scrollHeight;
  const isAtBottom = window.innerHeight + window.scrollY >= pageHeight - 8;

  if (isAtBottom) {
    const lastSection = sections[sections.length - 1];
    const lastSectionId = lastSection.getAttribute('id');
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${lastSectionId}`);
    });
    return;
  }

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    }
  });
};

window.addEventListener('scroll', activateNav);
window.addEventListener('hashchange', () => {
  const currentHash = window.location.hash;
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === currentHash);
  });
});
window.addEventListener('load', activateNav);

/* ── Debug 아코디언 ── */
document.addEventListener('DOMContentLoaded', () => {
  const accordion = document.getElementById('debug-accordion');
  if (!accordion) return;

  const collapseItem = (item) => {
    const btn = item.querySelector('.debug-trigger');
    const panelId = btn?.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    item.classList.remove('is-open');
  };

  const expandItem = (item) => {
    const btn = item.querySelector('.debug-trigger');
    const panelId = btn?.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    item.classList.add('is-open');
  };

  accordion.querySelectorAll('.debug-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.debug-item');
      if (!item) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      accordion.querySelectorAll('.debug-item').forEach(collapseItem);

      if (!isOpen) {
        expandItem(item);
      }
    });
  });
});
