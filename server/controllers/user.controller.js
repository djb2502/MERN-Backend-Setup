const User = require('../models/user.model');
const extend = require('lodash/extend');
const errorHandler = require('../helpers/dbErrorHandler');
// const schema = require('../models/user.model');
// const Joi = require('@hapi/joi');

exports.create = async (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});
	try {
		await user.save();
		return res.status(200).json({
			message: 'Successfully signed up!',
		});
	} catch (err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err),
		});
	}
};

exports.list = async (req, res) => {
	try {
		let users = await User.find().select('name email updated created');
		res.json(users);
	} catch (err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err),
		});
	}
};

exports.userByID = async (req, res, next, id) => {
	try {
		let user = await User.findById(id);
		if (!user)
			return res.status('400').json({
				error: 'User not found',
			});
		req.profile = user;
		next();
	} catch (err) {
		return res.status('400').json({
			error: 'Could not retrieve user',
		});
	}
};

exports.read = (req, res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};

exports.update = async (req, res) => {
	try {
		let user = req.profile; // retrieve user detail from user.profile
		user = extend(user, req.body);
		user.updated = Date.now();
		await user.save();
		user.hashed_password = undefined;
		user.salt = undefined;
		res.json(user);
	} catch (err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err),
		});
	}
};

exports.remove = async (req, res) => {
	try {
		let user = req.profile;
		let deletedUser = await user.remove();
		deletedUser.hashed_password = undefined;
		deletedUser.salt = undefined;
		res.json(deletedUser);
	} catch (err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err),
		});
	}
};
