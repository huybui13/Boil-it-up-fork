import mongoose from 'mongoose'

const recipeSchema = mongoose.Schema({
    food: String,
    creator: String,
    ingredients: [String],
    instructions: [String],
    selectedFile: String,
    timeCost: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    dietaryPref: [String],
});

const PostRecipe = mongoose.model('PostRecipe', recipeSchema);

export default PostRecipe;