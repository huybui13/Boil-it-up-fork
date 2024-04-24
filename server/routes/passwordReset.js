import express from 'express';
import { User } from '../models/user.js';
import PostMessage from '../models/postMessage.js';
import crypto from 'crypto';
import Token from '../models/token.js';
import Joi from 'joi';
import sendEmail from '../utils/sendEmail.js';
import passwordComplexity from 'joi-password-complexity';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label('Email'),
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .send({ message: 'User with given email does not exist!' });

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();
    }

    const url = `localhost:3000/password-reset/${user._id}/${token.token}/`;
    //const url = `There are new recipes in Boil It Up!`;
    await sendEmail(user.email, 'Password Reset', url);

    //await sendEmail(user.email, 'Updated posts in Boil-it-Up', url);
    res
      .status(200)
      .send({ message: 'Password reset link sent to your email account' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post('/sendUpdate', async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label('Email'),
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .send({ message: 'User with given email does not exist!' });

    let token = await Token.findOne({ userId: user._id });
    //let postTitle = req.body.title;
    // let post = await PostMessage.find({}).sort({
    //   createdAt: 1,
    // });
    //console.log(postTitle);
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();
    }

    //const url = `localhost:3000/password-reset/${user._id}/${token.token}/`;
    // const url = `There are new recipes title ${post.title} in Boil It Up!`;
    const url = `There are new recipes in Boil It Up!`;
    //await sendEmail(user.email, 'Password Reset', url);

    await sendEmail(user.email, 'Updated posts in Boil-it-Up', url);
    res
      .status(200)
      .send({ message: 'Password reset link sent to your email account' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// verify password reset link
router.get('/:id/:token', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: 'Invalid link' });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: 'Invalid link' });

    res.status(200).send('Valid Url');
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

//  set new password
router.post('/:id/:token', async (req, res) => {
  try {
    // const passwordSchema = Joi.object({
    // 	password: passwordComplexity().required().label("Password"),
    // });
    // const { error } = passwordSchema.validate(req.body);
    // if (error)
    // 	return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: 'Invalid link' });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: 'Invalid link' });

    if (!user.verified) user.verified = true;

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashPassword;
    await user.save();
    await token.remove();

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
