import { combineReducers } from 'redux';

import posts from './posts';
import recipes from './recipes'
import auth from './auth';

export default combineReducers({ posts, auth, recipes});
