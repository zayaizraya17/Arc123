/** Карточка для секции «cards». */
export default function Card({ icon, title, text }) {
  return (
    <div className="card">
      <div className="card__icon">{icon}</div>
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{text}</p>
    </div>
  );
}
