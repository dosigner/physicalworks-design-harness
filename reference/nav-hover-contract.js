/**
 * PhysicalWorks v5 Console Shell & Left Hover-Rail Interaction Contract
 * Drop-in reference implementation for:
 *  1. Desktop Hover-Reveal Rail (64px <-> 240px) Escape immediate dismissal (data-hover-dismissed)
 *  2. Mobile Drawer (<= 699px) focus trap & inert background isolation
 *  3. Dual-theme toggle (html[data-theme="light" | "dark"]) with localStorage persistence
 *  4. 200% text zoom & 320px reflow sticky offset synchronization (syncStickyOffsets)
 */

const desktopHoverNavigation = window.matchMedia('(min-width: 700px) and (hover: hover) and (pointer: fine)');
const mobileNavigation = window.matchMedia('(max-width: 699px)');
const darkScheme = window.matchMedia?.('(prefers-color-scheme: dark)');

const navSidebar = document.getElementById('navigation');
const navToggle = document.getElementById('navToggle');
const themeToggle = document.getElementById('themeToggle');

export function setMenu(open) {
  if (!navSidebar) return;
  const isOpen = Boolean(open && mobileNavigation.matches);
  navSidebar.dataset.open = String(isOpen);
  navToggle?.setAttribute('aria-expanded', String(isOpen));
  document.documentElement.dataset.mobileNavOpen = String(isOpen);
  for (const selector of ['.app-body', '.skip-link', '.brand', '#connectButton', '#themeToggle']) {
    const el = document.querySelector(selector);
    if (el) el.inert = isOpen;
  }
}

// Re-enable hover expansion when pointer or keyboard focus re-enters the rail
const allowSidebarReveal = () => {
  delete navSidebar.dataset.hoverDismissed;
};
navSidebar?.addEventListener('pointerenter', allowSidebarReveal);
navSidebar?.addEventListener('focusin', allowSidebarReveal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && desktopHoverNavigation.matches && navSidebar?.matches(':hover, :has(:focus-visible)')) {
    navSidebar.dataset.hoverDismissed = 'true';
  }
  if (navSidebar?.dataset.open !== 'true') return;
  if (e.key === 'Escape') {
    e.preventDefault();
    setMenu(false);
    navToggle?.focus();
    return;
  }
  if (e.key !== 'Tab') return;
  const links = navSidebar.querySelectorAll('#navItems a:not([hidden])');
  if (!links.length) return;
  const focused = document.activeElement;
  if (e.shiftKey && focused === navToggle) { e.preventDefault(); links[links.length - 1]?.focus(); }
  else if (!e.shiftKey && focused === links[links.length - 1]) { e.preventDefault(); navToggle?.focus(); }
  else if (e.shiftKey && focused === links[0]) { e.preventDefault(); navToggle?.focus(); }
  else if (!e.shiftKey && focused === navToggle) { e.preventDefault(); links[0]?.focus(); }
});

export function applyTheme(theme) {
  const mode = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = mode;
  themeToggle?.setAttribute('aria-pressed', String(mode === 'dark'));
}

themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('x2_console_theme', next); } catch {}
  applyTheme(next);
});

darkScheme?.addEventListener?.('change', (event) => {
  try { if (localStorage.getItem('x2_console_theme')) return; } catch {}
  applyTheme(event.matches ? 'dark' : 'light');
});

export function syncStickyOffsets() {
  const root = document.documentElement;
  const header = document.querySelector('.app-header');
  root.style.removeProperty('--app-header-height');
  root.style.removeProperty('scroll-padding-top');
  if (header) {
    const natural = header.getBoundingClientRect().height;
    if (natural > parseFloat(getComputedStyle(header).minHeight) + 0.5) {
      root.style.setProperty('--app-header-height', `${Math.ceil(natural)}px`);
    }
  }
  const covered = [...document.querySelectorAll('.app-header, .context-bar')].reduce(
    (sum, el) => sum + (getComputedStyle(el).position === 'sticky' ? el.getBoundingClientRect().height : 0),
    0
  );
  if (covered + 8 > parseFloat(getComputedStyle(root).scrollPaddingTop)) {
    root.style.scrollPaddingTop = `${Math.ceil(covered) + 8}px`;
  }
}

// Wiring for the standalone reference shell (reference/console.html).
navToggle?.addEventListener('click', () => setMenu(navSidebar?.dataset.open !== 'true'));
mobileNavigation.addEventListener('change', () => setMenu(false));

let savedTheme = null;
try { savedTheme = localStorage.getItem('x2_console_theme'); } catch {}
applyTheme(savedTheme || (darkScheme?.matches ? 'dark' : 'light'));

// Re-measure sticky bars on resize and text zoom; rAF avoids the ResizeObserver loop warning.
const stickyObserver = new ResizeObserver(() => requestAnimationFrame(syncStickyOffsets));
for (const el of [document.documentElement, document.querySelector('.app-header'), document.querySelector('.context-bar')]) {
  if (el) stickyObserver.observe(el);
}

// Local .segmented view switchers: exactly one pressed button per group.
for (const group of document.querySelectorAll('.segmented')) {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    for (const item of group.querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
  });
}
