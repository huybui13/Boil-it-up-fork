import { AUTH, LOGOUT, FETCH_USER, FETCH_COLLECTION, FETCH_ALL_USERS } from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => {
    console.log('IN REDUCER');
    switch (action.type) {
        case AUTH:
            // console.log(action?.data);
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data };
        case LOGOUT:
            localStorage.clear();

            return { ...state, authData: null };
        case FETCH_USER:
            return {
                ...state,
                user: action.payload,
                collections: action.payload.collections,
            }
        case FETCH_ALL_USERS:
            return {
                ...state,
                users: action.payload
            }
        case FETCH_COLLECTION:
            return {
                ...state,
                collection: action.payload.result,
            }
        default:
            return state;
    }
};

export default authReducer;