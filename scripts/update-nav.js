#!/usr/bin/env node
/**
 * Rewrites the <nav id="navbar"> block AND the <div class="mobile-nav" id="mobileNav"> block
 * in every .html file with a new layout (big logo, lang switcher, phone chip, Agendar CTA)
 * + data-i18n attrs. Keeps `class="active"` on the appropriate link based on filename.
 *
 * Also injects <script src="assets/i18n.js" defer></script> before assets/main.js if missing.
 *
 * IMPORTANT: uses a proper balanced-div parser for the mobile-nav block to avoid eating
 * surrounding sections.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['404.html']);

function activeFor(file) {
  if (file === 'index.html') return 'home';
  if (file === 'sobre.html') return 'about';
  if (file === 'equipa.html') return 'team';
  if (file === 'contacto.html') return 'contact';
  if (file.startsWith('fisioterapia') || file === 'fisioterapia.html' ||
      file.startsWith('osteopatia') || file === 'osteopatia.html' ||
      file.startsWith('massagem') || file === 'massagens.html' ||
      file === 'drenagem-linfatica.html' || file === 'electroacupuntura.html' ||
      file === 'mesoterapia-homeopatica.html' || file === 'reiki.html' ||
      file === 'rpg.html' || file === 'pilates-clinico.html' ||
      file === 'estetica.html' || file === 'holisticas.html' ||
      file === 'servicos.html') return 'services';
  return null;
}

function buildNavbar(active) {
  const cls = (k) => active === k ? ' class="active"' : '';
  return `<nav id="navbar">
  <a href="index.html" class="nav-logo">
    <img src="assets/logofisiovitae-transparent.png" alt="FisioVitae" class="nav-logo-img" loading="lazy" decoding="async"/>
  </a>
  <ul class="nav-links">
    <li><a href="index.html"${cls('home')} data-i18n="nav.home">Início</a></li>
    <li><a href="sobre.html"${cls('about')} data-i18n="nav.about">Sobre</a></li>
    <li class="nav-dropdown">
      <a href="servicos.html" class="nav-dropdown-toggle${active === 'services' ? ' active' : ''}"><span data-i18n="nav.services">Serviços</span> <svg class="dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M6 9l6 6 6-6"/></svg></a>
      <ul class="nav-dropdown-menu">
        <li class="dropdown-cat-item">
          <div><span data-i18n="nav.cat.physio">Fisioterapia</span><span class="cat-desc" data-i18n="nav.cat.physio_desc">Reabilitação e movimento</span></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M9 18l6-6-6-6"/></svg>
          <ul class="dropdown-sub">
            <li class="dropdown-sub-label" data-i18n="nav.cat.physio">Fisioterapia</li>
            <li><a href="fisioterapia-percutanea.html" data-i18n="svc.physio.percutaneous">Fisioterapia Percutânea</a></li>
            <li><a href="fisioterapia-ecoguiada.html" data-i18n="svc.physio.ultrasound">Fisioterapia Ecoguiada</a></li>
            <li><a href="rpg.html" data-i18n="svc.physio.rpg">RPG – Reeducação Postural Global</a></li>
            <li><a href="servicos.html" data-i18n="svc.physio.all">Tratamentos de Fisioterapia</a></li>
          </ul>
        </li>
        <li class="dropdown-cat-item">
          <div><span data-i18n="nav.cat.osteo">Osteopatia</span><span class="cat-desc" data-i18n="nav.cat.osteo_desc">Equilíbrio estrutural</span></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M9 18l6-6-6-6"/></svg>
          <ul class="dropdown-sub">
            <li class="dropdown-sub-label" data-i18n="nav.cat.osteo">Osteopatia</li>
            <li><a href="osteopatia-estrutural.html" data-i18n="svc.osteo.structural">Osteopatia Estrutural</a></li>
            <li><a href="osteopatia-pediatrica.html" data-i18n="svc.osteo.pediatric">Osteopatia Pediátrica</a></li>
            <li><a href="osteopatia-ginecologica.html" data-i18n="svc.osteo.gyn">Osteopatia Ginecológica e Gestacional</a></li>
            <li><a href="osteopatia-sacro-craniana.html" data-i18n="svc.osteo.sacrocranial">Osteopatia Sacro-Craniana</a></li>
            <li><a href="osteopatia-visceral.html" data-i18n="svc.osteo.visceral">Osteopatia Visceral</a></li>
          </ul>
        </li>
        <li class="dropdown-cat-item">
          <div><span data-i18n="nav.cat.massage">Massagens &amp; Bem-Estar</span><span class="cat-desc" data-i18n="nav.cat.massage_desc">Relaxamento e terapia</span></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M9 18l6-6-6-6"/></svg>
          <ul class="dropdown-sub">
            <li class="dropdown-sub-label" data-i18n="nav.cat.massage">Massagens &amp; Bem-Estar</li>
            <li><a href="massagem-relaxamento.html" data-i18n="svc.massage.relax">Massagem de Relaxamento</a></li>
            <li><a href="massagem-anti-celulite.html" data-i18n="svc.massage.anticellulite">Massagem anti-Celulite</a></li>
            <li><a href="drenagem-linfatica.html" data-i18n="svc.massage.lymphatic">Drenagem Linfática</a></li>
            <li><a href="mesoterapia-homeopatica.html" data-i18n="svc.massage.meso">Mesoterapia Homeopática</a></li>
            <li><a href="electroacupuntura.html" data-i18n="svc.massage.acupuncture">Electroacupuntura</a></li>
            <li><a href="reiki.html" data-i18n="svc.massage.reiki">Reiki</a></li>
          </ul>
        </li>
        <li class="dropdown-cat-item">
          <div><span data-i18n="nav.cat.pilates">Pilates &amp; Estética</span><span class="cat-desc" data-i18n="nav.cat.pilates_desc">Movimento e beleza</span></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M9 18l6-6-6-6"/></svg>
          <ul class="dropdown-sub">
            <li class="dropdown-sub-label" data-i18n="nav.cat.pilates">Pilates &amp; Estética</li>
            <li><a href="pilates-clinico.html" data-i18n="svc.pilates.clinical">Pilates Clínico</a></li>
            <li><a href="estetica.html" data-i18n="svc.pilates.aesthetic">Estética</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="equipa.html"${cls('team')} data-i18n="nav.team">Equipa</a></li>
    <li><a href="contacto.html"${cls('contact')} data-i18n="nav.contact">Contacto</a></li>
  </ul>
  <div class="nav-right">
    <div class="nav-lang-wrap">
      <button class="nav-lang" id="langToggle" aria-expanded="false" aria-haspopup="true" aria-label="Mudar idioma / Change language">
        <span class="nav-lang-flag" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="9" height="24" fill="#006600"/><rect x="9" width="15" height="24" fill="#FF0000"/><circle cx="9" cy="12" r="4.5" fill="#FFD500" stroke="#000" stroke-width=".5"/></svg>
        </span>
        <span class="nav-lang-code" id="langCode">PT</span>
        <svg class="dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <ul class="nav-lang-menu" id="langMenu" role="menu">
        <li><button type="button" data-lang="pt" class="active">
          <span class="nav-lang-flag" aria-hidden="true"><svg viewBox="0 0 24 24"><rect width="9" height="24" fill="#006600"/><rect x="9" width="15" height="24" fill="#FF0000"/><circle cx="9" cy="12" r="4.5" fill="#FFD500" stroke="#000" stroke-width=".5"/></svg></span>
          Português
        </button></li>
        <li><button type="button" data-lang="en">
          <span class="nav-lang-flag" aria-hidden="true"><svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#012169"/><path d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="3"/><path d="M12 0v24M0 12h24" stroke="#fff" stroke-width="5"/><path d="M12 0v24M0 12h24" stroke="#C8102E" stroke-width="3"/></svg></span>
          English
        </button></li>
      </ul>
    </div>
    <a href="tel:+351253623663" class="nav-phone" aria-label="Telefone 253 623 663">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span>253 623 663</span>
    </a>
    <a href="contacto.html" class="nav-cta">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>
      <span data-i18n="nav.cta">Agendar</span>
    </a>
  </div>
  <button class="nav-hamburger" id="hamburger" aria-label="Abrir menu">
    <span></span><span></span><span></span>
  </button>
</nav>`;
}

const MOBILE_NAV = `<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav-lang" id="mobileNavLang">
    <button type="button" data-lang="pt" class="active">
      <span class="nav-lang-flag" aria-hidden="true"><svg viewBox="0 0 24 24"><rect width="9" height="24" fill="#006600"/><rect x="9" width="15" height="24" fill="#FF0000"/><circle cx="9" cy="12" r="4.5" fill="#FFD500" stroke="#000" stroke-width=".5"/></svg></span>
      Português
    </button>
    <button type="button" data-lang="en">
      <span class="nav-lang-flag" aria-hidden="true"><svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#012169"/><path d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="3"/><path d="M12 0v24M0 12h24" stroke="#fff" stroke-width="5"/><path d="M12 0v24M0 12h24" stroke="#C8102E" stroke-width="3"/></svg></span>
      English
    </button>
  </div>
  <a href="index.html" data-i18n="nav.home">Início</a>
  <a href="sobre.html" data-i18n="nav.about">Sobre</a>
  <a href="servicos.html" data-i18n="nav.services">Serviços</a>
  <div class="mobile-nav-services">
    <span class="mobile-nav-category" data-i18n="nav.cat.physio">Fisioterapia</span>
    <a href="fisioterapia-percutanea.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.physio.percutaneous">Fisioterapia Percutânea</span></a>
    <a href="fisioterapia-ecoguiada.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.physio.ultrasound">Fisioterapia Ecoguiada</span></a>
    <a href="rpg.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.physio.rpg">RPG – Reeducação Postural Global</span></a>
    <a href="servicos.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.physio.all">Tratamentos de Fisioterapia</span></a>
    <span class="mobile-nav-category" data-i18n="nav.cat.osteo">Osteopatia</span>
    <a href="osteopatia-estrutural.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.osteo.structural">Osteopatia Estrutural</span></a>
    <a href="osteopatia-pediatrica.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.osteo.pediatric">Osteopatia Pediátrica</span></a>
    <a href="osteopatia-ginecologica.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.osteo.gyn">Osteopatia Ginecológica e Gestacional</span></a>
    <a href="osteopatia-sacro-craniana.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.osteo.sacrocranial">Osteopatia Sacro-Craniana</span></a>
    <a href="osteopatia-visceral.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.osteo.visceral">Osteopatia Visceral</span></a>
    <span class="mobile-nav-category" data-i18n="nav.cat.massage">Massagens & Bem-Estar</span>
    <a href="massagem-relaxamento.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.massage.relax">Massagem de Relaxamento</span></a>
    <a href="massagem-anti-celulite.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.massage.anticellulite">Massagem anti-Celulite</span></a>
    <a href="drenagem-linfatica.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.massage.lymphatic">Drenagem Linfática</span></a>
    <a href="mesoterapia-homeopatica.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.massage.meso">Mesoterapia Homeopática</span></a>
    <a href="electroacupuntura.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.massage.acupuncture">Electroacupuntura</span></a>
    <a href="reiki.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.massage.reiki">Reiki</span></a>
    <span class="mobile-nav-category" data-i18n="nav.cat.pilates">Pilates & Estética</span>
    <a href="pilates-clinico.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.pilates.clinical">Pilates Clínico</span></a>
    <a href="estetica.html"><span aria-hidden="true">↳ </span><span data-i18n="svc.pilates.aesthetic">Estética</span></a>
  </div>
  <a href="equipa.html" data-i18n="nav.team">Equipa</a>
  <a href="contacto.html" data-i18n="nav.contact">Contacto</a>
  <a href="contacto.html" class="mobile-nav-cta" data-i18n="nav.cta">Marcar Consulta</a>
</div>`;

/**
 * Properly balanced <div> matcher.
 * Given source text and the index where a <div ...> tag opens, return the index
 * of the matching </div> close + length of "</div>".
 */
