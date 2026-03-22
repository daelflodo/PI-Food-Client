import axios from 'axios';
import {
  GET_ALL_RECIPES, GET_ALL_DIET, GET_RECIPE_DETAIL,
  ORDER_RECIPES_SCORE, GET_RECIPE_NAME, ORDER_NAME,
  POST_RECIPES, FILTER_DIET, FILTER_CREATED,
} from './actions-types';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllRecipes = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/recipes`);
    dispatch({ type: GET_ALL_RECIPES, payload: data });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
  }
};

export const getRecipeDetail = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/recipes/${id}`);
    dispatch({ type: GET_RECIPE_DETAIL, payload: data });
  } catch {
    alert('Recipe not found');
  }
};

export const getAllDiet = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/diet`);
    dispatch({ type: GET_ALL_DIET, payload: data });
  } catch (error) {
    console.error('Error fetching diets:', error.message);
  }
};

export const postRecipes = (payload) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/recipes/`, payload);
    dispatch({ type: POST_RECIPES, payload });
  } catch (error) {
    alert(error.response?.data ?? 'Error creating recipe');
  }
};

export const searchRecipesByName = (name) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/recipes/?name=${name}`);
    dispatch({ type: GET_RECIPE_NAME, payload: data });
  } catch (error) {
    alert(error.response?.data ?? 'Recipe not found');
  }
};

export const orderRecipesScore = (value) => ({ type: ORDER_RECIPES_SCORE, payload: value });
export const OrderName        = (value) => ({ type: ORDER_NAME,           payload: value });
export const filterRecipesDiet = (value) => ({ type: FILTER_DIET,         payload: value });
export const filterCreated     = (value) => ({ type: FILTER_CREATED,      payload: value });



