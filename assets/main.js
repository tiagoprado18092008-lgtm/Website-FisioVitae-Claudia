/* ═══════════════════════════════════════
   FISIO VITAE — Shared JS
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR STICKY & SCROLL ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      navbar.classList.toggle('scrolled', isScrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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

  // ── SCROLL REVEAL (legacy + new .reveal data-delay) ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const showReveal = (el) => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    if (delay) {
      setTimeout(() => { el.classList.add('visible', 'is-visible'); }, delay);
    } else {
      el.classList.add('visible', 'is-visible');
    }
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible', 'is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showReveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => {
      // If already in viewport at load time (above the fold), reveal immediately
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) {
        showReveal(el);
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety net: after 2s, force-reveal anything still hidden in case observer missed it
    setTimeout(() => {
      revealEls.forEach(el => {
        if (!el.classList.contains('visible') && !el.classList.contains('is-visible')) {
          el.classList.add('visible', 'is-visible');
        }
      });
    }, 2000);
  }

  // ── COUNTER ANIMATION ──
  // Works for elements with [data-target] or [data-count] attribute.
  // Optional [data-suffix] for trailing characters (e.g. "+", "★").
  // Optional [data-decimals="1"] for one-decimal animation (e.g. 4.9).
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.dataset.count || '0');
    const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1500;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-target], [data-count]');
  if (counterEls.length > 0) {
    const setFinal = (el) => {
      const target = parseFloat(el.dataset.target || el.dataset.count || '0');
      const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      counterEls.forEach(setFinal);
    } else {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      counterEls.forEach(el => {
        const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
        el.textContent = '0' + suffix;
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport && !el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el);
        } else {
          counterObserver.observe(el);
        }
      });

      // Safety net: any counter still showing "0" or "0+" after 2.5s gets its final value
      setTimeout(() => {
        counterEls.forEach(el => { if (!el.dataset.animated) setFinal(el); });
      }, 2500);
    }
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

  // ── SVC QUICKINFO STICKY (show after scrolling past hero) ──
  const quickinfo = document.querySelector('.svc-quickinfo');
  if (quickinfo) {
    const pageHero = document.querySelector('.page-hero');
    const triggerY = pageHero ? pageHero.offsetTop + pageHero.offsetHeight - 80 : 300;
    const toggleQuickInfo = () => {
      quickinfo.classList.toggle('visible', window.scrollY > triggerY);
    };
    window.addEventListener('scroll', toggleQuickInfo, { passive: true });
    toggleQuickInfo();
  }

  // ── LIGHTBOX (GLightbox) ──
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      closeButton: true
    });
  }

  // ── ASSISTENTE / CHAT WIDGET ──
  const chatWidget = document.getElementById('chatWidget');
  if (chatWidget) {
    const WA_NUMBER = '351253623663';
    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatText');

    const openChat = () => {
      chatWidget.classList.add('open');
      fab.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      setTimeout(() => input && input.focus(), 280);
    };
    const closeChat = () => {
      chatWidget.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    };
    const toggleChat = () => {
      chatWidget.classList.contains('open') ? closeChat() : openChat();
    };

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWidget.classList.contains('open')) closeChat();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = (input.value || '').trim() || 'Olá! Gostaria de marcar uma consulta.';
      const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
      input.value = '';
    });
  }

});
