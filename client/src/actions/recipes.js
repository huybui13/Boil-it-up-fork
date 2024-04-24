import * as api from '../api';

export const getRecipe = (id) => async (dispatch) => {
    try {
        const { data } = await api.fetchRecipe();
        
        dispatch({ type: 'FETCH_RECIPE', payload: data });
    } catch (error) {
        console.log(error.message);
    }    
}

export const getRecipes = () => async (dispatch) => {
    try {
        const { data } = await api.fetchRecipes();
        
        dispatch({ type: 'FETCH_ALL', payload: data });
    } catch (error) {
        console.log(error.message);
    }    
}

export const createRecipe = (post) => async (dispatch) => {
    try {
        const { data } = await api.createRecipe(post);
        dispatch({ type: 'CREATE', payload: data});
    } catch (error) {
        console.log(error);
    }
}

export const updateRecipe = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatedRecipe(id, post);

        dispatch({ type: 'UPDATE', payload: data });
    } catch (error) {
        console.log(error);
    }
}