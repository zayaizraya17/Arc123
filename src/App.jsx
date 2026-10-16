import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="nav__logo">
          <img src="/logo.png" alt="Logo" />
        </Link>

        <ul className="nav__links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              О нас
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}