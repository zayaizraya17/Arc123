import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1 className="hero__title">
          Добро пожаловать<br />в будущее
        </h1>
        <p className="hero__subtitle">
          Современное SPA приложение на React с красивым дизайном и плавными анимациями
        </p>
        <Link to="/about" className="btn">
          Узнать больше →
        </Link>
      </section>

      <section className="cards">
        <div className="card">
          <div className="card__icon">⚡</div>
          <h3 className="card__title">Быстрый старт</h3>
          <p className="card__text">
            Vite обеспечивает молниеносную hot reload и быструю сборку проекта
          </p>
        </div>

        <div className="card">
          <div className="card__icon">🎨</div>
          <h3 className="card__title">Современный дизайн</h3>
          <p className="card__text">
            Glassmorphism, градиенты и плавные анимации для лучшего UX
          </p>
        </div>

        <div className="card">
          <div className="card__icon">🚀</div>
          <h3 className="card__title">React + Router</h3>
          <p className="card__text">
            Полноценное SPA с роутингом и компонентным подходом
          </p>
        </div>
      </section>
    </main>
  );
}