(function () {
  const SUPPORTED = ['pt', 'en'];
  const DEFAULT_LANG = 'pt';
  const STORAGE_KEY = 'fisiovitae.lang';

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || 'pt').toLowerCase().slice(0, 2);
    return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
  }

  const cache = {};
  async function loadDict(lang) {
    if (cache[lang]) return cache[lang];
    try {
      const res = await fetch(`assets/i18n/${lang}.json?v=20260528b`, { cache: 'no-cache' });
      if (!res.ok) throw new Error('i18n fetch failed: ' + res.status);
      cache[lang] = await res.json();
      return cache[lang];
    } catch (err) {
      console.warn('[i18n] could not load', lang, err);
      return null;
    }
  }

  function applyDict(dict) {
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key && dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      if (!spec) return;
      spec.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });
  }

  const FLAGS = {
    pt: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="9" height="24" fill="#006600"/><rect x="9" width="15" height="24" fill="#FF0000"/><circle cx="9" cy="12" r="4.5" fill="#FFD500" stroke="#000" stroke-width=".5"/></svg>',
    en: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#012169"/><path d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="3"/><path d="M12 0v24M0 12h24" stroke="#fff" stroke-width="5"/><path d="M12 0v24M0 12h24" stroke="#C8102E" stroke-width="3"/></svg>'
  };

  function updateLangUI(lang) {
    const code = document.getElementById('langCode');
    if (code) code.textContent = lang.toUpperCase();
    const toggleFlag = document.querySelector('#langToggle .nav-lang-flag');
    if (toggleFlag && FLAGS[lang]) toggleFlag.innerHTML = FLAGS[lang];
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('#langMenu [data-lang]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    const dict = await loadDict(lang);
    applyDict(dict);
    updateLangUI(lang);
    window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  }

  function wireUI() {
    const toggle = document.getElementById('langToggle');
    const menu = document.getElementById('langMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== toggle) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      menu.querySelectorAll('[data-lang]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          setLang(lang);
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  const initialLang = detectLang();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      wireUI();
      setLang(initialLang);
    });
  } else {
    wireUI();
    setLang(initialLang);
  }

  window.fisiovitaeI18n = { setLang, getLang: () => localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG };
})();
