/**
 * Прелоадер: рендерит текстовый блок и скрывается после отрисовки React-приложения.
 */

const HIDE_DELAY_MS = 200;   // пауза после первой отрисовки React
const FALLBACK_MS = 5000;    // страховка: скрыть прелоадер, если что-то пошло не так

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
function waitForReact() {
  const root = document.getElementById('root');
  if (root && root.childElementCount > 0) {
    // Даём ещё немного времени на первую отрисовку
     setTimeout(hidePreloader, HIDE_DELAY_MS);
  } else {
    requestAnimationFrame(waitForReact);
  }
}

/* ---------- Инициализация ---------- */

mountText('#arka-logo');
if (document.readyState === 'complete') {
  waitForReact();
} else {
  window.addEventListener('load', waitForReact);
}
// Страховка: если приложение не отрисовалось, скрываем прелоадер принудительно
setTimeout(hidePreloader, FALLBACK_MS);