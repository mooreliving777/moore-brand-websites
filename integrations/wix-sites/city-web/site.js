(() => {
  const button = document.querySelector('button.menu[aria-controls], button.nav-toggle[aria-controls]');
  const nav = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
  if (button && nav) {
    const setOpen = (open) => {
      button.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      nav.classList.toggle('is-open', open);
    };
    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
