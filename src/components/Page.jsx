/**
 * Общий каркас страниц: hero-заголовок + сетка карточек.
 * Убирает дублирование разметки между Home и About.
 */
export default function Page({ title, subtitle, children }) {
  return (
    <main>
      <section className="hero">
        <h1 className="hero__title">{title}</h1>
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
      </section>

      <section className="cards">{children}</section>
    </main>
  );
}
