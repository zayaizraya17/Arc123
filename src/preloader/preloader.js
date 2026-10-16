/**
 * Прелоадер: рендерит текстовый блок и скрывается после отрисовки React-приложения.
 */
import { mountLogoDrawing } from './logoDraw.js';

const LOGO_CONTAINER_ID = 'arka-logo';
const PRELOADER_ID = 'preloader';
const ROOT_ID = 'root';
const BUS_CHANNEL = 'PreloaderBus';

const HIDE_DELAY_MS = 800; // пауза после готовности анимации и приложения

/* ---------- Шина событий ---------- */

function getBus() {
  if (!window[BUS_CHANNEL]) {
    window[BUS_CHANNEL] = new EventTarget();
  }
  return window[BUS_CHANNEL];
}

/* ---------- Логотип (анимация рисования) ---------- */

let drawFinishedAt = null; // когда завершилась анимация рисования логотипа

function mountLogo() {
    const container = document.getElementById(LOGO_CONTAINER_ID);
  if (!container) return;
  try {
  const { finish, totalMs } = mountLogoDrawing(container);

    // Анимация считается завершённой по истечении её полной длительности
    setTimeout(markDrawFinished, totalMs);

    // Страховка: если тайминги CSS-переходов «уплыдут» — показать итог сразу
    setTimeout(finish, totalMs + 1000);
  } catch (e) {
    console.error('Preloader: не удалось отрисовать логотип', e);
  markDrawFinished(); // всё равно считаем этап пройденным
  }
}
/* ---------- Текстовый блок ---------- */

const TEXT_LINES = [
  { className: 'arka-logo__title', text: 'АРКА 123' },
  { className: 'arka-logo__subtitle arka-logo__subtitle--line1', text: 'Встречаемся напротив' },
  { className: 'arka-logo__subtitle arka-logo__subtitle--line2', text: 'библиотеки.' },
];

function buildText() {
  const wrap = document.createElement('div');
  wrap.className = 'arka-logo__text';
 for (const { className, text } of TEXT_LINES) {
    const el = document.createElement('div');
    el.className = className;
    el.textContent = text;
    wrap.appendChild(el);
  }
  return wrap;
}
  function mountText() {
  const container = document.getElementById(LOGO_CONTAINER_ID);
  if (!container) {
    console.error(`Preloader: контейнер #${LOGO_CONTAINER_ID} не найден`);
    return;
  }
  container.appendChild(buildText());
}

 /* ---------- Скрытие ---------- */

function hidePreloader() {
   const preloader = document.getElementById(PRELOADER_ID);
  if (!preloader || preloader.dataset.hiding) return;
  preloader.dataset.hiding = 'true';

  preloader.classList.add('preloader--hidden');
  // Удаляем элемент из DOM после завершения CSS-анимации
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    // ...и принудительно, если transitionend не сработал (например, вкладка в фоне)
  setTimeout(() => preloader.remove(), 1000);

  getBus().dispatchEvent(new CustomEvent('preloader-hidden'));
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

// Способ 1 (основной): событие от React-приложения через шину
getBus().addEventListener('react-ready', markReactReady);

// Способ 2 (совместимость): опрос #root до первой отрисовки React
function waitForReactDom() {
  const root = document.getElementById(ROOT_ID);
  if (root && root.childElementCount > 0) {
    // Даём ещё немного времени на первую отрисовку
     markReactReady();
  } else {
      requestAnimationFrame(waitForReactDom);
  }
}

/* ---------- Инициализация ---------- */
mountLogo();
mountText();

if (document.readyState === 'complete') {
   waitForReactDom();
} else {
  window.addEventListener('load', waitForReactDom);
}
// Страховка: если приложение не отрисовалось, скрываем прелоадер принудительно
setTimeout(hidePreloader, 30000);