import {
  GET_ALL_RECIPES, GET_ALL_DIET, GET_RECIPE_DETAIL, GET_RECIPE_NAME,
  POST_RECIPES, ORDER_RECIPES_SCORE, ORDER_NAME, FILTER_DIET, FILTER_CREATED, DELETE,
} from '../actions/actions-types';

const initialState = {
  recipes:     [],
  copyRecipes: [],
  recipeDiet:  [],
  diets:       [],
  details:     null,
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_RECIPES:
      return { ...state, recipes: payload, copyRecipes: payload };

    case GET_RECIPE_DETAIL:
      return { ...state, details: payload };

    case GET_ALL_DIET:
      return { ...state, diets: payload };

    case GET_RECIPE_NAME:
      return { ...state, recipes: payload };

    case POST_RECIPES:
      return { ...state, recipes: [...state.recipes, payload] };

    case DELETE:
      return { ...state, recipes: state.recipes.filter((r) => r.id !== payload) };

    case ORDER_RECIPES_SCORE: {
      const sorted = [...state.recipes].sort((a, b) =>
        payload === 'Ascendente' ? a.healthScore - b.healthScore : b.healthScore - a.healthScore
      );
      return { ...state, recipes: sorted };
    }

    case ORDER_NAME: {
      const sorted = [...state.recipes].sort((a, b) =>
        payload === 'A-Z' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
      return { ...state, recipes: sorted };
    }

    case FILTER_DIET: {
      const filtered =
        payload === 'allDiets'
          ? state.copyRecipes
          : state.copyRecipes.filter((r) => r.diets?.includes(payload));
      return { ...state, recipes: filtered, recipeDiet: filtered };
    }

    case FILTER_CREATED: {
      if (payload === 'allRecipes') return { ...state, recipes: state.copyRecipes };
      const filtered =
        payload === 'db'
          ? state.copyRecipes.filter((r) => r.created)
          : state.copyRecipes.filter((r) => !r.created);
      return { ...state, recipes: filtered };
    }

    default:
      return state;
  }
};

export default rootReducer;
