import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import style from './Recipe.module.css';

const getScoreClass = (score) => {
  if (score >= 70) return style.scoreHigh;
  if (score >= 40) return style.scoreMid;
  return style.scoreLow;
};

const Recipe = ({ image, name, diets, id, healthScore }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
      .then((res) => alert(res.data))
      .catch((err) => alert(err.response?.data));
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <article className={style.card}>
      <div className={style.imageWrapper}>
        <img src={image} alt={name} />
        <Link to={`/detail/${id}`} className={style.imageOverlay}>
          <span className={style.viewLabel}>View Recipe</span>
        </Link>
        <span className={`${style.scoreBadge} ${getScoreClass(healthScore)}`}>
          ♥ {healthScore}
        </span>
        {isNaN(id) && (
          <button className={style.deleteBtn} onClick={handleDelete} title="Delete recipe">
            ✕
          </button>
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
  );
};

export default Recipe;

