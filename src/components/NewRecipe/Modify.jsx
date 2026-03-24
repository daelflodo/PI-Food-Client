import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAllDiet, getAllRecipes } from '../../redux/actions/actions';
import { toast } from '../../utils/toast';
import style from './NewRecipe.module.css';

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const scoreLabel = (v) => {
  const n = Number(v);
  if (n >= 75) return { text: '🌿 Healthy',  cls: style.scoreGood };
  if (n >= 40) return { text: '😐 Moderate', cls: style.scoreOk  };
  return            { text: '⚠ Low',        cls: style.scoreBad  };
};

/**
 * Modify — modal portal, opened from the recipe card.
 * @param {{ recipe: object, onClose: () => void }} props
 */
const Modify = ({ recipe, onClose }) => {
  const dispatch  = useDispatch();
  const listDiets = useSelector((state) => state.diets);

  const [form, setForm] = useState({
    id:          recipe.id          ?? '',
    name:        recipe.name        ?? '',
    summary:     recipe.summary     ?? '',
    healthScore: recipe.healthScore ?? '',
    steps:       Array.isArray(recipe.steps)
      ? recipe.steps.join('\n')
      : (recipe.steps ?? ''),
    diets:       recipe.diets  ?? [],
    image:       recipe.image  ?? '',
  });
  const [errors, setErrors]       = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]     = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => { dispatch(getAllDiet()); }, [dispatch]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Create Cloudinary widget once on mount
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
            window: '#111114', windowBorder: '#ff6b2b', tabIcon: '#ff6b2b',
            menuIcons: '#e2e2ea', textDark: '#000000', textLight: '#e2e2ea',
            link: '#ff6b2b', action: '#ff6b2b', inactiveTabIcon: '#555568',
            error: '#ef4444', inProgress: '#ff6b2b', complete: '#22c55e', sourceBg: '#0a0a0b',
          },
        },
      },
      (error, result) => {
        if (result.event === 'close') { setUploading(false); return; }
        if (!error && result.event === 'success') {
          setUploading(false);
          const url = result.info.secure_url;
          setForm((prev) => ({ ...prev, image: url }));
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
    if (name === 'healthScore') {
      const invalid = /[^0-9]/.test(value) || Number(value) < 0 || Number(value) > 100;
      setErrors((prev) =>
        invalid
          ? { ...prev, healthScore: 'Enter a number between 0 and 100' }
          : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== 'healthScore')),
      );
    }
  };

  const removeDiet = (diet) =>
    setForm((prev) => ({ ...prev, diets: prev.diets.filter((d) => d !== diet) }));

  const openWidget = () => {
    if (!widgetRef.current) return;
    setUploading(true);
    widgetRef.current.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.healthScore) {
      toast.error('Please fix validation errors before saving.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/recipes/`, form);
      toast.success(data.message ?? 'Recipe updated successfully!');
      dispatch(getAllRecipes());
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error ?? err.response?.data?.message ?? 'Error updating recipe';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const chip = form.healthScore !== '' ? scoreLabel(form.healthScore) : null;

  return createPortal(
    <div
      className={style.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={style.modal}>

        <div className={style.cardHeader}>
          <div>
            <h1 className={style.title}>Edit Recipe</h1>
            <p className={style.subtitle}>
              Updating <strong style={{ color: 'var(--color-primary-light)' }}>{recipe.name}</strong>
            </p>
          </div>
          <button type="button" className={style.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.grid}>

            {/* ── Left column ── */}
            <div className={style.col}>
              <div className={style.field}>
                <label className={style.label}>Recipe Name</label>
                <input
                  className={style.input} name="name" type="text"
                  value={form.name} onChange={handleChange} placeholder="Recipe name"
                />
              </div>

              <div className={style.field}>
                <label className={style.label}>Summary</label>
                <textarea
                  className={style.textarea} name="summary" rows={3}
                  value={form.summary} onChange={handleChange} placeholder="Recipe description…"
                />
              </div>

              <div className={style.field}>
                <label className={style.label}>Preparation Steps</label>
                <textarea
                  className={style.textarea} name="steps" rows={6}
                  value={form.steps} onChange={handleChange}
                  placeholder={'1. Boil water…\n2. Cook pasta…\n3. Plate and serve…'}
                />
              </div>
            </div>

            {/* ── Right column ── */}
            <div className={style.col}>

              <div className={style.field}>
                <label className={style.label}>Recipe Image</label>
                <div
                  className={style.uploadArea}
                  onClick={openWidget} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openWidget()}
                >
                  {form.image ? (
                    <img src={form.image} alt="Preview" className={style.imagePreview} />
                  ) : (
                    <div className={style.uploadPlaceholder}>
                      <svg className={style.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={style.uploadText}>
                        {uploading ? 'Opening widget…' : 'Click to change image'}
                      </span>
                      <span className={style.uploadHint}>PNG · JPG · WEBP · Max 10 MB</span>
                    </div>
                  )}
                </div>
                {form.image && (
                  <button type="button" className={style.changeImgBtn} onClick={openWidget}>↺ Change image</button>
                )}
              </div>

              <div className={style.field}>
                <label className={style.label}>Health Score (0–100)</label>
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
                <label className={style.label}>Diet Types</label>
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

            </div>
          </div>

          <button type="submit" className={style.submitBtn} disabled={loading}>
            {loading ? (
              'Saving…'
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </form>

      </div>
    </div>,
    document.body,
  );
};

export default Modify;

