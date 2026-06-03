# Fundir páginas "Sobre" e "Equipa" — Design

**Data:** 2026-06-03
**Objetivo:** Ter apenas uma página institucional (`sobre.html`) que contém a história, missão/valores, instalações **e** a equipa completa com perfis detalhados. Remover o separador "Equipa" da navegação, redirecionar todos os links para `sobre.html`, melhorar e otimizar a secção de equipa para mobile, e garantir que a tradução EN funciona.

## Decisões tomadas (com o utilizador)

1. **Conteúdo da equipa:** migrar o conteúdo detalhado e atualizado da `equipa.html` para a `sobre.html` (não manter a secção simples antiga). A `equipa.html` tem cargos corretos e bios melhores:
   - Inês Macedo → Fisioterapeuta
   - Patrícia → **Nutricionista** (na sobre antiga estava como fisioterapeuta)
   - José Pereira → **Analista Reikiano · Instrutor de Pilates Clínico**
   - Rafaela **Torres** → Rececionista & Coordenação Administrativa
   - Dra. Cláudia Alves → Fisioterapeuta · Fundadora & Resp. Clínica
2. **Nível de detalhe:** junção da página equipa com o sobre — manter os perfis completos (cards + secções detalhadas com bio longa, citação, tags e CTA).
3. **equipa.html:** transformar num redirecionamento automático para `sobre.html` (meta refresh + canonical), para não partir links indexados/externos.

## Estrutura final da `sobre.html`

Ordem das secções:

1. Page hero — "A Nossa História" *(mantém)*
2. História split *(mantém)*
3. Stats band *(mantém)*
4. Missão & Valores *(mantém)*
5. **Equipa (substituída)** — migrada da equipa.html:
   - intro de equipa + grelha de cards (5 pessoas, com âncoras `#claudia`, `#ines`, `#patricia`, `#jose`, `#rafaela`)
   - perfis detalhados por pessoa (foto + bio longa + citação + tags + CTA)
   - secção "Não tratamos sintomas, tratamos pessoas" + foto de grupo
6. Instalações *(mantém)*
7. CTA final *(mantém)*

O CSS específico da equipa.html (`.team-hero`, `#team-strip`, `.member-section`, `#team-group`, etc.) é migrado para o bloco `<style>` da sobre.html, **adaptado** — descarta-se o `.team-hero` (a sobre já tem o seu próprio page-hero), aproveitando-se a grelha de cards, as secções de membro e a secção de grupo.

As fontes Playfair Display + DM Sans usadas pela equipa.html são adicionadas ao `<head>` da sobre.html (a sobre usa Inter; os perfis migrados usam família própria via `.eq-*`/regras locais, por isso é necessário carregá-las).

## Navegação e links — alterações em todos os 29 HTML

- **Menu desktop:** remover `<li><a href="equipa.html" ...>Equipa</a></li>`.
- **Menu mobile:** remover `<a href="equipa.html" ...>Equipa</a>`.
- **Footer (coluna Clínica):** remover `<li><a href="equipa.html" ...>Equipa</a></li>` (o "Sobre Nós" cobre).
- **index.html hero overlay:** `hero-overlay-link` aponta para `sobre.html` (âncora `#equipa` opcional).
- **404.html:** o `nf-link` "Equipa" passa a apontar para `sobre.html`.
- **sobre.html** botão "Ver Perfis Completos" (`equipa.html`) → removido, porque os perfis passam a estar na mesma página.

Padrões a substituir (contagem real do grep):
- `href="equipa.html" data-i18n="nav.team"` → 84 ocorrências (linhas de menu/footer — remover as linhas)
- `href="equipa.html" class="hero-overlay-link"` → 1 (index) → `sobre.html`
- `href="equipa.html" class="nf-link"` → 1 (404) → `sobre.html`
- `href="equipa.html" class="btn-primary"` → 1 (sobre, secção antiga — removido com a secção)
- `href="equipa.html" class="active" data-i18n="nav.team"` → 1 (equipa.html — vira redirect)
- `href="equipa.html"` (footer accent-line) → 1 → remover

## Mobile

A secção migrada traz CSS responsivo próprio (cards 5→3→2→1, perfis empilhados, foto sticky desativada). Integrar nos breakpoints da sobre (1024 / 768 / 640 / 400) e afinar:
- grelha de cards de equipa adapta a 2 colunas em tablet e 1 em telemóvel pequeno;
- secções de membro: foto deixa de ser sticky e empilha acima do texto;
- secção de grupo: passa a 1 coluna.

## Tradução EN

As chaves `team.*` já existem em `en.json` e `pt.json`. Ao migrar o HTML mantêm-se os atributos `data-i18n="team.*"`/`data-i18n-html`, por isso a tradução continua a funcionar sem novas chaves. Verificação final: confirmar que todas as chaves `data-i18n` presentes na nova secção existem nos dois ficheiros JSON.

## equipa.html → redirect

Substituir o conteúdo da `equipa.html` por uma página mínima:
- `<link rel="canonical" href=".../sobre.html">`
- `<meta http-equiv="refresh" content="0; url=sobre.html">`
- `<script>location.replace('sobre.html')</script>` + fallback `<a href="sobre.html">`

## Verificação

- Abrir `sobre.html` no browser, confirmar todas as secções e os perfis.
- Alternar PT/EN e confirmar tradução da secção de equipa.
- Testar viewport mobile (375px) — alinhamentos dos cards e perfis.
- Confirmar que nenhum HTML mostra ainda o separador "Equipa" e que `equipa.html` redireciona.
