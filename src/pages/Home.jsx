import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Card from '../components/Card';

const CARDS = [
  { icon: '⚡', title: 'Быстрый старт', text: 'Vite обеспечивает молниеносный hot reload и быструю сборку проекта' },
  { icon: '🎨', title: 'Современный дизайн', text: 'Glassmorphism, градиенты и плавные анимации для лучшего UX' },
  { icon: '🚀', title: 'React + Router', text: 'Полноценное SPA с роутингом и компонентным подходом' },
];

export default function Home() {
  return (
     <Page
      title={<>Добро пожаловать<br />в будущее</>}
      subtitle="Современное SPA приложение на React с красивым дизайном и плавными анимациями"
    >
      <Link to="/about" className="btn">
        Узнать больше →
      </Link>
      {CARDS.map(({ icon, title, text }) => (
        <Card key={title} icon={icon} title={title} text={text} />
      ))}
    </Page>
  );
}