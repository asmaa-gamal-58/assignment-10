(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('asmaa-theme');
  const savedColor = localStorage.getItem('asmaa-accent');
  const savedFont = localStorage.getItem('asmaa-font');

  if (savedTheme === 'dark') root.classList.add('dark');
  if (savedColor) root.style.setProperty('--accent', savedColor);
  if (savedFont) root.style.setProperty('--font', savedFont === 'Tahoma' ? 'Tahoma,sans-serif' : `"${savedFont}",sans-serif`);
  const markActive = (selector, attr, value) => document.querySelectorAll(selector).forEach(item => item.classList.toggle('active', item.getAttribute(attr) === value));
  markActive('.mode-option', 'data-mode', savedTheme || 'light');
  markActive('.color-swatch', 'data-color', savedColor || '#6863f5');
  markActive('.font-option', 'data-font', savedFont || 'Cairo');

  const panel = document.querySelector('.settings-panel');
  const gear = document.querySelector('.settings-toggle');
  function toggleSettings(open) {
    document.body.classList.toggle('settings-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    gear.setAttribute('aria-expanded', String(open));
    (open ? document.querySelector('.settings-close') : gear).focus();
  }
  gear.addEventListener('click', () => toggleSettings(true));
  document.querySelector('.settings-close').addEventListener('click', () => toggleSettings(false));
  document.querySelector('.settings-backdrop').addEventListener('click', () => toggleSettings(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.body.classList.contains('settings-open')) toggleSettings(false); });

  document.querySelectorAll('.mode-option').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    root.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('asmaa-theme', mode);
    markActive('.mode-option', 'data-mode', mode);
  }));
  document.querySelector('.theme-quick').addEventListener('click', () => {
    const dark = !root.classList.contains('dark');
    root.classList.toggle('dark', dark);
    localStorage.setItem('asmaa-theme', dark ? 'dark' : 'light');
    markActive('.mode-option', 'data-mode', dark ? 'dark' : 'light');
  });
  document.querySelectorAll('.color-swatch').forEach(button => button.addEventListener('click', () => {
    const color = button.dataset.color;
    root.style.setProperty('--accent', color);
    localStorage.setItem('asmaa-accent', color);
    markActive('.color-swatch', 'data-color', color);
  }));
  document.querySelectorAll('.font-option').forEach(button => button.addEventListener('click', () => {
    const font = button.dataset.font;
    root.style.setProperty('--font', font === 'Tahoma' ? 'Tahoma,sans-serif' : `"${font}",sans-serif`);
    localStorage.setItem('asmaa-font', font);
    markActive('.font-option', 'data-font', font);
  }));

  const navLinks = [...document.querySelectorAll('.nav-link')];
  const observed = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-19% 0px -58% 0px', threshold: [0,.15,.35,.6] });
  observed.forEach(section => navObserver.observe(section));

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  });
  navLinks.forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));

  const topButton = document.querySelector('.to-top');
  const updateTop = () => topButton.classList.toggle('visible', window.scrollY > 380);
  window.addEventListener('scroll', updateTop, { passive: true }); updateTop();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const tabs = [...document.querySelectorAll('.tab')];
  const projects = [...document.querySelectorAll('.project-card')];
  function selectTab(tab) {
    tabs.forEach(item => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); });
    projects.forEach(project => { project.hidden = tab.dataset.filter !== 'all' && project.dataset.category !== tab.dataset.filter; });
    document.querySelector('.project-grid').setAttribute('aria-labelledby', tab.id);
  }
  tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab)));
  document.querySelector('.tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.indexOf(document.activeElement);
    const nextIndex = (index + (event.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus(); selectTab(tabs[nextIndex]);
  });

  const cards = [...document.querySelectorAll('.testimonial-card')];
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  let activeCard = 0;
  function showCard(index) {
    activeCard = (index + cards.length) % cards.length;
    cards.forEach((card, i) => card.classList.toggle('active', i === activeCard));
    dots.forEach((dot, i) => { dot.classList.toggle('active', i === activeCard); dot.setAttribute('aria-pressed', String(i === activeCard)); });
  }
  document.querySelector('.previous').addEventListener('click', () => showCard(activeCard - 1));
  document.querySelector('.next').addEventListener('click', () => showCard(activeCard + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showCard(i)));

  document.querySelector('.demo-button').addEventListener('click', event => {
    event.currentTarget.textContent = 'رائع! التفاعل يعمل ✨';
  });
  document.querySelector('.contact-form').addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('.form-status').textContent = 'تم تجهيز النموذج — اربطيه بخدمة إرسال لتلقي الرسائل.';
  });
})();
