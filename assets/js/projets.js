/* ============================================================
   PROJETS — Chargement dynamique depuis projets.json
   + Filtrage par catégorie + Animations
   ============================================================ */

(async () => {

  const grid     = document.getElementById('projets-grid');
  const empty    = document.getElementById('projets-empty');
  const countEl  = document.getElementById('projets-count');
  const filtres  = document.querySelectorAll('.filtre-btn');

  if (!grid) return; // sécurité si le script est chargé hors de projets.html

  /* ----------------------------------------------------------
     1. CHARGEMENT DES DONNÉES JSON
     ---------------------------------------------------------- */
  let projets = [];
  try {
    const res = await fetch('../assets/data/projets.json');
    projets = await res.json();
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">Impossible de charger les projets.</p>';
    return;
  }

  /* ----------------------------------------------------------
     2. COULEURS PAR TECHNOLOGIE (badge coloré)
     ---------------------------------------------------------- */
  const techColors = {
    'Python':          { bg: 'rgba(55,118,171,0.18)',  color: '#6FB3E0' },
    'SQL':             { bg: 'rgba(255,160,0,0.15)',    color: '#FFBE44' },
    'MySQL':           { bg: 'rgba(0,117,143,0.18)',    color: '#00A3C4' },
    'Oracle':          { bg: 'rgba(204,0,0,0.15)',      color: '#FF6B6B' },
    'PostgreSQL':      { bg: 'rgba(51,103,145,0.18)',   color: '#5B9BD5' },
    'Power BI':        { bg: 'rgba(243,112,34,0.15)',   color: '#F7A05A' },
    'DAX':             { bg: 'rgba(243,112,34,0.12)',   color: '#F0804A' },
    'R':               { bg: 'rgba(34,100,200,0.15)',   color: '#6AADFF' },
    'SAS':             { bg: 'rgba(0,158,96,0.15)',     color: '#3DD68C' },
    'HTML':            { bg: 'rgba(227,76,38,0.15)',    color: '#FF7B57' },
    'HTML/CSS':        { bg: 'rgba(227,76,38,0.15)',    color: '#FF7B57' },
    'CSS':             { bg: 'rgba(38,77,228,0.15)',    color: '#7CA8FF' },
    'JavaScript':      { bg: 'rgba(240,219,79,0.12)',   color: '#F0DB4F' },
    'Flask':           { bg: 'rgba(0,0,0,0.2)',         color: '#AAAAAA' },
    'SQLite':          { bg: 'rgba(0,121,107,0.15)',    color: '#4DB6AC' },
    'Pandas':          { bg: 'rgba(22,150,243,0.15)',   color: '#64B5F6' },
    'Matplotlib':      { bg: 'rgba(255,152,0,0.15)',    color: '#FFB74D' },
    'Seaborn':         { bg: 'rgba(103,58,183,0.15)',   color: '#CE93D8' },
    'Plotly':          { bg: 'rgba(63,81,181,0.15)',    color: '#9FA8DA' },
    'scikit-learn':    { bg: 'rgba(243,156,18,0.15)',   color: '#F0A500' },
    'Scikit-learn':    { bg: 'rgba(243,156,18,0.15)',   color: '#F0A500' },
    'XGBoost':         { bg: 'rgba(0,188,212,0.15)',    color: '#4DD0E1' },
    'Airflow':         { bg: 'rgba(0,168,255,0.15)',    color: '#00BFFF' },
    'API REST':        { bg: 'rgba(76,175,80,0.15)',    color: '#81C784' },
    'BeautifulSoup':   { bg: 'rgba(121,85,72,0.15)',    color: '#BCAAA4' },
    'Excel':           { bg: 'rgba(33,115,70,0.15)',    color: '#66BB6A' },
    'Merise':          { bg: 'rgba(121,85,72,0.15)',    color: '#FFAB91' },
    'Draw.io':         { bg: 'rgba(255,87,34,0.12)',    color: '#FF8A65' },
    'ggplot2':         { bg: 'rgba(63,81,181,0.12)',    color: '#7986CB' },
    'dplyr':           { bg: 'rgba(33,150,243,0.12)',   color: '#64B5F6' },
    'R Markdown':      { bg: 'rgba(38,198,218,0.12)',   color: '#80DEEA' },
    'SAS ODS':         { bg: 'rgba(0,150,100,0.12)',    color: '#4CAF8F' },
    'Statistiques':    { bg: 'rgba(103,58,183,0.12)',   color: '#B39DDB' },
    'Modélisation':    { bg: 'rgba(156,39,176,0.15)',   color: '#CE93D8' },
    'Datawarehouse':   { bg: 'rgba(0,96,100,0.18)',     color: '#4DB6AC' },
    'Git/GitHub':      { bg: 'rgba(36,41,46,0.3)',      color: '#AAAAAA' },
    'folium':          { bg: 'rgba(76,175,80,0.15)',    color: '#81C784' },
    'csv':             { bg: 'rgba(100,100,100,0.15)',  color: '#BBBBBB' },
    'json':            { bg: 'rgba(100,100,100,0.12)',  color: '#CCCCCC' },
    'API':             { bg: 'rgba(76,175,80,0.12)',    color: '#81C784' },
    'fpp2':            { bg: 'rgba(34,100,200,0.12)',   color: '#6AADFF' },
    'Décomposition':   { bg: 'rgba(103,58,183,0.12)',   color: '#B39DDB' },
    'ARIMA':           { bg: 'rgba(0,121,107,0.15)',    color: '#4DB6AC' },
    'ETS':             { bg: 'rgba(0,121,107,0.12)',    color: '#80CBC4' },
    'RGPD':            { bg: 'rgba(183,28,28,0.15)',    color: '#EF9A9A' },
    'Gouvernance':     { bg: 'rgba(55,71,79,0.2)',      color: '#90A4AE' },
    'Sécurité':        { bg: 'rgba(183,28,28,0.12)',    color: '#EF9A9A' },
    'Anonymisation':   { bg: 'rgba(74,20,140,0.15)',    color: '#CE93D8' },
    'Pseudonymisation':{ bg: 'rgba(74,20,140,0.12)',    color: '#B39DDB' },
  };

  const defaultTechStyle = { bg: 'rgba(234,228,216,0.08)', color: 'var(--text-secondary)' };

  /* ----------------------------------------------------------
     3. GÉNÉRATION D'UNE CARTE PROJET
     ---------------------------------------------------------- */
  function creerCarte(projet) {
    const article = document.createElement('article');
    article.className = 'projet-card fade-in';
    article.dataset.categories = projet.categories.join(',');

    // Détermine si le projet a une page SAE réelle
    const hasSAEPage = projet.details && projet.details.startsWith('../SAE/');
    const hasDetails = projet.details && projet.details !== '#';

    // Cible du lien "Voir plus"
    // - SAE interne et index : même onglet
    // - Externe (GitHub, etc.) : nouvel onglet
    const isInternal = !hasDetails || hasSAEPage || projet.details === '../index.html';
    const target = isInternal ? '_self' : '_blank';

    // Badges technologies
    const techBadges = projet.technologies.map(tech => {
      const style = techColors[tech] || defaultTechStyle;
      return `<span class="tech-badge" style="background:${style.bg}; color:${style.color};">${tech}</span>`;
    }).join('');

    // Badges catégories
    const catBadges = projet.categories.map(cat =>
      `<span class="cat-badge cat-${cat.toLowerCase()}">${cat}</span>`
    ).join('');

    // Indicateur visuel pour les SAE avec page dédiée
    const saeBadge = hasSAEPage
      ? `<span class="sae-disponible" title="Page dédiée disponible">📄 Détails</span>`
      : '';

    article.innerHTML = `
      <div class="projet-card-inner">
        <div class="projet-card-header">
          ${catBadges}
          ${saeBadge}
        </div>
        <h3 class="projet-card-titre">${projet.titre}</h3>
        <p class="projet-card-desc">${projet.description}</p>
        <div class="projet-card-tech">${techBadges}</div>
        <div class="projet-card-actions">
          <a href="${hasDetails ? projet.details : '#'}"
             class="btn btn-primary btn-sm btn-voir-plus${!hasDetails ? ' btn-disabled' : ''}"
             target="${target}"
             ${!hasDetails ? 'aria-disabled="true"' : ''}
             data-titre="${projet.titre}">
            ${hasSAEPage ? 'Voir le projet →' : hasDetails ? 'Voir plus →' : 'À venir'}
          </a>
          <a href="${projet.github}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener" aria-label="Voir le code sur GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    `;

    return article;
  }

  /* ----------------------------------------------------------
     3b. ANIMATION DU BOUTON "Voir le projet"
     ---------------------------------------------------------- */
  function attacherAnimationsBoutons(conteneur) {
    conteneur.querySelectorAll('.btn-voir-plus:not(.btn-disabled)').forEach(btn => {
      btn.addEventListener('click', function(e) {
        // Ripple effect
        this.classList.add('btn-clicked');
        setTimeout(() => this.classList.remove('btn-clicked'), 400);
      });
    });

    // Bloquer les boutons "À venir"
    conteneur.querySelectorAll('.btn-voir-plus.btn-disabled').forEach(btn => {
      btn.addEventListener('click', e => e.preventDefault());
    });
  }

  /* ----------------------------------------------------------
     4. AFFICHAGE ET FILTRAGE
     ---------------------------------------------------------- */
  let filtreActif = 'Tous';

  function afficherProjets(filtre) {
    // Vider la grille
    grid.innerHTML = '';

    const filtres_actifs = filtre === 'Tous'
      ? projets
      : projets.filter(p => p.categories.includes(filtre));

    // Mettre à jour le compteur
    const n = filtres_actifs.length;
    countEl.textContent = n === 0
      ? 'Aucun projet'
      : `${n} projet${n > 1 ? 's' : ''}${filtre !== 'Tous' ? ' · ' + filtre : ''}`;

    if (filtres_actifs.length === 0) {
      empty.style.display = 'flex';
      return;
    }

    empty.style.display = 'none';

    // Ajouter les cartes avec un délai de staggering pour l'animation
    filtres_actifs.forEach((projet, i) => {
      const carte = creerCarte(projet);
      // Délai d'apparition décalé (stagger)
      carte.style.animationDelay = `${i * 60}ms`;
      grid.appendChild(carte);
    });

    // Attacher les animations aux boutons nouvellement créés
    attacherAnimationsBoutons(grid);

    // Relancer l'IntersectionObserver pour les nouvelles cartes
    document.querySelectorAll('.projet-card.fade-in:not(.visible)').forEach(el => {
      if (window._appearObserver) window._appearObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     5. ÉVÉNEMENTS SUR LES BOUTONS DE FILTRE
     ---------------------------------------------------------- */
  filtres.forEach(btn => {
    btn.addEventListener('click', () => {
      // Retirer la classe active de tous les boutons
      filtres.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filtreActif = btn.dataset.filtre;

      // Animation de transition sur la grille
      grid.classList.add('grid-transition');
      setTimeout(() => {
        afficherProjets(filtreActif);
        grid.classList.remove('grid-transition');
      }, 200);
    });
  });

  /* ----------------------------------------------------------
     6. INITIALISATION
     ---------------------------------------------------------- */
  afficherProjets('Tous');

  // Exposer l'observer du script.js aux nouvelles cartes
  // On recrée un observer local pour les cartes chargées dynamiquement
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  // Sauvegarder l'observer pour y accéder après rechargement du filtre
  window._appearObserver = cardObserver;

  // Observer les cartes initiales (légèrement en différé pour laisser le DOM se stabiliser)
  setTimeout(() => {
    document.querySelectorAll('.projet-card.fade-in').forEach(el => cardObserver.observe(el));
  }, 50);

})();
