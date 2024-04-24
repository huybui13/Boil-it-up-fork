import express from 'express';


import {
	signin, signup, editprofile, deleteprofile, getUser, followUser, unfollowUser, addDietaryPref, changeCollection,

	createCollection, getCollection, deleteCollection, blockUser, unblockUser
, clearDietaryPref, getAllUsers

} from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/editprofile', editprofile)
router.post('/deleteprofile', deleteprofile);
router.post('/follow/:followerId/:followingId', followUser);
router.post('/unfollow/:unfollowerId/:unfollowingId', unfollowUser);
router.post('/block/:id/:blockID', blockUser);
router.post('/unblock/:id/:blockedID', unblockUser);
router.get('/:id', getUser);
router.get('/', getAllUsers);
router.post('/addDietaryPref', addDietaryPref);
router.post('/clearDietaryPref', clearDietaryPref);
router.post('/collection', changeCollection);
router.post('/createcollection', createCollection);
router.get('/:userID/collection/:collectionID', getCollection);
router.get('/:userID/collection/:collectionID/delete', deleteCollection);

export default router;