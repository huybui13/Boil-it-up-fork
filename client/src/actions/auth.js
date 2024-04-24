import {AUTH, LOGOUT, FETCH_USER, FETCH_COLLECTION, FETCH_ALL_USERS} from '../constants/actionTypes';
import * as api from '../api';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
    } catch (error) {
        // console.log(error);
        // console.log(error.response.data.message);
        alert(error.response.data.message);
    }
}

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: AUTH, data });

        navigate('/');
    } catch (error) {
        // console.log(error);
        alert(error.response.data.message);
    }
}

export const editprofile = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.editProfile(formData);

        dispatch({ type: AUTH, data });

        navigate(`/profile/${formData.id}`);
    } catch (error) {
        console.log(error);
    }
}

export const deleteprofile = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.deleteProfile(formData);

        dispatch({ type: LOGOUT, data });

        navigate('/posts');
    } catch (error) {
        console.log(error);
    }
}

export const getUser = (id) => async (dispatch) => {
    try {
        const { data } = await api.fetchUser(id);
        dispatch({ type: FETCH_USER, payload: data });
    } catch (error) {
        console.log(error.message);
    }
};

export const getAllUsers = () => async (dispatch) => {
    try {
        const { data } = await api.getAllUsers();
        dispatch({ type: FETCH_ALL_USERS, payload: data});
    } catch (error) {
        console.log(error.message);
    }
}
export const clearDietaryPref = (id, navigate) => async (dispatch) => {
    try {
        console.log(id);
        const { data } = await api.clearDietaryPref(id);
        dispatch({type: AUTH, data});
        navigate(`/profile/${id}`);
    } catch (error) {
        console.log(error.message);
    }

}
export const addDietaryPref = (navigate, formData) => async (dispatch) => {
    try {
        const {data} = await api.addDietaryPref(formData);

        dispatch({ type: AUTH, data});
        navigate(`/profile/${formData[formData.length-1]}`);
    } catch (e) {
        console.log(e.message);
    }

}

export const followUser = (followerId, followingId, navigate) => async (dispatch) => {
    try {
        const { data } = await api.followUser(followerId, followingId);

        dispatch({ type: AUTH, data });

        navigate(`/profile/${followingId}`);
    } catch (error) {
        console.log(error.message);
    }
}

export const unfollowUser = (unfollowerId, unfollowingId, navigate) => async (dispatch) => {
    try {
        const { data } = await api.unfollowUser(unfollowerId, unfollowingId);

        dispatch({ type: AUTH, data });

        navigate(`/profile/${unfollowingId}`);
    } catch (error) {
        console.log(error.message);
    }
}

export const changeCollection = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.changeCollection(formData);

        dispatch({ type: AUTH, data });

        navigate(`/posts/${formData[1]}`);
    } catch (error) {
        console.log(error.message);
    }
}

export const createCollection = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.createCollection(formData);

        dispatch({ type: AUTH, data });

        navigate(`/posts/${formData[1]}`);
    } catch (error) {
        console.log(error.message);
    }
}

export const getCollection = (userID, collectionID) => async (dispatch) => {
    try {
        const { data } = await api.fetchCollection(userID, collectionID);

        dispatch({ type: FETCH_COLLECTION, payload: data });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteCollection = (userID, collectionID, navigate) => async (dispatch) => {
    try {
        const { data } = await api.deleteCollection(userID, collectionID);

        dispatch({ type: AUTH, data });

        navigate(`/profile/${userID}`);
    } catch (error) {
        console.log(error.message);
    }
}

export const blockUser = (userID, blockID, navigate) => async (dispatch) => {
    try {
        const { data } = await api.blockUser(userID, blockID);

        dispatch({ type: AUTH, data });

        navigate('/');
    } catch (error) {
        console.log(error.message);
    }
}

export const unblockUser = (userID, blockedID, navigate) => async (dispatch) => {
    try {
        const { data } = await api.unblockUser(userID, blockedID);

        dispatch({ type: AUTH, data });

        navigate(`/profile/${blockedID}`);
    } catch (error) {
        console.log(error.message);
    }
}