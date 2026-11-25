import bundledSchedule from '../../public/header-messages.json';
import { activeMessage, nextMessageBoundary, validateSchedule } from '../lib/scheduled-messages.mjs';

export function initHeaderMessages() {
  const header = document.querySelector('header.fixed-name');
  if (!header || header.querySelector('.header-message')) return;
  const root = document.documentElement;
  const banner = document.createElement('div');
  banner.className = 'header-message';
  banner.hidden = true;
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-atomic', 'true');
  const viewport = document.createElement('div');
  viewport.className = 'header-message-viewport';
  const text = document.createElement('span');
  text.className = 'header-message-text';
  viewport.append(text);
  banner.append(viewport);
  header.append(banner);

  let schedule = validateSchedule(bundledSchedule);
  let timer;
  let lastRefresh = -Infinity;
  let refreshing = false;

  function measure() {
    const height = banner.hidden ? 0 : banner.getBoundingClientRect().height;
    root.style.setProperty('--header-message-height', `${height}px`);
    const overflow = Math.max(0, text.scrollWidth - viewport.clientWidth);
    banner.classList.toggle('has-overflow', overflow > 1);
    banner.style.setProperty('--message-travel', `${-overflow}px`);
    banner.style.setProperty('--message-duration', `${Math.max(16, overflow / 24)}s`);
    viewport.tabIndex = overflow > 1 ? 0 : -1;
  }

  function sync() {
    clearTimeout(timer);
    const now = Date.now();
    const current = activeMessage(schedule, now);
    if (text.textContent !== (current?.text ?? '')) text.textContent = current?.text ?? '';
    banner.hidden = !current;
    banner.dataset.messageId = current?.id ?? '';
    root.classList.toggle('has-header-message', Boolean(current));
    measure();
    const next = nextMessageBoundary(schedule, now);
    timer = setTimeout(() => {
      sync();
      refresh();
    }, Math.min(60000, next === null ? 60000 : Math.max(1, next - now)));
  }

  async function refresh() {
    if (refreshing || performance.now() - lastRefresh < 60000) return;
    refreshing = true;
    lastRefresh = performance.now();
    try {
      const response = await fetch('/header-messages.json', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('Header message schedule unavailable');
      schedule = validateSchedule(await response.json());
      sync();
    } catch (error) {
      // The bundled or last valid schedule still expires locally, even offline.
      console.warn('Using last valid header message schedule', error);
    } finally {
      refreshing = false;
    }
  }

  sync();
  refresh();
  window.addEventListener('resize', measure);
  window.addEventListener('pageshow', () => { sync(); refresh(); });
  window.addEventListener('focus', () => { sync(); refresh(); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { sync(); refresh(); }
  });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(banner);
  document.fonts?.ready.then(measure);
}
