#!/usr/bin/env node
/**
 * Add data-i18n attributes to common footer elements across all pages.
 * Targets the same labels used in pt.json / en.json so the footer is bilingual everywhere.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const REPLACEMENTS = [
  // tagline
  { from: /<span class="footer-tagline">Cuidar é a nossa vocação\.<\/span>/g,
    to:   '<span class="footer-tagline" data-i18n="footer.tagline">Cuidar é a nossa vocação.</span>' },
  // brand description
  { from: /<p>Clínica de Fisioterapia e Osteopatia em Panoias, Braga\. Duas décadas a devolver movimento e qualidade de vida\.<\/p>/g,
    to:   '<p data-i18n="footer.brand_desc">Clínica de Fisioterapia e Osteopatia em Panoias, Braga. Duas décadas a devolver movimento e qualidade de vida.</p>' },
  // column headings
  { from: /<h4>Serviços<\/h4>/g,
    to:   '<h4 data-i18n="nav.services">Serviços</h4>' },
  { from: /<h4>Clínica<\/h4>/g,
    to:   '<h4 data-i18n="footer.clinic">Clínica</h4>' },
  { from: /<h4>Contacto<\/h4>/g,
    to:   '<h4 data-i18n="nav.contact">Contacto</h4>' },
  // footer service links
  { from: /<li><a href="(?:servicos|fisioterapia-percutanea)\.html">Fisioterapia Percutânea<\/a><\/li>/g,
    to: (m) => m.replace('>Fisioterapia Percutânea<', ' data-i18n="svc.physio.percutaneous">Fisioterapia Percutânea<') },
  { from: /<li><a href="(?:servicos|fisioterapia-ecoguiada)\.html">Fisioterapia Ecoguiada<\/a><\/li>/g,
    to: (m) => m.replace('>Fisioterapia Ecoguiada<', ' data-i18n="svc.physio.ultrasound">Fisioterapia Ecoguiada<') },
  { from: /<li><a href="(?:servicos|pilates-clinico)\.html">Pilates Clínico<\/a><\/li>/g,
    to: (m) => m.replace('>Pilates Clínico<', ' data-i18n="svc.pilates.clinical">Pilates Clínico<') },
  { from: /<li><a href="(?:servicos|osteopatia-estrutural)\.html">Osteopatia Estrutural<\/a><\/li>/g,
    to: (m) => m.replace('>Osteopatia Estrutural<', ' data-i18n="svc.osteo.structural">Osteopatia Estrutural<') },
  { from: /<li><a href="(?:servicos|osteopatia-pediatrica)\.html">Osteopatia Pediátrica<\/a><\/li>/g,
    to: (m) => m.replace('>Osteopatia Pediátrica<', ' data-i18n="svc.osteo.pediatric">Osteopatia Pediátrica<') },
  // clinic links
  { from: /<li><a href="sobre\.html">Sobre Nós<\/a><\/li>/g,
    to:   '<li><a href="sobre.html" data-i18n="footer.about_us">Sobre Nós</a></li>' },
  { from: /<li><a href="equipa\.html">Equipa<\/a><\/li>/g,
    to:   '<li><a href="equipa.html" data-i18n="nav.team">Equipa</a></li>' },
  { from: /<li><a href="contacto\.html">Contacto<\/a><\/li>/g,
    to:   '<li><a href="contacto.html" data-i18n="nav.contact">Contacto</a></li>' },
  { from: /<li><a href="politica-privacidade\.html">Privacidade<\/a><\/li>/g,
    to:   '<li><a href="politica-privacidade.html" data-i18n="footer.privacy">Privacidade</a></li>' },
  // contact column body
  { from: /<p style="margin-bottom:\.85rem">Rua Nova de Agrafonte, n\.º 31<br>Panoias, Braga<\/p>/g,
    to:   '<p style="margin-bottom:.85rem" data-i18n-html="footer.address">Rua Nova de Agrafonte, n.º 31<br>Panoias, Braga</p>' },
  { from: /<p style="margin-bottom:\.85rem">Rua Nova de Agrafonte, n\.º 31<br>Panóias, Braga<\/p>/g,
    to:   '<p style="margin-bottom:.85rem" data-i18n-html="footer.address">Rua Nova de Agrafonte, n.º 31<br>Panoias, Braga</p>' },
  { from: /<span style="color:var\(--text-light\);font-size:\.7rem;text-transform:uppercase;letter-spacing:\.08em;font-weight:700;display:block;margin-bottom:\.2rem">Telefone<\/span>/g,
    to:   '<span style="color:var(--text-light);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;display:block;margin-bottom:.2rem" data-i18n="footer.phone_label">Telefone</span>' },
  { from: /<span style="color:var\(--text-light\);font-size:\.7rem;text-transform:uppercase;letter-spacing:\.08em;font-weight:700;display:block;margin-bottom:\.2rem">Horário<\/span>\s*\n\s*Seg–Sex: 9h–22h<br>Sábado: 9h–13h/g,
    to:   '<span style="color:var(--text-light);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;display:block;margin-bottom:.2rem" data-i18n="footer.hours_label">Horário</span>\n          <span data-i18n-html="footer.hours">Seg–Sex: 9h–22h<br>Sábado: 9h–13h</span>' },
  // copyright + livro de reclamacoes
  { from: /<p>© 2026 FisioVitae · Panoias, Braga<\/p>/g,
    to:   '<p data-i18n="footer.copyright">© 2026 FisioVitae · Panoias, Braga</p>' },
  { from: /<p>© 2026 Fisio Vitae · Panóias, Braga<\/p>/g,
    to:   '<p data-i18n="footer.copyright">© 2026 Fisio Vitae · Panóias, Braga</p>' },
  { from: /<strong>Livro de Reclamações<\/strong>/g,
    to:   '<strong data-i18n="footer.livro.title">Livro de Reclamações</strong>' },
  // The "Eletrónico" span — only inside livro-reclamacoes-text
  { from: /(<span class="livro-reclamacoes-text">[\s\S]*?<\/strong>)<span>Eletrónico<\/span>/g,
    to:   '$1<span data-i18n="footer.livro.sub">Eletrónico</span>' },
  // website credit
  { from: /<p>Website por <a href="https:\/\/alphascaleai\.com" target="_blank" rel="noopener">AlphaScale AI<\/a><\/p>/g,
    to:   '<p data-i18n-html="footer.credit">Website por <a href="https://alphascaleai.com" target="_blank" rel="noopener">AlphaScale AI</a></p>' },
  // WA tooltip
  { from: /<span class="wa-tooltip">Fale connosco<\/span>/g,
    to:   '<span class="wa-tooltip" data-i18n="wa.tooltip">Fale connosco</span>' },
];

let totalTouched = 0;
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
for (const f of files) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;
  for (const { from, to } of REPLACEMENTS) {
    if (typeof to === 'function') html = html.replace(from, to);
    else html = html.replace(from, to);
  }
  if (html !== before) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`OK ${f}`);
    totalTouched++;
  } else {
    console.log(`-- ${f}`);
  }
}
console.log(`Done. ${totalTouched} files updated.`);
