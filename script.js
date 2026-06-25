/**
 * AHOSAN HABIB LIKHON — PORTFOLIO SCRIPT
 * Premium Interactive Portfolio with Animations
 */

'use strict';

/* ============================================================
   PERSONAL DATA — Edit this section to update your info
============================================================ */
const PORTFOLIO_CONFIG = {
  name: 'Ahosan Habib Likhon',
  github: 'ahosanhabiblikhon',
  typedStrings: [
    'Biotechnology Student',
    'Aspiring Front-End Developer',
    'AI & Bioinformatics Enthusiast',
    'Research Enthusiast',
    'Creative Photographer',
    'Genetic Engineering Explorer'
  ]
};

/* ============================================================
   UTILITY
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const ready = fn => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

/* ============================================================
   LOADER
============================================================ */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;
  const messages = ['Initializing...', 'Loading DNA...', 'Sequencing...', 'Ready!'];
  let i = 0;
  const textEl = $('.loader-text');
  const interval = setInterval(() => {
    i++;
    if (textEl && messages[i]) textEl.textContent = messages[i];
    if (i >= messages.length - 1) clearInterval(interval);
  }, 400);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1200);
  });
}

/* ============================================================
   CUSTOM CURSOR
============================================================ */
function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  $$('a, button, [role="button"], .gallery-item, .skill-card, .repo-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      follower.style.width = '48px';
      follower.style.height = '48px';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '';
      cursor.style.height = '';
      follower.style.width = '';
      follower.style.height = '';
      follower.style.opacity = '';
    });
  });
}

/* ============================================================
   SCROLL PROGRESS
============================================================ */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
}

