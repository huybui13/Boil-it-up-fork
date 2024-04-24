import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js'
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const signin = async (req, res) => {
    const { emailUsername, password } = req.body;

    try {
        var existingUser = await User.findOne({ email: emailUsername });
        
        if (!existingUser)
            existingUser = await User.findOne({ username: emailUsername });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials. Please try again." });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

export const signup = async (req, res) => {
    const { email, username, password, confirmPassword, firstName, lastName } = req.body;

    try {
        var existingUser = await User.findOne({ email });
        
        if (!existingUser)
            existingUser = await User.findOne({ username });
        
        if (existingUser) return res.status(400).json({ message: "User already exists." });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match. " });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, username, password: hashedPassword, name: `${firstName} ${lastName}`, introduction: '' });

        const user = await User.findById(result._id);

        user.collections = [["Bookmarks", result._id, [], new mongoose.Types.ObjectId()]];

        await user.save();

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

export const editprofile = async (req, res) => {
    const { firstName, lastName, email, username, id, introduction, selectedFile } = req.body;
    // console.log(req.body);

    try {
        const existingUser = await User.findById(id);
        existingUser.name = `${firstName} ${lastName}`;
        existingUser.email = email;
        existingUser.username = username;
        existingUser.introduction = introduction;
        existingUser.selectedFile = selectedFile;
        await existingUser.save();
        // console.log(existingUser);

        const token = jwt.sign({ firstName: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

export const deleteprofile = async (req, res) => {
    const { id } = req.body;

    // console.log(id);

    try {
        const existingUser = await User.findById(id);

        // console.log(existingUser);

        const result = await existingUser.deleteOne({ email: existingUser.email })

        res.status(200).json({ result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const existingUser = await User.findById(id);

        res.status(200).json(existingUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const addDietaryPref = async (req, res) => {
    const id = req.body.pop();
    const preferences = req.body;

    try {
        const user = await User.findById(id);
        for (var i = 0; i < preferences.length; i++)
            if (!user.dietaryPreferences.includes(preferences[i]))
                user.dietaryPreferences.push(preferences[i]);
        await user.save();
        
        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const clearDietaryPref = async (req, res) => {
    const id = Object.keys(req.body)[0];
    console.log(id);
    try {
        const user = await User.findById(id);
        user.dietaryPreferences = [];
        await user.save();
        
        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    } 
}
export const followUser = async (req, res) => {
    const { followerId, followingId } = req.params;

    try {
        const followerUser = await User.findById(followerId);
        const followingUser = await User.findById(followingId);

        // console.log(followerUser.followingList.length);

        if (!followerUser.followingList.some(row => row.includes(followingId))) {
            followerUser.followingList = [...followerUser.followingList, [followingId, followingUser.name, followingUser.username, followingUser.selectedFile]];
            await followerUser.save();
        }

        // console.log(followingUser.followerList.length);

        if (!followingUser.followerList.some(row => row.includes(followerId))) {
            followingUser.followerList = [...followingUser.followerList, [followerId, followerUser.name, followerUser.username, followerUser.selectedFile]];
            await followingUser.save();
        }

        const token = jwt.sign({ firstName: followerUser.email, id: followerUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: followerUser, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const unfollowUser = async (req, res) => {
    const { unfollowerId, unfollowingId } = req.params;

    try {
        const unfollowerUser = await User.findById(unfollowerId);
        const unfollowingUser = await User.findById(unfollowingId);

        unfollowerUser.followingList = unfollowerUser.followingList.filter(function(item){ return item[0] !== unfollowingId });
        unfollowingUser.followerList = unfollowingUser.followerList.filter(function(item){ return item[0] !== unfollowerId });

        await unfollowerUser.save();
        await unfollowingUser.save();

        const token = jwt.sign({ firstName: unfollowerUser.email, id: unfollowerUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: unfollowerUser, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const blockUser = async (req, res) => {
    const { id, blockID } = req.params;

    try {
        const user = await User.findById(id);
        const blockedUser = await User.findById(blockID);

        user.blocked.push(blockID);
        blockedUser.blocked.push(id);

        user.followingList = user.followingList.filter(function(item){ return item[0] !== blockID });
        user.followerList = user.followerList.filter(function(item){ return item[0] !== blockID });
        blockedUser.followingList = blockedUser.followingList.filter(function(item){ return item[0] !== id });
        blockedUser.followerList = blockedUser.followerList.filter(function(item){ return item[0] !== id });

        await user.save();
        await blockedUser.save();

        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const unblockUser = async (req, res) => {
    const { id, blockedID } = req.params;

    try {
        const user = await User.findById(id);
        const blockedUser = await User.findById(blockedID);

        user.blocked = user.blocked.filter(function(item){ return item.toString() !== blockedID });
        blockedUser.blocked = blockedUser.blocked.filter(function(item){ return item.toString() !== id });

        await user.save();
        await blockedUser.save();

        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const changeCollection = async (req, res) => {
    try {
        const formData = req.body;
        const collectionName = formData[0];
        const postID = formData[1];
        const id = formData[2];

        const user = await User.findById(id);

        for (let i = 0; i < user.collections.length; i++) {
            let collection = user.collections[i];

            if (collection[0] === collectionName) {
                let posts = collection[2];

                if (posts.includes(postID)) {
                    let index = posts.indexOf(postID);
                    posts.splice(index, 1);
                } else {
                    posts.push(postID);
                }

                user.collections[i] = [collectionName, user._id, posts, collection[3]];

                await user.save();
            }
        }

        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const createCollection = async (req, res) => {
    try {
        const formData = req.body;
        const collectionName = formData[0];
        const postID = formData[1];
        const id = formData[2];

        const user = await User.findById(id);

        const userObject = new mongoose.Types.ObjectId(id);
        const objectID = new mongoose.Types.ObjectId();

        user.collections = [...user.collections, [collectionName, userObject, [postID], objectID]];

        await user.save();

        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const getCollection = async (req, res) => {
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

        res.status(200).json({ result: collection });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { userID, collectionID } = req.params;

        const user = await User.findById(userID);
        const collections = user.collections;

        let index = null;

        for (let i = 0; i < collections.length; i++) {
            let collection = collections[i];

            if (String(collection[3]) === collectionID) {
                index = i;
            }
        }

        collections.splice(index, 1);

        user.collections = collections;

        await user.save();

        const token = jwt.sign({ firstName: user.email, id: user._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: user, token });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
}