function findMatchingDivEnd(src, openTagStart) {
  // openTagStart points at "<div ...". Find the end of that open tag (the ">")
  const openEnd = src.indexOf('>', openTagStart);
  if (openEnd === -1) return -1;
  let i = openEnd + 1;
  let depth = 1;
  const openRe = /<div\b[^>]*>/gi;
  const closeRe = /<\/div\s*>/gi;
  while (i < src.length && depth > 0) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const o = openRe.exec(src);
    const c = closeRe.exec(src);
    if (!c) return -1; // unbalanced
    if (o && o.index < c.index) {
      depth += 1;
      i = o.index + o[0].length;
    } else {
      depth -= 1;
      i = c.index + c[0].length;
      if (depth === 0) return i; // end-exclusive index
    }
  }
  return -1;
}

function replaceMobileNav(html) {
  const startTagRe = /<div\s+class="mobile-nav"\s+id="mobileNav"\s*>/i;
  const m = startTagRe.exec(html);
  if (!m) return { html, replaced: false };
  const start = m.index;
  const end = findMatchingDivEnd(html, start);
  if (end === -1) return { html, replaced: false };
  return {
    html: html.slice(0, start) + MOBILE_NAV + html.slice(end),
    replaced: true,
  };
}

function updateFile(filepath) {
  const file = path.basename(filepath);
  if (SKIP.has(file)) {
    console.log(`SKIP  ${file}`);
    return;
  }
  let html = fs.readFileSync(filepath, 'utf8');
  const before = html;

  // Replace <nav id="navbar" ...>...</nav> — non-greedy, no nesting issue since <nav> doesn't nest
  const navRe = /<nav id="navbar"[^>]*>[\s\S]*?<\/nav>/;
  const active = activeFor(file);
  if (!navRe.test(html)) {
    console.log(`NO-NAV ${file}`);
    return;
  }
  html = html.replace(navRe, buildNavbar(active));

  // Replace the mobile-nav with proper balanced-div parsing
  const { html: html2, replaced } = replaceMobileNav(html);
  html = html2;

  // Inject i18n.js before main.js if missing
  if (!html.includes('assets/i18n.js')) {
    html = html.replace(
      /(<script src="assets\/main\.js"[^>]*><\/script>)/,
      `<script src="assets/i18n.js" defer></script>\n$1`
    );
  }

  if (html !== before) {
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`OK    ${file}  (active=${active || '-'}, mobile=${replaced})`);
  } else {
    console.log(`NOOP  ${file}`);
  }
}

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
console.log(`Found ${files.length} html files`);
files.forEach((f) => updateFile(path.join(ROOT, f)));
console.log('Done.');
