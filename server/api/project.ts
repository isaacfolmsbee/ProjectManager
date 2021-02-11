import express from 'express';
import mongodb, { Collection } from 'mongodb';
import { dbHandler } from '../tools/db';
import { auth } from '../tools/auth';
import Joi from 'joi';
const router = express.Router();

router.post('/', auth('admin'), async (req: any, res: any) => {
	//Validate the request
	const { error } = Joi.object({
		name: Joi.string().required().min(2),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const projects: Collection = await dbHandler('projects');

	await projects.insertOne({
		projectName: req.body.name,
		roles: {
			projectAdmin: [
				'assignProjectRole',
				'removeProjectRole',
				'changeProjectName',
				'createTicket',
				'comment',
				'editTicket',
				'deleteTicket',
				'getTicket',
				'getStats',
			],
			developer: [
				'createTicket',
				'comment',
				'editTicket',
				'getTicket',
				'getStats',
			],
			tester: [
				'createTicket',
				'comment',
				'editTicket',
				'getTicket',
				'getStats',
			],
			statUser: ['getStats'],
		},
		tickets: [],
	});

	res.status(201).send();
});

router.get('/', auth(''), async (req: any, res: any) => {
	const projects: Collection = await dbHandler('projects');

	// If they are admin, override and return all project names
	if (req.user.isAdmin === true) {
		const query: any = await projects.find({}, { projection: { projectName: 1 } }).toArray();

		return res.status(200).send(query);
	}

	// If they have no projects assigned then end
	if (Object.keys(req.user.projectRoles).length === 0) {
		return res.sendStatus(400);
	}

	let projectNames = [];

	for (const key in req.user.projectRoles) {
		const query: any = await projects.findOne(
			{
				_id: new mongodb.ObjectID(key),
			},
			{ projection: { projectName: 1 } }
		);

		projectNames.push(query);
	}

	res.status(200).send(projectNames);
});

router.put('/:projectID', auth('admin'), async (req: any, res: any) => {
	//Validate the request
	const { error } = Joi.object({
		name: Joi.string().required().min(2),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const projects: Collection = await dbHandler('projects');

	await projects.updateOne(
		{ _id: new mongodb.ObjectID(req.params.projectID) },
		{ $set: { projectName: req.body.name } }
	);

	res.status(201).send();
});

router.delete('/:projectID', auth('admin'), async (req: any, res: any) => {
	const projects: Collection = await dbHandler('projects');

	projects.deleteOne({ _id: new mongodb.ObjectID(req.params.projectID) });

	res.status(200).send();
});

export { router };
