import {
  CREATE,
  UPDATE,
  DELETE,
  FETCH_ALL,
  FETCH_BY_SEARCH,
  FETCH_POST,
  END_LOADING,
  START_LOADING,
  FETCH_BY_CREATOR_ID,
  FETCH_COLLECTION_POSTS,
} from '../constants/actionTypes';
import * as api from '../api';

// Action Creators

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    // Get response (data object) from api
    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    // Get response (data object) from api
    const { data } = await api.fetchPosts(page);

    dispatch({ type: FETCH_ALL, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    // Get response (data object) from api
    const {
      data: { data },
    } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
  }
};

export const getPostsByCreatorId = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPostsByCreatorId(id);

    dispatch({ type: FETCH_BY_CREATOR_ID, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatedPost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const getCollectionPosts =
  (userID, collectionID) => async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });

      const { data } = await api.fetchCollectionPosts(userID, collectionID);

      dispatch({ type: FETCH_COLLECTION_POSTS, payload: data });

      dispatch({ type: END_LOADING });
    } catch (error) {
      console.log(error.message);
    }
  };

export const addReport = (repString, id) => async (dispatch) => {
  try {
    const { data } = await api.addReport(repString, id);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createReview =
  (postID, formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.createReview(postID, formData);

      dispatch({ type: FETCH_POST, payload: data });

      navigate(`/posts/${postID}`);
    } catch (error) {
      console.log(error.message);
    }
  };
