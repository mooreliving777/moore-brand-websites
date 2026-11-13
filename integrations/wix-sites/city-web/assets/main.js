(() => {
  const toggle = document.querySelector('.nav-toggle');
  if (!toggle) return;

  const menu = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!menu) return;

  const setOpen = (open) => {
    menu.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  toggle.addEventListener('click', () => {
    setOpen(menu.dataset.open !== 'true');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (menu.dataset.open === 'true' && !menu.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });
})();