import mongoose, {model, Schema} from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
	username: {type: String, required: true},
    password: { type: String, required: true },
    id: { type: String },
    introduction: { type: String },
	selectedFile: { type: String },
	followerList: [[String]],
	followingList: [[String]],
	dietaryPreferences: [String],
	collections: [Schema.Types.Mixed],
	blocked: [Schema.Types.ObjectId],
	notifications: {type: Array},
})


userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

export { User, validate };

export default User;