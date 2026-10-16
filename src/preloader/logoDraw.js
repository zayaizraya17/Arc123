/**
 * Анимация «рисования» логотипа прямо в прелоадере (вместо PNG-картинки).
 * Пути контуров сгенерированы из public/logo.png (см. logoPaths.js).
 */
import { LOGO_VIEWBOX, LOGO_STROKES, LOGO_FILL_PATH } from './logoPaths.js';

/* ---------- НАСТРОЙКИ АНИМАЦИИ ---------- */
export const DRAW_STROKE_MS = 350;   // время рисования одного контура
export const DRAW_GAP_MS = 60;       // пауза между контурами
export const FILL_FADE_MS = 900;     // затухание заливки после обводки
export const HOLD_AFTER_DRAW_MS = 1200; // сколько секунд держим дорисованный логотип

/** Полная длительность анимации рисования (обводка + заливка + удержание). */
export function getTotalDrawDurationMs() {
  return (
    LOGO_STROKES.length * (DRAW_STROKE_MS + DRAW_GAP_MS) +
    FILL_FADE_MS +
    HOLD_AFTER_DRAW_MS
  );
}

/**
 * Создаёт SVG-логотип и проигрывает анимацию рисования.
 * @param {HTMLElement} container — куда вставить SVG
 * @returns {{svg: SVGElement, finish: Function}} finish() мгновенно показывает итог
 */
export function mountLogoDrawing(container) {
  const NS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', LOGO_VIEWBOX);
  svg.setAttribute('class', 'preloader__logo-svg');
  svg.setAttribute('aria-hidden', 'true');

  // Слой заливки (появляется в конце)
  const fillPath = document.createElementNS(NS, 'path');
  fillPath.setAttribute('d', LOGO_FILL_PATH);
  fillPath.setAttribute('fill-rule', 'evenodd');
  fillPath.setAttribute('class', 'preloader__logo-fill');
  svg.appendChild(fillPath);

  // Слои обводки (рисуются по очереди)
  const strokeEls = LOGO_STROKES.map((d) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('class', 'preloader__logo-stroke');
    svg.appendChild(p);
    return p;
  });

  container.appendChild(svg);

  // Подготавливаем штрихи: длина контура -> dash для эффекта рисования
  strokeEls.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  let elapsed = 0;
  const timers = [];

  strokeEls.forEach((p, i) => {
    const delay = i * (DRAW_STROKE_MS + DRAW_GAP_MS);
    timers.push(
      setTimeout(() => {
        p.style.transition = `stroke-dashoffset ${DRAW_STROKE_MS}ms linear`;
        p.style.strokeDashoffset = '0';
      }, delay)
    );
    elapsed = delay + DRAW_STROKE_MS;
  });

  // Заливка плавно проявляется после последней обводки
  const fillDelay = elapsed + DRAW_GAP_MS;
  timers.push(
    setTimeout(() => {
      fillPath.classList.add('preloader__logo-fill--visible');
    }, fillDelay)
  );

  function finish() {
    timers.forEach(clearTimeout);
    strokeEls.forEach((p) => {
      p.style.transition = 'none';
      p.style.strokeDashoffset = '0';
    });
    fillPath.classList.add('preloader__logo-fill--visible');
  }

  return { svg, finish };
}
