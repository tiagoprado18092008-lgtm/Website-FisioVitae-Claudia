const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

function patchSvcPage(file, heroPatches) {
  const fp = path.join(base, file);
  let html = fs.readFileSync(fp, 'utf8');

  // Breadcrumb home
  html = html.replace(/<a href="index\.html">Início<\/a>/g, '<a href="index.html" data-i18n="page.breadcrumb.home">Início</a>');

  // Quickinfo label
  html = html.replace(/<div class="svc-quickinfo-label">Marcar agora<\/div>/g, '<div class="svc-quickinfo-label" data-i18n="svc.detail.quickinfo.label">Marcar agora</div>');

  // Duration row
  html = html.replace(/<span><strong>Duração<\/strong><br>([^<]+)<\/span>/g, '<span><strong data-i18n="svc.detail.quickinfo.duration_label">Duração</strong><br><span data-i18n="osteo.detail.quickinfo.duration">$1</span></span>');

  // Assessment row
  html = html.replace(/<span><strong>Avaliação<\/strong><br>([^<]+)<\/span>/g, '<span><strong data-i18n="svc.detail.quickinfo.assessment_label">Avaliação</strong><br><span data-i18n="svc.detail.quickinfo.assessment_text">$1</span></span>');

  // WhatsApp button text (inside svc-quickinfo-cta)
  html = html.replace(/(class="svc-quickinfo-cta"[^>]*>[\s\S]*?<svg[^>]*>[\s\S]*?<\/svg>)\s*\n(\s+)(Marcar via WhatsApp)\n(\s+)<\/a>/g, '$1\n$2<span data-i18n="svc.detail.quickinfo.wa_btn">Marcar via WhatsApp</span>\n$4</a>');

  // Phone prefix
  html = html.replace(/<a href="tel:253623663" class="svc-quickinfo-phone">ou ligue: 253 623 663<\/a>/g, '<a href="tel:253623663" class="svc-quickinfo-phone"><span data-i18n="svc.detail.quickinfo.phone_prefix">ou ligue:</span> 253 623 663</a>');

  // How section h4 variants
  html = html.replace(/<h4>Como funciona uma sessão\?<\/h4>/g, '<h4 data-i18n="svc.detail.how.title">Como funciona uma sessão?</h4>');
  html = html.replace(/<h4>Para que idades é indicada\?<\/h4>/g, '<h4 data-i18n="svc.detail.how.title">Para que idades é indicada?</h4>');

  // svc-h4 variants
  html = html.replace(/<h4 class="svc-h4">Indicações<\/h4>/g, '<h4 class="svc-h4" data-i18n="svc.detail.indications.title">Indicações</h4>');
  html = html.replace(/<h4 class="svc-h4">Condições tratadas<\/h4>/g, '<h4 class="svc-h4" data-i18n="svc.detail.indications.title">Condições tratadas</h4>');
  html = html.replace(/<h4 class="svc-h4">Condições mais comuns<\/h4>/g, '<h4 class="svc-h4" data-i18n="svc.detail.indications.title">Condições mais comuns</h4>');
  html = html.replace(/<h4 class="svc-h4">Benefícios<\/h4>/g, '<h4 class="svc-h4" data-i18n="svc.detail.indications.title">Benefícios</h4>');

  // CTA inline buttons
  html = html.replace(/<a href="contacto\.html" class="btn-primary">Marcar Avaliação<\/a>/g, '<a href="contacto.html" class="btn-primary"><span data-i18n="svc.detail.book_btn">Marcar Avaliação</span></a>');
  html = html.replace(/<a href="contacto\.html" class="btn-primary">Marcar Consulta<\/a>/g, '<a href="contacto.html" class="btn-primary"><span data-i18n="svc.detail.book_btn">Marcar Consulta</span></a>');

  // CTA inline h4/p variants
  const ctaH4s = [
    'Quer saber se é indicado para si?',
    'Quer saber mais sobre este tratamento?',
    'Trate a causa, não apenas o sintoma',
    'O seu filho merece os melhores cuidados',
    'Acredita que pode beneficiar desta técnica?',
    'Pronto para começar?',
    'Quer experimentar o Reiki?',
    'Tem dúvidas sobre este tratamento?',
  ];
  ctaH4s.forEach(t => {
    html = html.replace(new RegExp('<h4>' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</h4>'), '<h4 data-i18n="svc.detail.cta.question">' + t + '</h4>');
  });

  const ctaPs = [
    'Consulte a nossa equipa para uma avaliação personalizada.',
    'Agende uma avaliação osteopática completa.',
    'A Inês Macedo recebe bebés e crianças com toda a delicadeza e experiência necessárias.',
    'Marque uma avaliação personalizada com a nossa equipa.',
    'Entre em contacto e agende a sua primeira sessão.',
    'Fale com a nossa equipa e descubra como podemos ajudar.',
  ];
  ctaPs.forEach(t => {
    html = html.replace(new RegExp('<p>' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</p>'), '<p data-i18n="svc.detail.cta.sub">' + t + '</p>');
  });

  // Apply hero-specific patches
  heroPatches.forEach(({ from, to }) => {
    if (html.includes(from)) {
      html = html.split(from).join(to);
    } else {
      console.log('NOT FOUND in', file, ':', from.substring(0, 70));
    }
  });

  fs.writeFileSync(fp, html, 'utf8');
  console.log('Done:', file);
}

const pages = [
  {
    file: 'osteopatia-pediatrica.html',
    patches: [
      { from: 'class="page-hero-title">Osteopatia <em>Pediátrica</em></h1>', to: 'class="page-hero-title" data-i18n-html="osteo.pediatrica.hero.title">Osteopatia <em>Pediátrica</em></h1>' },
      { from: '<h4>Osteopatia Pediátrica</h4>', to: '<h4 data-i18n="osteo.pediatrica.quickinfo.title">Osteopatia Pediátrica</h4>' },
    ]
  },
  {
    file: 'osteopatia-ginecologica.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="osteo.ginecologica.hero.title">' },
      { from: '<h4>Osteopatia Ginecológica</h4>', to: '<h4 data-i18n="osteo.ginecologica.quickinfo.title">Osteopatia Ginecológica</h4>' },
      { from: '<h4>Osteopatia Ginecológica e Gestacional</h4>', to: '<h4 data-i18n="osteo.ginecologica.quickinfo.title">Osteopatia Ginecológica e Gestacional</h4>' },
    ]
  },
  {
    file: 'osteopatia-sacro-craniana.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="osteo.sacrocraniana.hero.title">' },
      { from: '<h4>Osteopatia Sacro-Craniana</h4>', to: '<h4 data-i18n="osteo.sacrocraniana.quickinfo.title">Osteopatia Sacro-Craniana</h4>' },
    ]
  },
  {
    file: 'osteopatia-visceral.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="osteo.visceral.hero.title">' },
      { from: '<h4>Osteopatia Visceral</h4>', to: '<h4 data-i18n="osteo.visceral.quickinfo.title">Osteopatia Visceral</h4>' },
    ]
  },
  {
    file: 'massagem-anti-celulite.html',
    patches: [
      { from: 'class="page-hero-title">Massagem <em>Anti-Celulite</em></h1>', to: 'class="page-hero-title" data-i18n-html="massagem.anticelulit.hero.title">Massagem <em>Anti-Celulite</em></h1>' },
      { from: '<h4>Massagem anti-Celulite</h4>', to: '<h4 data-i18n="massagem.anticelulit.quickinfo.title">Massagem anti-Celulite</h4>' },
    ]
  },
  {
    file: 'drenagem-linfatica.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="drenagem.hero.title">' },
      { from: '<h4>Drenagem Linfática</h4>', to: '<h4 data-i18n="drenagem.quickinfo.title">Drenagem Linfática</h4>' },
    ]
  },
  {
    file: 'mesoterapia-homeopatica.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="mesoterapia.hero.title">' },
      { from: '<h4>Mesoterapia Homeopática</h4>', to: '<h4 data-i18n="mesoterapia.quickinfo.title">Mesoterapia Homeopática</h4>' },
    ]
  },
  {
    file: 'electroacupuntura.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="electro.hero.title">' },
      { from: '<h4>Electroacupuntura</h4>', to: '<h4 data-i18n="electro.quickinfo.title">Electroacupuntura</h4>' },
    ]
  },
  {
    file: 'reiki.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n-html="reiki.hero.title">' },
      { from: '<h4>Reiki</h4>', to: '<h4 data-i18n="reiki.quickinfo.title">Reiki</h4>' },
    ]
  },
  {
    file: 'holisticas.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n="holisticas.hero.title">' },
    ]
  },
  {
    file: 'estetica.html',
    patches: [
      { from: 'class="page-hero-title">', to: 'class="page-hero-title" data-i18n="estetica.detail.hero.title">' },
    ]
  },
];

pages.forEach(({ file, patches }) => patchSvcPage(file, patches));
console.log('All done.');
