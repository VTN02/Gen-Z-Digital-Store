import { Link } from 'react-router-dom';
import mensFashionImg from '../../assets/category_mens_fashion.jpg';
import boysFashionImg from '../../assets/category_boys_fashion.jpg';
import perfumeImg from '../../assets/category_perfume.jpg';
import './CategoriesSection.css';

const CATEGORIES = [
  {
    id: 'mens-fashion',
    name: "Men's Fashion",
    description: 'Contemporary styles for the modern man. From casual to formal.',
    image: mensFashionImg,
    link: '/categories/mens-fashion',
    size: 'large',
  },
  {
    id: 'boys-fashion',
    name: "Boys' Fashion",
    description: 'Fresh and bold looks for the next generation.',
    image: boysFashionImg,
    link: '/categories/boys-fashion',
    size: 'small',
  },
  {
    id: 'perfumes',
    name: 'Perfumes',
    description: 'Signature fragrances that leave a lasting impression.',
    image: perfumeImg,
    link: '/categories/perfumes',
    size: 'small',
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    description: 'The latest additions to the Gen-Z collection.',
    image: mensFashionImg, // placeholder until new arrivals image exists
    link: '/shop?sort=newest',
    size: 'small',
  },
];

export default function CategoriesSection() {
  return (
    <section className="categories section" aria-labelledby="categories-title">
      <div className="container">
        <header className="categories__header">
          <p className="section-label">Collections</p>
          <div className="divider" />
          <h2 id="categories-title" className="categories__title">
            Shop by Category
          </h2>
        </header>

        <div className="categories__grid">
          {CATEGORIES.map((cat, i) => (
            <Link
              to={cat.link}
              key={cat.id}
              className={`category-card category-card--${cat.size}`}
              aria-label={`Browse ${cat.name}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="category-card__image-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-card__image"
                  loading="lazy"
                />
                <div className="category-card__overlay" aria-hidden="true" />
              </div>
              <div className="category-card__content">
                <h3 className="category-card__name">{cat.name}</h3>
                <p className="category-card__desc">{cat.description}</p>
                <span className="category-card__cta">
                  Browse <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
