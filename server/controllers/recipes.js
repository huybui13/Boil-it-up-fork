import mongoose from "mongoose";
import PostRecipe from "../models/postRecipe.js";


export const getRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await PostRecipe.findById(id);

        res.status(200).json(recipe);
    } catch (error){
        res.stats(404).json({message: error.message});
    }
}

export const getRecipes = async (req, res) => {
    try {
        const PostRecipe = await PostRecipe.find();

        res.status(200).json(PostRecipes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createRecipe = async (req, res) => {
    const recipe = req.body;

    const newRecipe = new PostRecipe({ ...recipe, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newRecipe.save();

        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(409).json({ message: error.message});
    }
}

export const updateRecipe = async (req, res) => {
    const { id: _id } = req.params;
    const recipe = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No recipe with that id');

    const updatedRecipe = await PostRecipe.findByIdAndUpdate(_id, { ...recipe, _id}, { new: true });

    res.json(updatedRecipe);
}
