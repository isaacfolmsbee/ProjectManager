import express from 'express';
import mongodb, { Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHandler } from '../tools/db';
import { auth } from '../tools/auth';
import Joi from 'joi';
const router = express.Router();

router.post('/', auth('admin'), async (req: any, res: any) => {
	//Validate the request
	const { error } = Joi.object({
		name: Joi.string().min(4).required(),
		email: Joi.string().email().required(),
		password: Joi.string().required().min(8),
		isAdmin: Joi.boolean(),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const users: Collection = await dbHandler('users');

	// Check if the user already exists
	const emailExists: any = await users.findOne({ email: req.body.email });
	if (emailExists) {
		return res.status(400).send('email in use');
	}

	// Hash the password
	const salt: string = await bcrypt.genSalt(10);
	const hashedPassword: string = await bcrypt.hash(req.body.password, salt);

	await users.insertOne({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
		isAdmin: req.body.isAdmin ?? false,
		projectRoles: {},
	});

	res.status(201).send();
});

router.put('/:userID', auth('admin'), async (req: any, res: any) => {
	//Validate the request
	const { error } = Joi.object({
		name: Joi.string().min(4),
		email: Joi.string().email(),
		isAdmin: Joi.boolean(),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const users: Collection = await dbHandler('users');

	for (const key in req.body) {
		await users.updateOne(
			{ _id: new mongodb.ObjectID(req.params.userID) },
			{ $set: { [key]: req.body[key] } }
		);
	}

	res.status(201).send();
});

router.post(
	'/role/:userID/:projectID',
	auth('assignProjectRole'),
	async (req: any, res: any) => {
		//Validate the request
		const { error } = Joi.object({
			role: Joi.string()
				.required()
				.valid('projectAdmin', 'developer', 'tester', 'statUser'),
		}).validate(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const users: Collection = await dbHandler('users');

		await users.updateOne(
			{ _id: new mongodb.ObjectID(req.params.userID) },
			{ $push: { [`projectRoles.${req.params.projectID}`]: req.body.role } }
		);

		res.status(201).send();
	}
);

router.delete(
	'/role/:userID/:projectID',
	auth('removeProjectRole'),
	async (req: any, res: any) => {
		//Validate the request
		const { error } = Joi.object({
			role: Joi.string()
				.required()
				.valid('projectAdmin', 'developer', 'tester', 'statUser'),
		}).validate(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const users: Collection = await dbHandler('users');

		await users.updateOne(
			{ _id: new mongodb.ObjectID(req.params.userID) },
			{ $pull: { [`projectRoles.${req.params.projectID}`]: req.body.role } }
		);

		res.status(200).send();
	}
);

router.delete('/:userID', auth('admin'), async (req: any, res: any) => {
	const users: Collection = await dbHandler('users');

	await users.deleteOne({ _id: new mongodb.ObjectID(req.params.userID) });

	res.status(200).send();
});

router.post('/login', async (req: any, res: any) => {
	const users: Collection = await dbHandler('users');

	//Validate the request
	const { error } = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required().min(8),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// Check if the user exists
	const user: any = await users.findOne({ email: req.body.email });
	if (!user) {
		return res.status(400).send('Email not found');
	}

	// Check if password is correct
	const validPassword: boolean = await bcrypt.compare(
		req.body.password,
		user.password
	);
	if (!validPassword) {
		return res.status(400).send('Invalid password');
	}

	const TOKEN_SECRET: any = process.env.TOKEN_SECRET;

	// Create and assign a token
	const token: string = jwt.sign(
		{
			userid: user._id,
			name: user.name,
			isAdmin: user.isAdmin,
			projectRoles: user.projectRoles,
		},
		TOKEN_SECRET
	);
	res.header('authtoken', token).status(202).send(token);
});

export { router };
