
import { Link } from 'react-router-dom';
import style from './LandingPages.module.css';

const LandingPages = () => (
  <div className={style.container}>
    <span className={style.badge}>🍳 Recipe Explorer</span>
    <h1 className={style.title}>PI Food</h1>
    <p className={style.subtitle}>
      Discover thousands of recipes from around the world. Cook, explore, create.
    </p>
    <Link to="/home">
      <button className={style.cta}>Explore Recipes →</button>
    </Link>
    <p className={style.credits}>By David Flores</p>
  </div>
);

export default LandingPages;

