/* ============================================================
   PORTFOLIO — BUT Science des Données
   JavaScript principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. ANIMATION D'ENTRÉE DE PAGE — en premier pour éviter
        toute page blanche si une erreur survient plus bas
     ---------------------------------------------------------- */
  document.body.classList.add('page-loaded');

  /* ----------------------------------------------------------
     1. NAVBAR — scroll, burger, lien actif
     ---------------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = navLinks ? navLinks.querySelectorAll('a') : [];

  // Ombre navbar au scroll
  const handleNavScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Menu burger (mobile)
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Fermer menu au clic sur un lien
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Fermer menu au clic en dehors
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Lien actif selon la page courante
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hrefFile = href ? href.split('/').pop() : '';
    if (hrefFile === currentPage || (currentPage === '' && hrefFile === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     2. BOUTON RETOUR EN HAUT
     ---------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     3. ANIMATIONS AU SCROLL (Intersection Observer)
     ---------------------------------------------------------- */
  const animatedEls = document.querySelectorAll(
    '.fade-in, .slide-left, .slide-right, .scale-in'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        appearObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedEls.forEach(el => appearObserver.observe(el));

  /* ----------------------------------------------------------
     4. BARRES DE PROGRESSION (skill bars)
     ---------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');

  if (skillFills.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.dataset.width || '70%';
          // Léger délai pour l'effet visuel
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 200);
          skillObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(fill => skillObserver.observe(fill));
  }

  /* ----------------------------------------------------------
     5. COMPTEURS ANIMÉS (stat cards)
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1400;
          const step = Math.ceil(duration / target);
          let current = 0;

          const timer = setInterval(() => {
            current += Math.ceil(target / 50);
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, step);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ----------------------------------------------------------
     6. EFFET DE FRAPPE (typing effect) — hero
     ---------------------------------------------------------- */
  const typingEl = document.getElementById('typing-text');

  if (typingEl) {
    const words = typingEl.dataset.words
      ? JSON.parse(typingEl.dataset.words)
      : ['Science des Données', 'Data Analyst', 'Étudiant en BUT SD'];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const type = () => {
      if (isPaused) return;

      const currentWord = words[wordIndex];

      if (!isDeleting) {
        charIndex++;
        typingEl.textContent = currentWord.slice(0, charIndex);
        if (charIndex === currentWord.length) {
          isPaused = true;
          setTimeout(() => { isPaused = false; isDeleting = true; type(); }, 2000);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = currentWord.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      const speed = isDeleting ? 60 : 110;
      setTimeout(type, speed);
    };

    // Démarrer l'effet après l'animation d'entrée
    setTimeout(type, 1400);
  }

  /* ----------------------------------------------------------
     7. CARTES — effet 3D subtil au survol
     ---------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.bloc-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ----------------------------------------------------------
     8. SMOOTH SCROLL pour les ancres internes
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height'), 10) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     9. HIGHLIGHT DE LA SECTION ACTIVE dans la navbar
        (pour les pages avec sections à ancres)
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  /* ----------------------------------------------------------
     10. INDICATEUR DE PROGRESSION DE LA PAGE
     ---------------------------------------------------------- */
  const progressBar = document.getElementById('page-progress');

  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
  }


});
