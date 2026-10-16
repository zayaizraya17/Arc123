/**
 * Прелоадер: рендерит текстовый блок и скрывается после отрисовки React-приложения.
 */
import {
  mountLogoDrawing,
  getTotalDrawDurationMs,
  FILL_FADE_MS,
  HOLD_AFTER_DRAW_MS,
} from './logoDraw.js';

const MIN_VISIBLE_MS = 3000; // минимальное время показа прелоадера
const HIDE_DELAY_MS = 800;   // пауза после завершения анимации/первой отрисовки React
const FALLBACK_MS = Math.max(MIN_VISIBLE_MS, getTotalDrawDurationMs()) + 1500; // страховка

/* ---------- Логотип (анимация рисования) ---------- */

let drawFinishedAt = null; // когда завершилась анимация рисования логотипа

function mountLogo() {
  const container = document.getElementById('arka-logo');
  if (!container) return;
  try {
    const { finish } = mountLogoDrawing(container);
    // Страховка: если анимация не завершилась вовремя — показать итог мгновенно
    setTimeout(finish, getTotalDrawDurationMs());
  } catch (e) {
    console.error('Preloader: не удалось отрисовать логотип', e);
  }
}
/* ---------- Текстовый блок ---------- */

function buildText() {
  const wrap = document.createElement('div');
  wrap.className = 'arka-logo__text';

  const title = document.createElement('div');
  title.className = 'arka-logo__title';
  title.textContent = 'АРКА 123';

  const sub1 = document.createElement('div');
  sub1.className = 'arka-logo__subtitle arka-logo__subtitle--line1';
  sub1.textContent = 'Встречаемся напротив';

  const sub2 = document.createElement('div');
  sub2.className = 'arka-logo__subtitle arka-logo__subtitle--line2';
  sub2.textContent = 'библиотеки.';

    wrap.append(title, sub1, sub2);
    return wrap;
  }

  function mountText(selector) {
  const container = document.querySelector(selector);
  if (!container) {
    console.error('Preloader: контейнер не найден', selector);
    return;
  }
  container.appendChild(buildText());
}

 /* ---------- Скрытие ---------- */

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader || preloader.dataset.hiding) return;
  preloader.dataset.hiding = 'true';

  preloader.classList.add('preloader--hidden');
  // Удаляем элемент из DOM после завершения CSS-анимации
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
}

// Вариант 1: ждать, пока React отрендерится в #root
// Ждём, пока React отрендерится в #root и анимация логотипа завершится
let reactReadyAt = null;

function tryHideWhenReady() {
  if (reactReadyAt === null || drawFinishedAt === null) return;
  const readyAt = Math.max(reactReadyAt, drawFinishedAt);
  const wait = Math.max(0, readyAt + HIDE_DELAY_MS - Date.now());
  setTimeout(hidePreloader, wait);
}

function markReactReady() {
  if (reactReadyAt !== null) return;
  reactReadyAt = Date.now();
  tryHideWhenReady();
}

function markDrawFinished() {
  if (drawFinishedAt !== null) return;
  drawFinishedAt = Date.now();
  tryHideWhenReady();
}

function waitForReact() {
  const root = document.getElementById('root');
  if (root && root.childElementCount > 0) {
    // Даём ещё немного времени на первую отрисовку
     markReactReady();
  } else {
    requestAnimationFrame(waitForReact);
  }
}

/* ---------- Инициализация ---------- */
mountLogo();
mountText('#arka-logo');

// Отслеживаем завершение анимации рисования логотипа
const logoFillObserver = setInterval(() => {
  const fill = document.querySelector('.preloader__logo-fill--visible');
  if (fill) {
    clearInterval(logoFillObserver);
    // Заливка проявляется в конце обводки, добавим время на её затухание и удержание
    setTimeout(markDrawFinished, FILL_FADE_MS + HOLD_AFTER_DRAW_MS);
  }
}, 100);

if (document.readyState === 'complete') {
  waitForReact();
} else {
  window.addEventListener('load', waitForReact);
}
// Страховка: если приложение не отрисовалось, скрываем прелоадер принудительно
setTimeout(hidePreloader, FALLBACK_MS);