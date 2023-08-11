import{ GET_ALL_RECIPES,GET_ALL_DIET ,GET_RECIPE_DETAIL,GET_RECIPE_NAME,POST_RECIPES, ORDER_RECIPES_SCORE,ORDER_NAME,FILTER_DIET,FILTER_CREATED,DELETE } from '../actions/actions-types'

const initialState = {
    recipes: [],
    copyRecipes: [],
    recipeDiet:[],
    diets: [],
    detais: [],
}
const rootReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_ALL_RECIPES:
            return {
                ...state,
                recipes: payload,
                copyRecipes:payload,
            }
            case GET_RECIPE_DETAIL:
            return {
                ...state,
                details: payload,
            }
            case GET_ALL_DIET:
            return {
                ...state,
                diets: payload,
            }
            case GET_RECIPE_NAME:
                return {
                  ...state,
                  recipes: payload,
                };
            case POST_RECIPES:
                return{
                    ...state,
                    recipes:[...state.recipes, payload]
                }
            case DELETE:
                return{
                    ...state,
                    recipes: state.recipes.filter(rec=> rec.id !== payload)
                }
            case ORDER_RECIPES_SCORE:
                 const sortRecipeScore=[...state.recipes]
                return {
                ...state,
                recipes:
                payload === 'Ascendente'
                    ? sortRecipeScore.sort((a, b) => a.healthScore - b.healthScore)
                    : sortRecipeScore.sort((a, b) => b.healthScore - a.healthScore),//si no descendente
                }
            case ORDER_NAME:
                //Esto se hace para evitar modificar directamente el estado original y seguir las buenas prácticas de inmutabilidad.
                const sortRecipeAlphabet=[...state.recipes]
                return {
                    ...state,//Esto copia todas las propiedades existentes en el objeto de estado original.
                    //se copian antes de realizar la ordenación para evitar modificar el estado original directamente.
                    recipes: payload === 'A-Z'
                    ? sortRecipeAlphabet.sort((a, b) => a.name.localeCompare(b.name))
                    : sortRecipeAlphabet.sort((a, b) => b.name.localeCompare(a.name)),

                }

            case FILTER_DIET:
                const allRecDiet = state.copyRecipes
                const typeDietFilter = allRecDiet.filter((recipes) => {
                    return recipes.diets && recipes.diets.includes(payload);
                });
                return{
                    ...state,
                    recipes: payload === 'allDiets'? allRecDiet : typeDietFilter,
                    recipeDiet: payload === 'allDiets'? allRecDiet : typeDietFilter
                }

            case FILTER_CREATED:
                    const allRecipes= state.copyRecipes
                    const filterCreated =  payload === 'db'
                        ?allRecipes.filter(recip => recip.created)
                        :allRecipes.filter(recip => !recip.created)
                    return{
                        ...state,
                    recipes: payload === 'allRecipe' ? state.copyRecipes : filterCreated
                    }
        default:
            return { ...state }
    }
}
export default rootReducer
