export default (state = { isLoading: true, recipes: [] }, action) => {
    switch (action.type) {
        case 'UPDATE':
            return state.recipes.map((recipe) => recipe._id === action.payload._id ? action.payload : recipe);
        case 'FETCH_ALL':
            return action.payload;
        case 'FETCH_RECIPE':
            return {...state, recipe: action.payload}
        case 'CREATE':
            return [...state.recipes, action.payload];
        default:
            return state;
    }
}