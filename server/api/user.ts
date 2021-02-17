import express, { Request, Response } from 'express';
import mongodb, { Collection, ObjectID } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHandler } from '../tools/db';
import { auth } from '../tools/auth';
import Joi from 'joi';
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
	//Validate the request
	const { error } = Joi.object({
		username: Joi.string().min(4).required(),
		email: Joi.string().email().required(),
		password: Joi.string().required().min(8),
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
		isAdmin: false,
		notifications: [],
	});

	res.status(201).send('User added to database');
});

router.put('/:userID', auth('admin'), async (req: Request, res: Response) => {
	//Validate the request
	const { error } = Joi.object({
		username: Joi.string().min(4),
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

	res.status(200).send('User information changed');
});

router.delete('/', auth(''), async (req: Request, res: Response) => {
	const users: Collection = await dbHandler('users');

	await users.deleteOne({ _id: new mongodb.ObjectID(req.user._id) });

	res.status(200).send('Your account has been removed');
});

router.delete('/:userID', auth('admin'), async (req: Request, res: Response) => {
	const users: Collection = await dbHandler('users');

	await users.deleteOne({ _id: new mongodb.ObjectID(req.params.userID) });

	res.status(200).send('User removed from database');
});

router.post('/login', async (req: Request, res: Response) => {
	const users: Collection = await dbHandler('users');

	//Validate the request
	const { error } = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
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

	const projects: Collection = await dbHandler('projects');

	// Get all the projects the user is in,
	// then return the roleID and roles to
	// crunch further down to extract their
	// role and permissions
	const userRoles: any = await projects
		.find(
			{
				'assignedUsers._id': new ObjectID(user._id),
			},
			{
				projection: { 'assignedUsers.$': 1, roles: 1 },
			}
		)
		.toArray();

	// Filter the roles that this user has so all their
	// project roles and permissions with them can be
	// added to their JWT
	let projectRoles = [];
	for (let index = 0; index < userRoles.length; index++) {
		let role: any = userRoles[
			index
		].roles.filter(
			(el: { _id: ObjectID, name: string, permissions: string[] }) =>
				new ObjectID(el._id).equals(
					new ObjectID(userRoles[index].assignedUsers[0].role)
				)
		)[0];

		let projectRole = {
			_id: userRoles[index]._id,
			role: role.name,
			permissions: role.permissions,
		};

		projectRoles.push(projectRole);
	}

	const TOKEN_SECRET: any = process.env.TOKEN_SECRET;

	// Create and assign a token
	const token: string = jwt.sign(
		{
			_id: user._id,
			username: user.username,
			isAdmin: user.isAdmin,
			projects: projectRoles,
		},
		TOKEN_SECRET
	);
	res.header('Authorization', token)
		.status(200)
		.send('Successfully authenticated');
});

export { router };
