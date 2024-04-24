import express from 'express';

import {
  getPostsBySearch,
  getPost,
  getPosts,
  getPostsByCreatorId,
  createPost,
  updatePost,
  deletePost,
  getCollectionPosts,
  addReport,
  createReview,
} from '../controllers/posts.js';

const router = express.Router();

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/newPost', getPosts);
router.get('/:id', getPost);
router.get('/creator/:id', getPostsByCreatorId);
router.get('/newPost/:id', getPost);
router.get('/:userID/collection/:collectionID', getCollectionPosts)

router.post('/', createPost);
router.post('/newPost', createPost);
router.post('/review/:postID', createReview);

router.patch('/:id', updatePost);
router.post('/:id/report', addReport);
router.patch('/newPost/:id', updatePost);

router.delete('/:id', deletePost);


export default router;
