import mongoose, {Schema} from 'mongoose'

const reviewSubSchema = mongoose.Schema({
    _id: Schema.Types.ObjectId,
    rating: Number,
    review: String,
    userID: Schema.Types.ObjectId,
    userUsername: String,
    userAvatar: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creatorId: String,
    creator: String,
    tags: [String],
    instructions: String,
    foodType: String,
    cuisine: String,
    ingredients: [String],
    dietaryPrefs: [String],
    directions: [String],
    timeCost: String,
    selectedFile: String,
    video: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    reports: [String],
    reviews: [reviewSubSchema],
    avgRating: {
        type: Number,
        default: 0
    },
    mentions: [String]
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;