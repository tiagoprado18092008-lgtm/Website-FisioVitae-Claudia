const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

function readFile(file) {
  return fs.readFileSync(path.join(base, file), 'utf8');
}
function writeFile(file, content) {
  fs.writeFileSync(path.join(base, file), content, 'utf8');
  console.log('Done:', file);
}
function rep(html, from, to) {
  if (!html.includes(from)) {
    console.log('  NOT FOUND:', from.substring(0, 80));
    return html;
  }
  return html.split(from).join(to);
}

// ─── holisticas.html ───────────────────────────────────────────────
{
  let html = readFile('holisticas.html');
  html = rep(html,
    '<h1>Holísticas</h1>',
    '<h1 data-i18n="holisticas.hero.title">Holísticas</h1>'
  );
  html = rep(html,
    '<p class="cat-hero-sub">Terapias holísticas para reequilibrar corpo e mente — técnicas com séculos de prática, com resultados sentidos em cada sessão.</p>',
    '<p class="cat-hero-sub" data-i18n="holisticas.hero.sub">Terapias holísticas para reequilibrar corpo e mente — técnicas com séculos de prática, com resultados sentidos em cada sessão.</p>'
  );
  writeFile('holisticas.html', html);
}

// ─── equipa.html ────────────────────────────────────────────────────
{
  let html = readFile('equipa.html');

  // hero label
  html = rep(html,
    '<div class="team-hero-label">Fisio Vitae · Panóias, Braga</div>',
    '<div class="team-hero-label" data-i18n="team.hero.label">Fisio Vitae · Panóias, Braga</div>'
  );
  // hero desc
  html = rep(html,
    '<p class="team-hero-desc">Na Fisio Vitae reunimos fisioterapeutas, osteopata, nutricionista e instrutores com uma missão partilhada: devolver-lhe o movimento, o bem-estar e a qualidade de vida que merece — com rigor técnico e atenção genuína a cada caso.</p>',
    '<p class="team-hero-desc" data-i18n="team.hero.desc">Na Fisio Vitae reunimos fisioterapeutas, osteopata, nutricionista e instrutores com uma missão partilhada: devolver-lhe o movimento, o bem-estar e a qualidade de vida que merece — com rigor técnico e atenção genuína a cada caso.</p>'
  );
  // hero CTA buttons
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Marcar Consulta</a>\n            <a href="servicos.html" class="btn-secondary">Ver Serviços</a>',
    '<a href="contacto.html" class="btn-primary" data-i18n="team.hero.cta_book">Marcar Consulta</a>\n            <a href="servicos.html" class="btn-secondary" data-i18n="team.hero.cta_svc">Ver Serviços</a>'
  );
  // hero stats
  html = rep(html,
    '<div class="hero-stat-label">Especialistas</div>',
    '<div class="hero-stat-label" data-i18n="team.hero.stat_specialists">Especialistas</div>'
  );
  html = rep(html,
    '<div class="hero-stat-label">Anos de Exp.</div>',
    '<div class="hero-stat-label" data-i18n="team.hero.stat_exp">Anos de Exp.</div>'
  );
  html = rep(html,
    '<div class="hero-stat-label">Especialidades</div>',
    '<div class="hero-stat-label" data-i18n="team.hero.stat_specialties">Especialidades</div>'
  );

  // strip
  html = rep(html,
    '<div class="strip-label">A Nossa Equipa</div>',
    '<div class="strip-label" data-i18n="team.strip.label">A Nossa Equipa</div>'
  );
  html = rep(html,
    '<h2 class="strip-title">Cinco profissionais,<br><em>uma visão partilhada</em></h2>',
    '<h2 class="strip-title" data-i18n-html="team.strip.title">Cinco profissionais,<br><em>uma visão partilhada</em></h2>'
  );

  // tc-roles
  html = rep(html, '<div class="tc-role">Fisioterapeuta · Fundadora</div>', '<div class="tc-role" data-i18n="team.claudia.tc_role">Fisioterapeuta · Fundadora</div>');
  html = rep(html, '<div class="tc-role">Fisioterapeuta</div>', '<div class="tc-role" data-i18n="team.ines.tc_role">Fisioterapeuta</div>');
  html = rep(html, '<div class="tc-role">Nutricionista</div>', '<div class="tc-role" data-i18n="team.patricia.tc_role">Nutricionista</div>');
  html = rep(html, '<div class="tc-role">Analista Reikiano · Pilates</div>', '<div class="tc-role" data-i18n="team.jose.tc_role">Analista Reikiano · Pilates</div>');
  html = rep(html, '<div class="tc-role">Rececionista</div>', '<div class="tc-role" data-i18n="team.rafaela.tc_role">Rececionista</div>');

  // Cláudia section
  html = rep(html,
    '<div class="mc-label">Fundadora</div>',
    '<div class="mc-label" data-i18n="team.claudia.mc_label">Fundadora</div>'
  );
  html = rep(html,
    '<div class="mc-sub">Fisioterapeuta · Osteopata · Fisioterapia Invasiva · 20+ Anos de Experiência</div>',
    '<div class="mc-sub" data-i18n="team.claudia.mc_sub">Fisioterapeuta · Osteopata · Fisioterapia Invasiva · 20+ Anos de Experiência</div>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Marcar Consulta com a Dra. Cláudia</a>',
    '<a href="contacto.html" class="btn-primary"><span data-i18n="team.claudia.cta">Marcar Consulta com a Dra. Cláudia</span></a>'
  );

  // Inês section
  html = rep(html,
    '<div class="mc-label">Fisioterapia</div>',
    '<div class="mc-label" data-i18n="team.ines.mc_label">Fisioterapia</div>'
  );
  html = rep(html,
    '<div class="mc-sub">Fisioterapeuta</div>',
    '<div class="mc-sub" data-i18n="team.ines.mc_sub">Fisioterapeuta</div>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Marcar Consulta com a Inês</a>',
    '<a href="contacto.html" class="btn-primary"><span data-i18n="team.ines.cta">Marcar Consulta com a Inês</span></a>'
  );

  // Patrícia section
  html = rep(html,
    '<div class="mc-label">Nutrição</div>',
    '<div class="mc-label" data-i18n="team.patricia.mc_label">Nutrição</div>'
  );
  html = rep(html,
    '<div class="mc-sub">Nutricionista</div>',
    '<div class="mc-sub" data-i18n="team.patricia.mc_sub">Nutricionista</div>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Marcar Consulta com a Patrícia</a>',
    '<a href="contacto.html" class="btn-primary"><span data-i18n="team.patricia.cta">Marcar Consulta com a Patrícia</span></a>'
  );

  // José section
  html = rep(html,
    '<div class="mc-label">Bem-estar & Movimento</div>',
    '<div class="mc-label" data-i18n="team.jose.mc_label">Bem-estar & Movimento</div>'
  );
  html = rep(html,
    '<div class="mc-sub">Analista Reikiano · Instrutor de Pilates Clínico</div>',
    '<div class="mc-sub" data-i18n="team.jose.mc_sub">Analista Reikiano · Instrutor de Pilates Clínico</div>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Iniciar Programa de Pilates</a>',
    '<a href="contacto.html" class="btn-primary"><span data-i18n="team.jose.cta_pilates">Iniciar Programa de Pilates</span></a>'
  );
  html = rep(html,
    '<a href="servicos.html#pilates" class="btn-secondary">Saber mais</a>',
    '<a href="servicos.html#pilates" class="btn-secondary" data-i18n="team.jose.cta_more">Saber mais</a>'
  );

  // Rafaela section
  html = rep(html,
    '<div class="mc-label">Atendimento & Coordenação</div>',
    '<div class="mc-label" data-i18n="team.rafaela.mc_label">Atendimento & Coordenação</div>'
  );
  html = rep(html,
    '<div class="mc-sub">Rececionista & Coordenação Administrativa</div>',
    '<div class="mc-sub" data-i18n="team.rafaela.mc_sub">Rececionista & Coordenação Administrativa</div>'
  );
  html = rep(html,
    'Ligar Agora\n          </a>',
    '<span data-i18n="team.rafaela.cta_call">Ligar Agora</span>\n          </a>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-secondary">Enviar Mensagem</a>',
    '<a href="contacto.html" class="btn-secondary" data-i18n="team.rafaela.cta_msg">Enviar Mensagem</a>'
  );

  // group section
  html = rep(html,
    '<div class="mc-label">Uma abordagem diferente</div>',
    '<div class="mc-label" data-i18n="team.group.label">Uma abordagem diferente</div>'
  );
  html = rep(html,
    '<h2 class="group-title">Não tratamos sintomas.<br>Tratamos <em>pessoas</em>.</h2>',
    '<h2 class="group-title" data-i18n-html="team.group.title">Não tratamos sintomas.<br>Tratamos <em>pessoas</em>.</h2>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Agendar a Primeira Consulta</a>',
    '<a href="contacto.html" class="btn-primary" data-i18n="team.group.cta">Agendar a Primeira Consulta</a>'
  );
  html = rep(html,
    '<div class="group-badge-label">especialistas</div>',
    '<div class="group-badge-label" data-i18n="team.group.badge_label">especialistas</div>'
  );

  // CTA section
  html = rep(html,
    '<h2>Pronto para <em>começar a recuperar</em>?</h2>',
    '<h2 data-i18n-html="team.cta.title">Pronto para <em>começar a recuperar</em>?</h2>'
  );
  html = rep(html,
    '<p>Não precisa de saber qual o tratamento certo — é para isso que estamos aqui. Entre em contacto e a nossa equipa avalia o seu caso e traça o caminho mais eficaz para a sua recuperação.</p>',
    '<p data-i18n="team.cta.sub">Não precisa de saber qual o tratamento certo — é para isso que estamos aqui. Entre em contacto e a nossa equipa avalia o seu caso e traça o caminho mais eficaz para a sua recuperação.</p>'
  );
  html = rep(html,
    '<a href="contacto.html" class="btn-primary">Marcar Consulta</a>\n        <a href="servicos.html" class="btn-secondary">Ver Todos os Serviços</a>',
    '<a href="contacto.html" class="btn-primary" data-i18n="team.cta.book">Marcar Consulta</a>\n        <a href="servicos.html" class="btn-secondary" data-i18n="team.cta.services">Ver Todos os Serviços</a>'
  );

  writeFile('equipa.html', html);
}

