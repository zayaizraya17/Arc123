/**
 * Хук-мост между императивным прелоадером (src/preloader) и React-приложением.
 *
 * Прелоадер живёт вне React (подключается напрямую в index.html), поэтому
 * синхронизация идёт через глобальную шину событий `window.PreloaderBus`:
 *   - приложение сообщает о готовности (signalReactReady);
 *   - прелоадер сообщает о завершении анимации (signalDrawFinished);
 *   - обе стороны подписываются на событие скрытия (onHidden).
 */
import { useEffect } from 'react';

const CHANNEL = 'PreloaderBus';

function getBus() {
  if (!window[CHANNEL]) {
    window[CHANNEL] = new EventTarget();
  }
  return window[CHANNEL];
}

/** Сообщает прелоадеру, что React-приложение отрисовано. */
export function signalReactReady() {
  getBus().dispatchEvent(new CustomEvent('react-ready'));
}

/** Сообщает сторонам, что анимация логотипа завершена. */
export function signalDrawFinished() {
  getBus().dispatchEvent(new CustomEvent('draw-finished'));
}

/** Подписка на факт скрытия прелоадера. Возвращает функцию отписки. */
export function onPreloaderHidden(callback) {
  const bus = getBus();
  const handler = () => callback();
  bus.addEventListener('preloader-hidden', handler);
  return () => bus.removeEventListener('preloader-hidden', handler);
}

/**
 * При монтировании уведомляет прелоадер о готовности приложения,
 * при размонтировании — отписывается от шины.
 */
export function usePreloaderDismiss() {
  useEffect(() => {
    signalReactReady();
    return onPreloaderHidden(() => {
      /* прелоадер скрыт — можно запускать входные анимации и т.п. */
    });
  }, []);
}