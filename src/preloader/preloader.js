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

// Путь к гифке относительно корня public/ (например, '/loader.gif').
// Когда путь не указан — гифка просто не добавляется, ошибок не будет.
const GIF_SRC = './logoV.gif'; // <-- укажите здесь путь к вашей гифке, например '/loader.gif'

function mountGif() {
  if (!GIF_SRC) return;
  const container = document.getElementById(LOGO_CONTAINER_ID);
  if (!container) return;
  const img = document.createElement('img');
  img.className = 'preloader__gif';
  img.src = GIF_SRC;
  img.alt = '';
  container.insertBefore(img, container.firstChild);
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

  // Страховка: если по какой-то причине прелоадер остался виден
  // (например, у элемента нет CSS-перехода), убираем его совсем,
  // чтобы главная страница гарантированно появилась.
  setTimeout(() => {
    const p = document.getElementById(PRELOADER_ID);
    if (p) p.remove();
  }, 2000);
// Вариант 1: ждать, пока React отрендерится в #root
// Ждём, пока React отрендерится в #root и анимация логотипа завершится
let reactReadyAt = null;

function markReactReady() {
  if (reactReadyAt !== null) return;
  reactReadyAt = Date.now();
   setTimeout(hidePreloader, HIDE_DELAY_MS);
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
mountGif();

if (document.readyState === 'complete') {
   waitForReactDom();
} else {
  window.addEventListener('load', waitForReactDom);
}
// Страховка: если приложение не отрисовалось, скрываем прелоадер принудительно
setTimeout(hidePreloader, 30000);