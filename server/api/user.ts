import express, { Request, Response } from 'express';
import mongodb, { Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHandler } from '../tools/db';
import { auth } from '../tools/auth';
import Joi from 'joi';
const router = express.Router();

router.post('/', auth('admin'), async (req: Request, res: Response) => {
	//Validate the request
	const { error } = Joi.object({
		username: Joi.string().min(4).required(),
		email: Joi.string().email().required(),
		password: Joi.string().required().min(8),
		role: Joi.string().valid('admin', 'projectAdmin', 'user', 'statistics'),
		projects: Joi.array().items(Joi.string().hex().min(24).max(24)),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const users: Collection = await dbHandler('users');

	// Check if the user already exists
	const emailExists: any = await users.findOne({ email: req.body.email });
	if (emailExists) {
		return res.status(400).send('Email in use');
	}

	// Hash the password
	const salt: string = await bcrypt.genSalt(10);
	const hashedPassword: string = await bcrypt.hash(req.body.password, salt);

	await users.insertOne({
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
		role: req.body.role ?? 'user',
	});

	res.status(201).send('User added to database');
});

router.put('/:userID', auth('admin'), async (req: Request, res: Response) => {
	//Validate the request
	const { error } = Joi.object({
		username: Joi.string().min(4),
		email: Joi.string().email(),
		role: Joi.string().valid('admin', 'projectAdmin', 'user', 'statistics'),
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

	res.status(200).send('User information changed');
});

router.post(
	'/projects/:userID',
	auth('admin'),
	async (req: Request, res: Response) => {
		//Validate the request
		const { error } = Joi.object({
			_id: Joi.array().items(Joi.string().hex().min(24).max(24)),
		}).validate(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const users: Collection = await dbHandler('users');

		await users.updateOne(
			{ _id: new mongodb.ObjectID(req.params.userID) },
			{ $push: { projects: req.body._id } }
		);

		res.status(200).send('Project added to user');
	}
);

router.delete('/:userID', auth('admin'), async (req: any, res: any) => {
	const users: Collection = await dbHandler('users');

	await users.deleteOne({ _id: new mongodb.ObjectID(req.params.userID) });

	res.status(200).send('User removed from database');
});

router.post('/login', async (req: Request, res: Response) => {
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
			_id: user._id,
			username: user.username,
			role: user.role,
			projects: user.projects,
		},
		TOKEN_SECRET
	);
	res.header('auth', token).status(202).send({
		role: user.role,
	});
});

export { router };
