import { Link, Route, Routes, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
];

export default function App() {

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="nav__logo">
          <img src="/logo.png" alt="Logo" />
          <span>MyApp</span>
        </Link>

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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}