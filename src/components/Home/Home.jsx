import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderName, filterCreated, filterRecipesDiet, orderRecipesScore } from '../../redux/actions/actions';
import Recipe from '../Recipe/Recipe';
import style from './Home.module.css';

const ITEMS_PER_PAGE = 9;
const MAX_VISIBLE_PAGES = 7;

const Home = () => {
  const dispatch = useDispatch();
  const allRecipes = useSelector((state) => state.recipes);
  const allDiets   = useSelector((state) => state.diets);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages     = Math.ceil(allRecipes.length / ITEMS_PER_PAGE);
  const startIndex     = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecipes = allRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilter = useCallback(
    (actionCreator) => (e) => {
      dispatch(actionCreator(e.target.value));
      setCurrentPage(1);
    },
    [dispatch]
  );

  // Build smart page number array with dots
  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const left  = Math.max(2, currentPage - 2);
    const right = Math.min(totalPages - 1, currentPage + 2);
    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <main className={style.container}>
      <div className={style.controls}>
        <div className={style.selectWrapper}>
          <select className={style.select} onChange={handleFilter(OrderName)} defaultValue="">
            <option value="" disabled>Order by Title</option>
            <option value="A-Z">A → Z</option>
            <option value="Z-A">Z → A</option>
          </select>
        </div>

        <span className={style.controlsDivider} />

        <div className={style.selectWrapper}>
          <select className={style.select} onChange={handleFilter(orderRecipesScore)} defaultValue="">
            <option value="" disabled>Order by Score</option>
            <option value="Ascendente">Score ↑</option>
            <option value="Descendente">Score ↓</option>
          </select>
        </div>

        <span className={style.controlsDivider} />

        <div className={style.selectWrapper}>
          <select className={style.select} onChange={handleFilter(filterRecipesDiet)} defaultValue="">
            <option value="" disabled>Filter by Diet</option>
            <option value="allDiets">All Diets</option>
            {allDiets?.map((diet, i) => (
              <option key={i} value={diet.name}>{diet.name}</option>
            ))}
          </select>
        </div>

        <span className={style.controlsDivider} />

        <div className={style.selectWrapper}>
          <select className={style.select} onChange={handleFilter(filterCreated)} defaultValue="">
            <option value="" disabled>Filter by Source</option>
            <option value="allRecipes">All</option>
            <option value="api">From API</option>
            <option value="db">Custom</option>
          </select>
        </div>
      </div>

      <div className={style.grid}>
        {currentRecipes.length === 0 ? (
          <div className={style.empty}>
            <span className={style.emptyIcon}>🍽️</span>
            <p className={style.emptyText}>No recipes found — try a different filter.</p>
          </div>
        ) : (
          currentRecipes.map((recipe) => (
            <Recipe
              key={recipe.id}
              id={recipe.id}
              name={recipe.name}
              image={recipe.image}
              diets={recipe.diets}
              healthScore={recipe.healthScore}
              summary={recipe.summary}
              steps={recipe.steps}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={style.paginationWrapper}>
          <p className={style.pageInfo}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </p>
          <nav className={style.pagination}>
            <button
              className={style.navBtn}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            <span className={style.paginationSep} />

            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <span key={`dots-${i}`} className={style.paginationDots}>···</span>
              ) : (
                <button
                  key={page}
                  className={`${style.pageBtn} ${currentPage === page ? style.pageBtnActive : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <span className={style.paginationSep} />

            <button
              className={style.navBtn}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </nav>
        </div>
      )}
    </main>
  );
};

export default Home;
