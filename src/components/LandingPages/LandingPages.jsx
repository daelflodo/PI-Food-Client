
import { Link } from 'react-router-dom';
import style from './LandingPages.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const FEATURES = [
  {
    emoji: '🌍',
    title: '10,000+ Recipes',
    desc: 'Browse a vast collection powered by the Spoonacular API — from Italian classics to exotic Asian dishes.',
  },
  {
    emoji: '✍️',
    title: 'Create Your Own',
    desc: 'Build and save your personal recipes with custom steps, dietary tags and cloud-hosted images.',
  },
  {
    emoji: '🥗',
    title: '27 Diet Categories',
    desc: 'Filter by vegan, keto, gluten-free, paleo and many more dietary preferences at a glance.',
  },
  {
    emoji: '🔍',
    title: 'Instant Search',
    desc: 'Find any recipe by name with real-time results merged from both your database and Spoonacular.',
  },
  {
    emoji: '💯',
    title: 'Health Score',
    desc: 'Every recipe carries a health score from 0 to 100 so you can make informed, nutritious choices.',
  },
  {
    emoji: '☁️',
    title: 'Cloud Images',
    desc: 'Upload recipe photos directly via Cloudinary — fast, reliable and always accessible.',
  },
];

const LandingPages = () => (
  <div className={style.wrapper}>

    {/* ── Hero ── */}
    <section className={style.hero}>
      <span className={style.badge}>🍳 Recipe Explorer</span>
      <h1 className={style.title}>PI Food</h1>
      <p className={style.subtitle}>
        Discover thousands of recipes from around the world. Cook, explore, create.
      </p>
      <Link to="/home" className={style.ctaLink}>
        <button className={style.cta}>Explore Recipes →</button>
      </Link>
      <div className={style.scrollHint}>
        <span>What you&apos;ll find</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>

    {/* ── Features ── */}
    <section className={style.features}>
      <p className={style.featuresLabel}>EVERYTHING YOU NEED</p>
      <h2 className={style.featuresTitle}>Your ultimate recipe companion</h2>
      <div className={style.featuresGrid}>
        {FEATURES.map(({ emoji, title, desc }) => (
          <div key={title} className={style.featureCard}>
            <span className={style.featureEmoji}>{emoji}</span>
            <h3 className={style.featureTitle}>{title}</h3>
            <p className={style.featureDesc}>{desc}</p>
          </div>
        ))}
      </div>
      <Link to="/home" className={style.ctaLink}>
        <button className={`${style.cta} ${style.ctaOutline}`}>Get Started Now →</button>
      </Link>
      <a href={API_URL} className={style.ctaLink}>
        <button className={`${style.cta} ${style.ctaOutline}`}>Docs Back-end →</button>
      </a>
    </section>

    <p className={style.credits}>By David Flores</p>
  </div>
);

export default LandingPages;