/* ============================================================
   NAVBAR
============================================================ */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  // Scrolled state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Back to top
    const btn = $('#back-to-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Active link tracking
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));

  // Hamburger
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for all anchor links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   THEME TOGGLE
============================================================ */
function initTheme() {
  const btn = $('#theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

/* ============================================================
   BACK TO TOP
============================================================ */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   TYPED EFFECT
============================================================ */
function initTyped() {
  const el = $('#typed-text');
  if (!el) return;

  const strings = PORTFOLIO_CONFIG.typedStrings;
  let strIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = strings[strIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        strIndex = (strIndex + 1) % strings.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  type();
}

/* ============================================================
   REVEAL ON SCROLL
============================================================ */
function initReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in same parent
        const siblings = $$('.reveal-up, .reveal-left, .reveal-right', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   SKILL BARS ANIMATION
============================================================ */
function initSkillBars() {
  const bars = $$('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   PARTICLE CANVAS
============================================================ */
function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#7c6cfc' : Math.random() > 0.5 ? '#a855f7' : '#06b6d4';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }

  // Create particles
  const count = Math.min(80, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#7c6cfc';
          ctx.globalAlpha = 0.06 * (1 - dist / 120);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(animate);
  }
  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else animate();
  });
}

/* ============================================================
   GITHUB REPOS
============================================================ */
const LANG_COLORS = {
  JavaScript: '#f1e05a', Python: '#3572a5', HTML: '#e34c26', CSS: '#563d7c',
  TypeScript: '#2b7489', Java: '#b07219', 'C++': '#f34b7d', C: '#555555',
  'Jupyter Notebook': '#da5b0b', Markdown: '#083fa1', Shell: '#89e051', Ruby: '#701516'
};

function getLangClass(lang) {
  if (!lang) return 'lang-default';
  return 'lang-' + lang.replace(/[^a-zA-Z]/g, '');
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function createRepoCard(repo) {
  const langColor = LANG_COLORS[repo.language] || '#8b949e';
  const desc = repo.description || 'No description provided.';
  const card = document.createElement('div');
  card.className = 'glass-card repo-card reveal-up';
  card.innerHTML = `
    <div class="repo-card-header">
      <span class="repo-name">${repo.name}</span>
      <span class="repo-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      </span>
    </div>
    <p class="repo-desc">${desc}</p>
    <div class="repo-meta">
      ${repo.language ? `
      <span class="repo-meta-item">
        <span class="lang-dot" style="background:${langColor}" aria-hidden="true"></span>
        ${repo.language}
      </span>` : ''}
      <span class="repo-meta-item" aria-label="${repo.stargazers_count} stars">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ${repo.stargazers_count}
      </span>
      <span class="repo-meta-item" aria-label="${repo.forks_count} forks">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>
        ${repo.forks_count}
      </span>
    </div>
    <div class="repo-footer">
      <span class="repo-updated">Updated ${formatDate(repo.updated_at)}</span>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-btn" aria-label="View ${repo.name} on GitHub">GitHub →</a>
    </div>
  `;
  return card;
}

function renderRepos(repos) {
  const container = $('#github-repos');
  if (!container) return;
  container.innerHTML = '';
  if (!repos || repos.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px">No repositories found.</p>';
    return;
  }
  repos.forEach(repo => container.appendChild(createRepoCard(repo)));

  // Trigger reveal
  setTimeout(() => {
    $$('.repo-card.reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }, 100);

  // Update repo count in hero
  const heroCount = $('#repo-count');
  if (heroCount) heroCount.textContent = repos.length;
}

async function fetchGithubRepos() {
  const container = $('#github-repos');
  const statsEl = $('#repo-stats');
  if (!container) return;

  let allRepos = [];

  try {
    const res = await fetch(`https://api.github.com/users/${PORTFOLIO_CONFIG.github}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error('API error');
    allRepos = await res.json();
    // Filter forks out by default, show own repos
    allRepos = allRepos.filter(r => !r.fork);
    if (statsEl) statsEl.textContent = `${allRepos.length} repositories`;
    renderRepos(allRepos.slice(0, 12));
  } catch (e) {
    if (container) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted)">
          <p>Could not load repositories automatically.</p>
          <a href="https://github.com/${PORTFOLIO_CONFIG.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="margin-top:16px;display:inline-flex">
            View on GitHub →
          </a>
        </div>`;
    }
  }

  // Sort buttons
  const sortBtns = $$('.sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const sort = btn.dataset.sort;
      if (sort === 'stars') {
        const sorted = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
        renderRepos(sorted.slice(0, 12));
      } else {
        renderRepos(allRepos.slice(0, 12));
      }
    });
  });
}

/* ============================================================
   PHOTOGRAPHY GALLERY
============================================================ */
function initGallery() {
  const filters = $$('.filter-btn');
  const items = $$('.gallery-item');
  const lightbox = $('#lightbox');
  const lightboxContainer = $('#lightbox-img-container');
  const lightboxCaption = $('#lightbox-caption');
  let currentIdx = 0;

  // Filter
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox open
  items.forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('.gallery-link')) return;
      const idx = parseInt(item.dataset.index);
      openLightbox(idx);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(parseInt(item.dataset.index));
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  function getVisibleItems() {
    return items.filter(i => !i.classList.contains('hidden'));
  }

  function openLightbox(idx) {
    currentIdx = idx;
    showLightboxItem(idx);
    lightbox.removeAttribute('hidden');
    lightbox.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function showLightboxItem(idx) {
    const visible = getVisibleItems();
    const item = visible.find(i => parseInt(i.dataset.index) === idx) || visible[0];
    if (!item) return;

    const caption = item.querySelector('.gallery-caption');
    const placeholder = item.querySelector('.gallery-placeholder');

    lightboxContainer.innerHTML = '';

    // Try to get actual img if it exists, else show placeholder
    const imgEl = item.querySelector('img');
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || 'Gallery image';
      lightboxContainer.appendChild(img);
    } else {
      // Clone the placeholder for lightbox display
      const clone = placeholder ? placeholder.cloneNode(true) : document.createElement('div');
      clone.style.cssText = 'width:400px;height:400px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;';
      lightboxContainer.appendChild(clone);
    }

    if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
  }

  // Close
  $('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Navigation
  $('.lightbox-prev')?.addEventListener('click', () => {
    const visible = getVisibleItems();
    const indices = visible.map(i => parseInt(i.dataset.index));
    const pos = indices.indexOf(currentIdx);
    currentIdx = indices[(pos - 1 + indices.length) % indices.length];
    showLightboxItem(currentIdx);
  });

  $('.lightbox-next')?.addEventListener('click', () => {
    const visible = getVisibleItems();
    const indices = visible.map(i => parseInt(i.dataset.index));
    const pos = indices.indexOf(currentIdx);
    currentIdx = indices[(pos + 1) % indices.length];
    showLightboxItem(currentIdx);
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (lightbox && !lightbox.hasAttribute('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') $('.lightbox-prev')?.click();
      if (e.key === 'ArrowRight') $('.lightbox-next')?.click();
    }
  });
}

/* ============================================================
   CONTACT FORM
============================================================ */
function initContactForm() {
  const form = $('#contact-form');
  const statusEl = $('#form-status');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#form-submit');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.textContent = 'Please fill in all required fields.';
        statusEl.className = 'form-note error';
      }
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (statusEl) {
        statusEl.textContent = 'Please enter a valid email address.';
        statusEl.className = 'form-note error';
      }
      return;
    }

    // Simulate sending (replace with actual form service like Formspree or EmailJS)
    btn.disabled = true;
    btn.innerHTML = `<div class="loading-spinner" style="width:16px;height:16px;border-width:2px" aria-hidden="true"></div> Sending...`;

    await new Promise(r => setTimeout(r, 1500));

    if (statusEl) {
      statusEl.textContent = 'Message sent! I\'ll get back to you soon.';
      statusEl.className = 'form-note success';
    }
    form.reset();
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Send Message`;

    setTimeout(() => {
      if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-note'; }
    }, 5000);
  });
}

/* ============================================================
   FOOTER YEAR
============================================================ */
function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   INIT ALL
============================================================ */
ready(() => {
  initLoader();
  initTheme();
  initCursor();
  initScrollProgress();
  initNavbar();
  initBackToTop();
  initTyped();
  initReveal();
  initSkillBars();
  initParticles();
  initGallery();
  initContactForm();
  initFooterYear();
  fetchGithubRepos();
});
