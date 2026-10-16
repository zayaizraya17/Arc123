import Page from '../components/Page';
import Card from '../components/Card';

const CARDS = [
  { icon: '📦', title: 'Технологии', text: 'React 19, Vite, React Router, современный CSS с анимациями' },
  { icon: '✨', title: 'Возможности', text: 'Прелоадер с SVG-анимацией рисования логотипа, адаптивный дизайн, плавные переходы между страницами' },
  { icon: '🎯', title: 'Цель', text: 'Показать best practices для создания современных веб-приложений' },
];

export default function About() {
  return (
     <Page title="О проекте" subtitle="Это демонстрация современного подхода к разработке веб-приложений">
      {CARDS.map(({ icon, title, text }) => (
        <Card key={title} icon={icon} title={title} text={text} />
      ))}
    </Page>
  );
}