import express, { Request, Response } from 'express';
import mongodb, { Collection } from 'mongodb';
import { dbHandler } from '../tools/db';
import { auth } from '../tools/auth';
import Joi from 'joi';
const router = express.Router();

router.post('/', auth('admin'), async (req: Request, res: Response) => {
	//Validate the request
	const { error } = Joi.object({
		name: Joi.string().required().min(2),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const projects: Collection = await dbHandler('projects');

	await projects.insertOne({
		name: req.body.name,
		tickets: [],
	});

	res.status(201).send('Project added to database');
});

router.get('/', auth(''), async (req: Request, res: Response) => {
	const projects: Collection = await dbHandler('projects');

	// If they are admin, override and return all project names
	if (req.user.role === 'admin') {
		const query: any = await projects
			.find({}, { projection: { name: 1 } })
			.toArray();

		return res.status(200).send(query);
	}

	// If they have no projects assigned then end
	if (req.user.projects.length === 0) {
		return res.sendStatus(400);
	}

	let projectNames = [];

	for (const projectID of req.user.projects) {
		const query: any = await projects.findOne(
			{
				_id: new mongodb.ObjectID(projectID),
			},
			{ projection: { name: 1 } }
		);

		projectNames.push(query);
	}

	res.status(200).send(projectNames);
});

router.put('/:projectID', auth('projectAdmin'), async (req: Request, res: Response) => {
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
		{ $set: { name: req.body.name } }
	);

	res.status(201).send('Project name changed');
});

router.delete('/:projectID', auth('admin'), async (req: any, res: any) => {
	const projects: Collection = await dbHandler('projects');

	projects.deleteOne({ _id: new mongodb.ObjectID(req.params.projectID) });

	res.status(200).send('Project removed from database');
});

export { router };
