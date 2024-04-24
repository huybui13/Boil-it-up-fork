import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem('profile')).token
    }`;
  }
  return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatedPost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const addReport = (repString, id) =>
  API.post(`/posts/${id}/report`, repString);

export const deletePost = (id) => API.delete(`/posts/${id}`);
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${
      searchQuery.tags
    }`
  );
export const fetchPostsByCreatorId = (id) => API.get(`/posts/creator/${id}`);
export const fetchCollectionPosts = (userID, collectionID) =>
  API.get(`/posts/${userID}/collection/${collectionID}`);
export const createReview = (postID, formData) =>
  API.post(`/posts/review/${postID}`, formData);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const editProfile = (formData) =>
  API.post('/user/editprofile', formData);
export const deleteProfile = (formData) =>
  API.post('/user/deleteprofile', formData);
export const fetchUser = (id) => API.get(`/user/${id}`);
export const getAllUsers = () => API.get('/user/');
export const followUser = (followerId, followingId) =>
  API.post(`/user/follow/${followerId}/${followingId}`);
export const unfollowUser = (unfollowerId, unfollowingId) =>
  API.post(`/user/unfollow/${unfollowerId}/${unfollowingId}`);
export const blockUser = (id, blockID) =>
  API.post(`/user/block/${id}/${blockID}`);
export const unblockUser = (id, blockedID) =>
  API.post(`/user/unblock/${id}/${blockedID}`);
export const addDietaryPref = (formData) =>
  API.post('/user/addDietaryPref', formData);
export const clearDietaryPref = (id) => API.post('/user/clearDietaryPref', id);
export const changeCollection = (formData) =>
  API.post('/user/collection', formData);
export const createCollection = (formData) =>
  API.post('/user/createcollection', formData);
export const fetchCollection = (userID, collectionID) =>
  API.get(`/user/${userID}/collection/${collectionID}`);
export const deleteCollection = (userID, collectionID) =>
  API.get(`/user/${userID}/collection/${collectionID}/delete`);

export const fetchRecipe = (id) => API.get(`/recipes/${id}`);
export const fetchRecipes = (page) => API.get(`/recipes?page=${page}`);
export const createRecipe = (newPost) => API.post('/recipes', newPost);
export const updatedRecipe = (id, updatedRecipe) =>
  API.patch(`/recipes/${id}`, updatedRecipe);
