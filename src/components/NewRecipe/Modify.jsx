import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiet } from '../../redux/actions/actions';
import axios from 'axios';
import style from './NewRecipe.module.css';

const INITIAL_FORM = {
  id: '', name: '', summary: '', healthScore: '', steps: '', diets: [], image: '',
};

const Modify = () => {
  const dispatch  = useDispatch();
  const listDiets = useSelector((state) => state.diets);
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllDiet());
  }, [dispatch]);

  const handleChange = ({ target: { name, value } }) => {
    const updated =
      name === 'diets'
        ? { ...form, diets: [...form.diets, value] }
        : { ...form, [name]: value };
    setForm(updated);
    if (name === 'healthScore') {
      const invalid = /[^0-9]/.test(value) || Number(value) < 0 || Number(value) > 100;
      setErrors((prev) =>
        invalid
          ? { ...prev, healthScore: 'Enter a number between 0 and 100' }
          : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== 'healthScore'))
      );
    }
  };

  const removeDiet = (diet) =>
    setForm((prev) => ({ ...prev, diets: prev.diets.filter((d) => d !== diet) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id || errors.healthScore) {
      alert('Please provide a valid recipe ID and health score.');
      return;
    }
    axios
      .put(`${import.meta.env.VITE_API_URL}/recipes/`, form)
      .then((res) => alert(res.data))
      .catch((err) => alert(err.response?.data));
  };

  return (
    <div className={style.page}>
      <div className={style.card}>
        <h1 className={style.title}>Modify Recipe</h1>
        <p className={style.subtitle}>Update an existing recipe by its ID</p>

        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.field}>
            <label className={style.label}>Recipe ID *</label>
            <input className={style.input} name="id" type="text" value={form.id} onChange={handleChange} placeholder="Enter the recipe UUID" />
            {errors.id && <span className={style.error}>⚠ {errors.id}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Name</label>
            <input className={style.input} name="name" type="text" value={form.name} onChange={handleChange} placeholder="New recipe name (optional)" />
          </div>

          <div className={style.field}>
            <label className={style.label}>Summary</label>
            <input className={style.input} name="summary" type="text" value={form.summary} onChange={handleChange} placeholder="Updated description (optional)" />
          </div>

          <div className={style.field}>
            <label className={style.label}>Health Score (0–100)</label>
            <input className={style.input} name="healthScore" type="number" min="0" max="100" value={form.healthScore} onChange={handleChange} placeholder="e.g. 80" />
            {errors.healthScore && <span className={style.error}>⚠ {errors.healthScore}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Steps</label>
            <input className={style.input} name="steps" type="text" value={form.steps} onChange={handleChange} placeholder="Updated steps (optional)" />
          </div>

          <div className={style.field}>
            <label className={style.label}>Image URL</label>
            <input className={style.input} name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://…" />
          </div>

          <div className={style.field}>
            <label className={style.label}>Diets</label>
            <select className={style.select} name="diets" onChange={handleChange} value="">
              <option value="" disabled>Add a diet type</option>
              {listDiets?.map((diet, i) => (
                <option key={i} value={diet.name}>{diet.name}</option>
              ))}
            </select>
            <div className={style.dietTags}>
              {form.diets.map((diet, i) => (
                <span key={i} className={style.dietTag}>
                  {diet}
                  <button type="button" className={style.dietTagRemove} onClick={() => removeDiet(diet)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className={style.submitBtn}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Modify;
