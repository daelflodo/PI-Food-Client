
const validation = (form) => {
  const errors = {};

  if (!form.name)    errors.name    = 'Recipe name is required';
  if (!form.summary) errors.summary = 'Summary is required';
  if (!form.steps)   errors.steps   = 'Steps are required';
  if (!form.image)   errors.image   = 'Image URL is required';

  if (!form.healthScore) {
    errors.healthScore = 'Health score is required';
  } else if (/[^0-9]/.test(form.healthScore)) {
    errors.healthScore      = 'Only numbers allowed';
    errors.healthScoreModify = 'Only numbers allowed';
  } else if (Number(form.healthScore) < 0 || Number(form.healthScore) > 100) {
    errors.healthScore      = 'Must be between 0 and 100';
    errors.healthScoreModify = 'Must be between 0 and 100';
  }

  if (!form.diets?.length) errors.diets = 'Select at least one diet';

  return errors;
};

export default validation;
