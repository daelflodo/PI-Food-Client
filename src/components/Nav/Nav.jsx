import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import style from './Nav.module.css';
import logoFood from '../../img-food/logo.png';
import logoGitHub from '../../img-food/GitHub-Logo.png';

const Nav = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/home';

  return (
    <header className={style.nav}>
      <Link to="/" className={style.logo}>
        <img src={logoFood} alt="PI Food logo" className={style.logoIcon} />
        <span className={style.logoText}>PI Food</span>
      </Link>

      <div className={style.actions}>
        {!isHome && (
          <Link to="/home">
            <button className={style.btn}>← Home</button>
          </Link>
        )}
        {isHome && <SearchBar />}
        {isHome && (
          <>
            <Link to="/newRecipe">
              <button className={`${style.btn} ${style.btnPrimary}`}>+ New Recipe</button>
            </Link>
          </>
        )}
        <a
          href="https://github.com/daelflodo"
          target="_blank"
          rel="noreferrer"
          className={style.github}
        >
          <img src={logoGitHub} alt="GitHub profile" />
        </a>
      </div>
    </header>
  );
};

export default Nav;
