import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import User from '../models/user.js';

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the start index of every page
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const searchVar = new RegExp(searchQuery, 'i');
    const posts = await PostMessage.find({
      $or: [
        { title: searchVar },
        { message: searchVar },
        { creator: searchVar },
        { creatorId: searchVar },
        { createdAt: Date(searchVar) },
        { cuisine: searchVar },
        { foodType: searchVar },
        { tags: { $in: tags.split(',') } }, // tags: {cookies,rest,}
        { dietaryPrefs: { $in: searchVar } },
        { ingredients: { $in: searchVar } },
      ],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsByCreatorId = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await PostMessage.find({ creatorId: id });

    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

async function editFollower(creator, follower, postTitle) {
  follower = await User.findById(follower[0]);
  follower.notifications.push(
    creator + ' created a new post! Check it out! Title: ' + postTitle
  );
  await follower.save();
  //console.log(follower);
}

async function editMetion(mentioned, postTitle) {
  let existingUser = await User.findById(
    mentioned.substring(mentioned.indexOf('(') + 1, mentioned.indexOf(')'))
  );
  existingUser.notifications.push(
    'You were mentioned in this post! Title: ' + postTitle
  );
  await existingUser.save();
}

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creator: post.creator,
    creatorId: post.creatorId,
    createdAt: new Date().toISOString(),
    mentions: post.mentions,
  });

  try {
    await newPost.save();
    const creatorId = post.creatorId;
    const creator = await User.findById(creatorId);
    const followerList = creator.followerList;
    followerList.map((follower) =>
      editFollower(creator.username, follower, post.title)
    );
    post.mentions.map((mention) => editMetion(mention, post.title));
    //creator.notifications.push("You made a new Post! " + post.title);
    //creator.notifications = [];

    await creator.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with that id');

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );
  post.mentions.map((mention) => editMetion(mention, post.title));

  res.json(updatedPost);
};

export const addReport = async (req, res) => {
  const { id } = req.params;
  const repString = Object.keys(req.body)[0];
  try {
    const post = await PostMessage.findById(id);
    post.reports.push(repString);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with that id');

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: 'Post deleted successfully' });
};

export const getCollectionPosts = async (req, res) => {
  try {
    const { userID, collectionID } = req.params;
    let collection = null;

    const user = await User.findById(userID);
    const collections = user.collections;

    for (let i = 0; i < collections.length; i++) {
      let curr = collections[i];

      if (String(curr[3]) === collectionID) {
        collection = curr;
      }
    }

    const collectionPostIDs = collection[2];

    const data = await PostMessage.find({ _id: { $in: collectionPostIDs } });

    res.status(200).json({ result: data });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { postID } = req.params;
    const formData = req.body;
    const formRating = formData.rating;
    const formReview = formData.review;
    const formUser = formData.user;

    const post = await PostMessage.findById(postID);

    const sum = post.avgRating * post.reviews.length + parseFloat(formRating);
    post.avgRating = sum / (post.reviews.length + 1);

    post.reviews.push({
      reviewID: new mongoose.Types.ObjectId(),
      rating: formRating,
      review: formReview,
      userID: formUser._id,
      userUsername: formUser.username,
      userAvatar: formUser.selectedFile,
      createdAt: new Date().toISOString(),
    });

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};
