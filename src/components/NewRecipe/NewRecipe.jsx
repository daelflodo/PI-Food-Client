import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiet, getAllRecipes, postRecipes } from '../../redux/actions/actions';
import validation from '../Validation/Validation';
import style from './NewRecipe.module.css';

const INITIAL_FORM = {
  name: '', summary: '', healthScore: '', steps: '', diets: [], image: '',
};

const NewRecipe = () => {
  const dispatch  = useDispatch();
  const listDiets = useSelector((state) => state.diets);
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllDiet());
    dispatch(getAllRecipes());
  }, [dispatch]);

  const handleChange = ({ target: { name, value } }) => {
    const updated =
      name === 'diets'
        ? { ...form, diets: [...form.diets, value] }
        : { ...form, [name]: value };
    setForm(updated);
    setErrors(validation(updated));
  };

  const removeDiet = (diet) =>
    setForm((prev) => ({ ...prev, diets: prev.diets.filter((d) => d !== diet) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name === '' || Object.keys(errors).length !== 0) {
      alert('Please fill all required fields correctly.');
      return;
    }
    dispatch(postRecipes(form));
    setForm(INITIAL_FORM);
    alert('Recipe created successfully!');
  };

  return (
    <div className={style.page}>
      <div className={style.card}>
        <h1 className={style.title}>New Recipe</h1>
        <p className={style.subtitle}>Share your culinary creation with the world</p>

        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.field}>
            <label className={style.label}>Recipe Name *</label>
            <input className={style.input} name="name" type="text" value={form.name} onChange={handleChange} placeholder="e.g. Carbonara Pasta" />
            {errors.name && <span className={style.error}>⚠ {errors.name}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Summary *</label>
            <input className={style.input} name="summary" type="text" value={form.summary} onChange={handleChange} placeholder="Brief description of this recipe" />
            {errors.summary && <span className={style.error}>⚠ {errors.summary}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Health Score (0–100) *</label>
            <input className={style.input} name="healthScore" type="number" min="0" max="100" value={form.healthScore} onChange={handleChange} placeholder="e.g. 75" />
            {errors.healthScore && <span className={style.error}>⚠ {errors.healthScore}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Steps *</label>
            <input className={style.input} name="steps" type="text" value={form.steps} onChange={handleChange} placeholder="Preparation steps…" />
            {errors.steps && <span className={style.error}>⚠ {errors.steps}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Image URL *</label>
            <input className={style.input} name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://…" />
            {errors.image && <span className={style.error}>⚠ {errors.image}</span>}
          </div>

          <div className={style.field}>
            <label className={style.label}>Diets *</label>
            <select className={style.select} name="diets" onChange={handleChange} value="">
              <option value="" disabled>Select a diet type</option>
              {listDiets?.map((diet, i) => (
                <option key={i} value={diet.name}>{diet.name}</option>
              ))}
            </select>
            {errors.diets && <span className={style.error}>⚠ {errors.diets}</span>}
            <div className={style.dietTags}>
              {form.diets.map((diet, i) => (
                <span key={i} className={style.dietTag}>
                  {diet}
                  <button type="button" className={style.dietTagRemove} onClick={() => removeDiet(diet)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className={style.submitBtn}>Create Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default NewRecipe;