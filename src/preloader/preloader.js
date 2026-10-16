// Скрываем HTML-прелоадер после полной загрузки страницы
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  preloader.classList.add('preloader--hidden');

  // Удаляем элемент из DOM после завершения анимации
  preloader.addEventListener('transitionend', () => {
    preloader.remove();
  }, { once: true });
}

/**
 * Модуль текстового блока прелоадера.
 * Вызов: PreloaderText.init(selector) — рендерит текст в указанный контейнер.
 */
const PreloaderText = (() => {

  /* ---------- Создание текстового блока ---------- */
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

  /* ---------- Публичный API ---------- */
  function init(selector) {
    const container =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!container) {
      console.error('PreloaderText: контейнер не найден');
      return;
    }

    // Добавляем класс контейнера для стилизации, если нужно
    // container.classList.add('preloader-text-container'); 
    
    container.appendChild(buildText());
  }

  return { init };
})();

// Авто-инициализация текстового блока
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PreloaderText.init('#arka-logo'));
} else {
  PreloaderText.init('#arka-logo');
}

// Вариант 1: ждать, пока React отрендерится в #root
function waitForReact() {
  const root = document.getElementById('root');
  if (root && root.childElementCount > 0) {
    // Даём ещё немного времени на первую отрисовку
    setTimeout(hidePreloader, 200);
  } else {
    requestAnimationFrame(waitForReact);
  }
}

// Запускаем после загрузки DOM
if (document.readyState === 'complete') {
  waitForReact();
} else {
  window.addEventListener('load', waitForReact);
}

// Страховка: если что-то пошло не так, скрываем через 5 секунд
setTimeout(hidePreloader, 5000);