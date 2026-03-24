import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiet, getAllRecipes, postRecipes } from '../../redux/actions/actions';
import validation from '../Validation/Validation';
import { toast } from '../../utils/toast';
import style from './NewRecipe.module.css';

const INITIAL_FORM = {
  name: '', summary: '', healthScore: '', steps: '', diets: [], image: '',
};

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const scoreLabel = (v) => {
  const n = Number(v);
  if (n >= 75) return { text: '🌿 Healthy',  cls: style.scoreGood };
  if (n >= 40) return { text: '😐 Moderate', cls: style.scoreOk  };
  return            { text: '⚠ Low',        cls: style.scoreBad  };
};

const NewRecipe = () => {
  const dispatch  = useDispatch();
  const listDiets = useSelector((state) => state.diets);
  const [form, setForm]           = useState(INITIAL_FORM);
  const [errors, setErrors]       = useState({});
  const [uploading, setUploading] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    dispatch(getAllDiet());
    dispatch(getAllRecipes());
  }, [dispatch]);

  // Create the widget once on mount — calling .open() later avoids the
  // "Cannot read properties of null (reading 'on')" error that openUploadWidget
  // triggers when it recreates the widget DOM on every invocation.
  useEffect(() => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName:    CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources:      ['local', 'url', 'camera'],
        multiple:     false,
        folder:       'pi-food',
        styles: {
          palette: {
            window:          '#111114',
            windowBorder:    '#ff6b2b',
            tabIcon:         '#ff6b2b',
            menuIcons:       '#e2e2ea',
            textDark:        '#000000',
            textLight:       '#e2e2ea',
            link:            '#ff6b2b',
            action:          '#ff6b2b',
            inactiveTabIcon: '#555568',
            error:           '#ef4444',
            inProgress:      '#ff6b2b',
            complete:        '#22c55e',
            sourceBg:        '#0a0a0b',
          },
        },
      },
      (error, result) => {
        if (result.event === 'close') { setUploading(false); return; }
        if (!error && result.event === 'success') {
          setUploading(false);
          const url = result.info.secure_url;
          setForm((prev) => {
            const updated = { ...prev, image: url };
            setErrors(validation(updated));
            return updated;
          });
        }
      },
    );

    widgetRef.current = widget;
    return () => { widget.destroy(); widgetRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const openCloudinaryWidget = () => {
    if (!widgetRef.current) return;
    setUploading(true);
    widgetRef.current.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validation(form);
    if (Object.keys(errs).length !== 0) {
      setErrors(errs);
      toast.error('Please fill all required fields correctly.');
      return;
    }
    try {
      await dispatch(postRecipes(form));
      setForm(INITIAL_FORM);
      toast.success('Recipe created successfully!');
    } catch {
      // error already shown by postRecipes action
    }
  };

  const chip = form.healthScore ? scoreLabel(form.healthScore) : null;

  return (
    <div className={style.page}>
      <div className={style.card}>

        <div className={style.cardHeader}>
          <div>
            <h1 className={style.title}>New Recipe</h1>
            <p className={style.subtitle}>Share your culinary creation with the world</p>
          </div>
          <span className={style.stepBadge}>✦ Create</span>
        </div>

        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.grid}>

            {/* ── Left column ── */}
            <div className={style.col}>

              <div className={style.field}>
                <label className={style.label}>Recipe Name <span className={style.req}>*</span></label>
                <input
                  className={`${style.input} ${errors.name ? style.inputError : ''}`}
                  name="name" type="text" value={form.name}
                  onChange={handleChange} placeholder="e.g. Carbonara Pasta"
                />
                {errors.name && <span className={style.error}>⚠ {errors.name}</span>}
              </div>

              <div className={style.field}>
                <label className={style.label}>Summary <span className={style.req}>*</span></label>
                <textarea
                  className={`${style.textarea} ${errors.summary ? style.inputError : ''}`}
                  name="summary" rows={3} value={form.summary}
                  onChange={handleChange} placeholder="Brief description of this recipe…"
                />
                {errors.summary && <span className={style.error}>⚠ {errors.summary}</span>}
              </div>

              <div className={style.field}>
                <label className={style.label}>Preparation Steps <span className={style.req}>*</span></label>
                <textarea
                  className={`${style.textarea} ${errors.steps ? style.inputError : ''}`}
                  name="steps" rows={6} value={form.steps}
                  onChange={handleChange}
                  placeholder={'1. Boil salted water…\n2. Cook pasta al dente…\n3. Mix eggs and cheese…'}
                />
                {errors.steps && <span className={style.error}>⚠ {errors.steps}</span>}
              </div>

            </div>

            {/* ── Right column ── */}
            <div className={style.col}>

              <div className={style.field}>
                <label className={style.label}>Recipe Image <span className={style.req}>*</span></label>
                <div
                  className={`${style.uploadArea} ${errors.image ? style.uploadAreaError : ''}`}
                  onClick={openCloudinaryWidget}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openCloudinaryWidget()}
                >
                  {form.image ? (
                    <img src={form.image} alt="Recipe preview" className={style.imagePreview} />
                  ) : (
                    <div className={style.uploadPlaceholder}>
                      <svg className={style.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={style.uploadText}>
                        {uploading ? 'Opening widget…' : 'Click to upload image'}
                      </span>
                      <span className={style.uploadHint}>PNG · JPG · WEBP · Max 10 MB</span>
                    </div>
                  )}
                </div>
                {form.image && (
                  <button type="button" className={style.changeImgBtn} onClick={openCloudinaryWidget}>
                    ↺ Change image
                  </button>
                )}
                {errors.image && <span className={style.error}>⚠ {errors.image}</span>}
              </div>

              <div className={style.field}>
                <label className={style.label}>Health Score (0–100) <span className={style.req}>*</span></label>
                <div className={style.scoreRow}>
                  <input
                    className={`${style.input} ${errors.healthScore ? style.inputError : ''}`}
                    name="healthScore" type="number" min="0" max="100"
                    value={form.healthScore} onChange={handleChange} placeholder="75"
                  />
                  {chip && <span className={`${style.scoreChip} ${chip.cls}`}>{chip.text}</span>}
                </div>
                {errors.healthScore && <span className={style.error}>⚠ {errors.healthScore}</span>}
              </div>

              <div className={style.field}>
                <label className={style.label}>Diet Types <span className={style.req}>*</span></label>
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

            </div>
          </div>

          <button type="submit" className={style.submitBtn}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Publish Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRecipe;