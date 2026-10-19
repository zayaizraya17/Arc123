import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { usePreloaderDismiss } from './preloader/usePreloaderDismiss.js';
import './App.css';

const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
];

export default function App() {
  // Сообщаем прелоадеру, что приложение отрисовано, и синхронно
  // скрываем его — теперь это делает и сам прелоадер, и React.
  usePreloaderDismiss();

  // Плавно прокручиваем наверх при смене маршрута
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="app">
      <nav className="nav">
      <NavLink to="/" className="nav__logo" aria-label="На главную">
          <img src="/logo.png" alt="Логотип АРКА 123" />
        </NavLink>

        <ul className="nav__links">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Здесь рендерится текущая страница (см. routes в main.jsx) */}
      <Outlet />
    </div>
  );
}