'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('ts-accordion');
  if (!root) return;

  const setBtnLabel = (btn, expanded) => {
    const title =
      btn.querySelector('.ts-accordion__head-title')?.textContent?.replace(/\s+/g, ' ').trim() ||
      '항목';
    btn.setAttribute('aria-label', expanded ? `${title}, 상세 내용 접기` : `${title}, 상세 내용 펼치기`);
  };

  const collapse = (item) => {
    const btn = item.querySelector('.ts-accordion__trigger');
    const panelId = btn?.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', 'false');
    setBtnLabel(btn, false);
    panel.hidden = true;
    item.classList.remove('is-open');
  };

  const expand = (item) => {
    const btn = item.querySelector('.ts-accordion__trigger');
    const panelId = btn?.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', 'true');
    setBtnLabel(btn, true);
    panel.hidden = false;
    item.classList.add('is-open');
  };

  root.querySelectorAll('.ts-accordion__trigger').forEach((btn) => {
    setBtnLabel(btn, false);

    btn.addEventListener('click', () => {
      const item = btn.closest('.ts-accordion__item');
      if (!item || !root.contains(item)) return;

      const opened = btn.getAttribute('aria-expanded') === 'true';

      root.querySelectorAll('.ts-accordion__item').forEach(collapse);

      if (!opened) {
        expand(item);
      }
    });
  });
});
