import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import nodemon from "nodemon";
import cors from "cors";
import login from "./login.json" assert {type: "json"};

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import recipeRoutes from './routes/recipes.js';
import passwordResetRoutes from './routes/passwordReset.js';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/recipes', recipeRoutes);
app.use('/user', userRoutes);
app.use('/password-reset', passwordResetRoutes);

const CONNECTION_URL = login.login;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewURLParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

//mongoose.set('useFindAndModify', false);