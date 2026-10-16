export default function About() {
  return (
    <main>
      <section className="hero">
        <h1 className="hero__title">О проекте</h1>
        <p className="hero__subtitle">
          Это демонстрация современного подхода к разработке веб-приложений
        </p>
      </section>


      <section className="cards">
        <div className="card">
          <div className="card__icon">📦</div>
          <h3 className="card__title">Технологии</h3>
          <p className="card__text">
            React 18, Vite, React Router, современный CSS с анимациями
          </p>
        </div>

        <div className="card">
          <div className="card__icon">✨</div>
          <h3 className="card__title">Возможности</h3>
          <p className="card__text">
            Прелоадер с анимацией, адаптивный дизайн, плавные переходы между страницами
          </p>
        </div>

        <div className="card">
          <div className="card__icon">🎯</div>
          <h3 className="card__title">Цель</h3>
          <p className="card__text">
            Показать best practices для создания современных веб-приложений
          </p>
        </div>
      </section>
    </main>
  );
}