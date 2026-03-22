import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipeDetail } from '../../redux/actions/actions';
import styles from './Detail.module.css';

const getScoreClass = (score, s) => {
  if (score >= 70) return s.scoreHigh;
  if (score >= 40) return s.scoreMid;
  return s.scoreLow;
};

const Detail = () => {
  const dispatch = useDispatch();
  const { id }   = useParams();
  const data     = useSelector((state) => state.details);

  useEffect(() => {
    dispatch(getRecipeDetail(id));
  }, [dispatch, id]);

  if (!data?.name) {
    return <div className={styles.loading}>Loading recipe…</div>;
  }

  const dietsArray = Array.isArray(data.diets)
    ? data.diets
    : typeof data.diets === 'string'
    ? data.diets.split(',').map((d) => d.trim())
    : [];

  const summary = data.summary?.replace(/(<([^>]+)>)/gi, '') ?? '';

  return (
    <div className={styles.page}>
      <article className={styles.card}>
        {data.image && (
          <div className={styles.hero}>
            <img src={data.image} alt={data.name} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>{data.name}</h1>
            <span className={`${styles.score} ${getScoreClass(data.healthScore, styles)}`}>
              ♥ {data.healthScore}
            </span>
          </div>

          {summary && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Summary</p>
              <p className={styles.text}>{summary}</p>
            </div>
          )}

          {data.steps && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Steps</p>
              <p className={styles.text}>{data.steps}</p>
            </div>
          )}

          {dietsArray.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Diets</p>
              <div className={styles.dietList}>
                {dietsArray.map((diet, i) => (
                  <span key={i} className={styles.dietTag}>{diet}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default Detail;