// ─── servicos.html ──────────────────────────────────────────────────
{
  let html = readFile('servicos.html');

  // snav links
  html = rep(html, '>Percutânea</a>', ' data-i18n="servicos.snav.percutanea">Percutânea</a>');
  html = rep(html, '>Ecoguiada</a>', ' data-i18n="servicos.snav.ecoguiada">Ecoguiada</a>');
  html = rep(html, '>Pilates Clínico</a>', ' data-i18n="servicos.snav.pilates">Pilates Clínico</a>');
  html = rep(html, '>Osteopatia</a>', ' data-i18n="servicos.snav.osteopatia">Osteopatia</a>');
  html = rep(html, '>Pediátrica</a>', ' data-i18n="servicos.snav.pediatrica">Pediátrica</a>');
  html = rep(html, '>RPG</a>', ' data-i18n="servicos.snav.rpg">RPG</a>');

  // section labels
  html = rep(html, '<div class="section-label">Técnica Avançada</div>', '<div class="section-label" data-i18n="servicos.percutanea.label">Técnica Avançada</div>');
  html = rep(html, '<h2>Fisioterapia <em>Percutânea</em></h2>', '<h2 data-i18n-html="servicos.percutanea.title">Fisioterapia <em>Percutânea</em></h2>');
  html = rep(html, '<div class="section-label">Precisão Máxima</div>', '<div class="section-label" data-i18n="servicos.ecoguiada.label">Precisão Máxima</div>');
  html = rep(html, '<h2>Fisioterapia <em>Ecoguiada</em></h2>', '<h2 data-i18n-html="servicos.ecoguiada.title">Fisioterapia <em>Ecoguiada</em></h2>');
  html = rep(html, '<div class="section-label">Reabilitação Ativa</div>', '<div class="section-label" data-i18n="servicos.pilates.label">Reabilitação Ativa</div>');
  html = rep(html, '<h2>Pilates <em>Clínico</em></h2>', '<h2 data-i18n-html="servicos.pilates.title">Pilates <em>Clínico</em></h2>');
  html = rep(html, '<div class="section-label">Abordagem Holística</div>', '<div class="section-label" data-i18n="servicos.osteopatia.label">Abordagem Holística</div>');
  html = rep(html, '<h2>Osteopatia <em>Estrutural</em></h2>', '<h2 data-i18n-html="servicos.osteopatia.title">Osteopatia <em>Estrutural</em></h2>');
  html = rep(html, '<div class="section-label">Cuidado Especializado</div>', '<div class="section-label" data-i18n="servicos.pediatrica.label">Cuidado Especializado</div>');
  html = rep(html, '<h2>Osteopatia <em>Pediátrica</em></h2>', '<h2 data-i18n-html="servicos.pediatrica.title">Osteopatia <em>Pediátrica</em></h2>');
  html = rep(html, '<div class="section-label">Reeducação Postural</div>', '<div class="section-label" data-i18n="servicos.rpg.label">Reeducação Postural</div>');
  html = rep(html, '<h2>RPG — Reeducação Postural <em>Global</em></h2>', '<h2 data-i18n-html="servicos.rpg.title">RPG — Reeducação Postural <em>Global</em></h2>');

  // FAQ section
  html = rep(html,
    '<div class="section-label">Dúvidas</div>',
    '<div class="section-label" data-i18n="servicos.faq.label">Dúvidas</div>'
  );
  html = rep(html,
    '<h2 class="section-title">Perguntas sobre os <em>tratamentos</em></h2>',
    '<h2 class="section-title" data-i18n-html="servicos.faq.title">Perguntas sobre os <em>tratamentos</em></h2>'
  );

  writeFile('servicos.html', html);
}

// ─── blog.html ──────────────────────────────────────────────────────
{
  let html = readFile('blog.html');

  html = rep(html,
    '<div class="page-hero-label section-label">Saúde & Bem-estar</div>',
    '<div class="page-hero-label section-label" data-i18n="blog.hero.label">Saúde & Bem-estar</div>'
  );
  html = rep(html,
    '<h1>Artigos sobre <em>fisioterapia</em><br>e movimento</h1>',
    '<h1 data-i18n-html="blog.hero.title">Artigos sobre <em>fisioterapia</em><br>e movimento</h1>'
  );

  writeFile('blog.html', html);
}

// ─── politica-privacidade.html ───────────────────────────────────────
{
  let html = readFile('politica-privacidade.html');

  html = rep(html,
    '<span class="section-label">Transparência & Confiança</span>',
    '<span class="section-label" data-i18n="privacy.hero.label">Transparência & Confiança</span>'
  );
  html = rep(html,
    '<h1 class="section-title">Política de <em>Privacidade</em></h1>',
    '<h1 class="section-title" data-i18n-html="privacy.hero.title">Política de <em>Privacidade</em></h1>'
  );

  writeFile('politica-privacidade.html', html);
}

console.log('All remaining pages patched.');
