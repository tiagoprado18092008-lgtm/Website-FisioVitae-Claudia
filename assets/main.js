/* ═══════════════════════════════════════
   FISIO VITAE — Shared JS
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR STICKY & SCROLL ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      const isScrolled = window.scrollY > 20;
      navbar.classList.toggle('scrolled', isScrolled);
      navbar.style.position = isScrolled ? 'fixed' : 'fixed';
    }, { passive: true });
  }

  // ── SUBMENU KEEP-OPEN (timer prevents flicker when moving to submenu) ──
  document.querySelectorAll('.dropdown-cat-item').forEach(item => {
    const sub = item.querySelector('.dropdown-sub');
    if (!sub) return;
    let t;
    item.addEventListener('mouseleave', () => {
      t = setTimeout(() => item.classList.remove('sub-open'), 120);
    });
    sub.addEventListener('mouseenter', () => clearTimeout(t));
    sub.addEventListener('mouseleave', () => item.classList.remove('sub-open'));
    item.addEventListener('mouseenter', () => { clearTimeout(t); item.classList.add('sub-open'); });
  });

  // ── NAVBAR CTA SHAKE ON HOVER ──
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    navCta.addEventListener('mouseenter', () => {
      navCta.style.animation = 'shake-cta .4s cubic-bezier(.22,1,.36,1)';
      setTimeout(() => { navCta.style.animation = ''; }, 400);
    });
  }

  // ── ACTIVE NAV LINK ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  let menuOpen = false;
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileNav.classList.toggle('open', menuOpen);
      const spans = hamburger.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ── SCROLL REVEAL ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const counterEls = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  counterEls.forEach(el => {
    // Normalize initial state so the pre-animation render shows the suffix correctly
    const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
    el.textContent = '0' + suffix;
    counterObserver.observe(el);
  });

  // ── HERO STATS COUNTER ON PAGE LOAD ──
  const heroMetaItems = document.querySelectorAll('.hero-meta-num');
  if (heroMetaItems.length > 0) {
    const heroStatsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting && !entry.target.dataset.heroAnimated) {
          entry.target.dataset.heroAnimated = 'true';
          setTimeout(() => {
            const originalText = entry.target.innerHTML;
            let target, suffix = '';

            if (entry.target.textContent.includes('4.9')) {
              target = 49;
              suffix = '★';
            } else {
              const num = entry.target.textContent.replace(/[^\d]/g, '');
              target = parseInt(num);
              suffix = entry.target.textContent.match(/[+★]/g) ? entry.target.textContent.match(/[+★]/g)[0] : '';
            }

            const duration = 1200;
            const start = performance.now();
            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);

              if (target === 49) {
                entry.target.innerHTML = '<span style="font-size: 1.4rem;">' + (current * 0.1).toFixed(1) + '</span>' + suffix;
              } else {
                entry.target.textContent = current + suffix;
              }

              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
          }, i * 100);
        }
      });
    }, { threshold: 0.5 });
    heroMetaItems.forEach(el => heroStatsObserver.observe(el));
  }

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── FORM VALIDATION ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = [
        { id: 'nome', validate: v => v.trim().length >= 2, groupId: 'group-nome' },
        { id: 'telefone', validate: v => /^\d[\d\s]{8,}$/.test(v.trim()), groupId: 'group-telefone' },
        { id: 'mensagem', validate: v => v.trim().length >= 10, groupId: 'group-mensagem' },
      ];
      const emailEl = document.getElementById('email');

      fields.forEach(({ id, validate, groupId }) => {
        const el = document.getElementById(id);
        const group = document.getElementById(groupId);
        if (!el || !group) return;
        group.classList.remove('has-error');
        el.classList.remove('error');
        if (!validate(el.value)) {
          group.classList.add('has-error');
          el.classList.add('error');
          valid = false;
        }
      });

      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        document.getElementById('group-email')?.classList.add('has-error');
        emailEl.classList.add('error');
        valid = false;
      }

      if (valid) {
        contactForm.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
      }
    });
  }

  // ── CLOSE MOBILE NAV ON LINK CLICK ──
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('open');
      menuOpen = false;
      const spans = hamburger?.querySelectorAll('span');
      if (spans) spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

});
