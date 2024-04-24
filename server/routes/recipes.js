import express from 'express';

import {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
  } from '../controllers/recipes.js';

const router = express.Router();

router.get('/', getRecipes);
router.get('/', getRecipe)
router.post('/', createRecipe);
router.patch('/:id', updateRecipe);

export default router;
