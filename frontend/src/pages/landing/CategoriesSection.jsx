import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import mensImg from '../../assets/category_mens_fashion.jpg';
import perfumeImg from '../../assets/category_perfume.jpg';
import boysImg from '../../assets/category_boys_fashion.jpg';
import './CategoriesSection.css';

const CATEGORIES = [
  {
    id: 'mens-fashion',
    name: "Men's Fashion",
    tagline: 'Tailored silhouettes, linen shirts & streetwear',
    tag: 'APPAREL',
    image: mensImg,
    alt: "Young man in sharp black linen shirt — Men's Fashion",
    path: '/categories?cat=mens-fashion',
  },
  {
    id: 'perfumes',
    name: 'Fragrances & Oud',
    tagline: 'Extrait de parfums, smoky oud & citrus elixirs',
    tag: 'SIGNATURE SCENTS',
    image: perfumeImg,
    alt: 'Luxury fragrance flacon with artisanal oud extracts',
    path: '/categories?cat=perfumes',
  },
  {
    id: 'boys-fashion',
    name: "Boys' Fashion",
    tagline: 'Modern youth streetwear, cargos & statement tees',
    tag: 'URBAN ESSENTIALS',
    image: boysImg,
    alt: "Young boy in stylish modern streetwear — Boys' Fashion",
    path: '/categories?cat=boys-fashion',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CategoriesSection() {
  return (
    <section className="categories section" aria-labelledby="categories-title">
      <div className="container">
        <motion.header
          className="categories__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Department Index</p>
          <div className="divider divider--center" />
          <h2 id="categories-title" className="categories__title">
            Explore Curated Departments
          </h2>
          <p className="categories__subtitle">
            Crafted for the distinctive tastes of contemporary gentlemen across Sri Lanka.
          </p>
        </motion.header>

        <motion.div
          className="categories__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {CATEGORIES.map((cat) => (
            <motion.article
              key={cat.id}
              className="category-card"
              variants={cardVariants}
            >
              <Link to={cat.path} className="category-card__link">
                <div className="category-card__image-wrap">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    className="category-card__image"
                    loading="lazy"
                  />
                  <div className="category-card__overlay" />
                  <div className="category-card__glow" />
                </div>

                <div className="category-card__content">
                  <span className="category-card__tag">{cat.tag}</span>
                  <div className="category-card__bottom">
                    <div>
                      <h3 className="category-card__name">{cat.name}</h3>
                      <p className="category-card__tagline">{cat.tagline}</p>
                    </div>
                    <div className="category-card__arrow-wrap" aria-hidden="true">
                      <ArrowUpRight size={18} className="category-card__arrow" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
