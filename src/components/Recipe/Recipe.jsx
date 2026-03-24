import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '../../redux/actions/actions';
import Modify from '../NewRecipe/Modify';
import style from './Recipe.module.css';

const getScoreClass = (score) => {
  if (score >= 70) return style.scoreHigh;
  if (score >= 40) return style.scoreMid;
  return style.scoreLow;
};

const Recipe = ({ image, name, diets, id, healthScore, summary, steps }) => {
  const dispatch    = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const isLocal = isNaN(id); // UUID = local DB recipe

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteRecipe(id));
  };

  return (
    <>
      <article className={style.card}>
        <div className={style.imageWrapper}>
          <img src={image} alt={name} />
          <Link to={`/detail/${id}`} className={style.imageOverlay}>
            <span className={style.viewLabel}>View Recipe</span>
          </Link>
          <span className={`${style.scoreBadge} ${getScoreClass(healthScore)}`}>
            ♥ {healthScore}
          </span>
          {isLocal && (
            <>
              <button
                className={style.editBtn}
                onClick={(e) => { e.stopPropagation(); setShowEdit(true); }}
                title="Edit recipe"
                aria-label="Edit recipe"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={style.deleteBtn} onClick={handleDelete} title="Delete recipe" aria-label="Delete recipe">
                ✕
              </button>
            </>
          )}
        </div>
        <div className={style.body}>
          <Link to={`/detail/${id}`}>
            <h3 className={style.name}>{name}</h3>
          </Link>
          <div className={style.diets}>
            {diets?.map((diet, i) => (
              <span key={i} className={style.dietTag}>{diet}</span>
            ))}
          </div>
        </div>
      </article>

      {showEdit && (
        <Modify
          recipe={{ id, name, image, summary, steps, healthScore, diets }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
};

export default Recipe;


