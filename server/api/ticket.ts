import express from 'express';
import mongodb, { Collection } from 'mongodb';
import { auth } from '../tools/auth';
import { dbHandler } from '../tools/db';
import Joi from 'joi';
const router = express.Router();

router.post('/:projectID', auth('createTicket'), async (req: any, res: any) => {
	//Validate the request
	const { error } = Joi.object({
		type: Joi.string().required().valid('bug', 'suggestion'),
		title: Joi.string().required().min(2),
		description: Joi.string().required().min(10),
		severity: Joi.string()
			.required()
			.valid('low', 'medium', 'high', 'severe'),
	}).validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const projects: Collection = await dbHandler('projects');

	await projects.updateOne(
		{ _id: new mongodb.ObjectID(req.params.projectID) },
		{
			$push: {
				tickets: {
					_id: new mongodb.ObjectID(),
					type: req.body.type,
					title: req.body.title,
					createdBy: req.user.name,
					dateCreated: new Date(),
					description: req.body.description,
					severity: req.body.severity,
					status: 'Open',
					comments: [],
					history: [],
				},
			},
		}
	);

	res.status(201).send();
});

router.post(
	'/:projectID/:ticketID',
	auth('comment'),
	async (req: any, res: any) => {
		//Validate the request
		const { error } = Joi.object({
			text: Joi.string().required().min(10),
		}).validate(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const projects: Collection = await dbHandler('projects');

		const project: any = await projects.findOne(
			{
				_id: new mongodb.ObjectID(req.params.projectID),
			},
			{ projection: { tickets: 1 } }
		);

		const ticketIndex = project.tickets.findIndex(
			(obj: any) => obj._id == req.params.ticketID
		);

		await projects.updateOne(
			{ _id: new mongodb.ObjectID(req.params.projectID) },
			{
				$push: {
					[`tickets.${ticketIndex}.comments`]: {
						createdBy: req.user.name,
						dateCreated: new Date(),
						text: req.body.text,
					},
				},
			}
		);

		res.status(201).send();
	}
);

router.put(
	'/:projectID/:ticketID',
	auth('editTicket'),
	async (req: any, res: any) => {
		//Validate the request
		const { error } = Joi.object({
			type: Joi.string().min(2),
			title: Joi.string().min(2),
			description: Joi.string().min(10),
			severity: Joi.string().valid('low', 'medium', 'high', 'severe'),
		}).validate(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const projects: Collection = await dbHandler('projects');

		let historyEntry: {
			changes: Object[],
			changedBy: string,
			dateChanged: Date,
		} = {
			changes: [],
			changedBy: req.user.name,
			dateChanged: new Date(),
		};

		const project: any = await projects.findOne(
			{
				_id: new mongodb.ObjectID(req.params.projectID),
			},
			{ projection: { tickets: 1 } }
		);

		const ticketIndex = project.tickets.findIndex(
			(obj: any) => obj._id == req.params.ticketID
		);

		for (const key in req.body) {
			await projects.updateOne(
				{ _id: new mongodb.ObjectID(req.params.projectID) },
				{ $set: { [`tickets.${ticketIndex}.${key}`]: req.body[key] } }
			);

			historyEntry.changes.push({
				propertyChanged: key,
				oldValue: project.tickets[ticketIndex][key],
				newValue: req.body[key],
			});
		}

		await projects.updateOne(
			{ _id: new mongodb.ObjectID(req.params.projectID) },
			{ $push: { [`tickets.${ticketIndex}.history`]: historyEntry } }
		);

		res.status(201).send();
	}
);

router.delete(
	'/:projectID/:ticketID',
	auth('deleteTicket'),
	async (req: any, res: any) => {
		const projects: Collection = await dbHandler('projects');

		await projects.updateOne(
			{ _id: new mongodb.ObjectID(req.params.projectID) },
			{
				$pull: {
					tickets: {
						_id: new mongodb.ObjectID(req.params.ticketID),
					},
				},
			}
		);

		res.status(200).send();
	}
);

router.get('/:projectID', auth('getTicket'), async (req: any, res: any) => {
	const projects: Collection = await dbHandler('projects');

	const query: any = await projects.findOne(
		{
			_id: new mongodb.ObjectID(req.params.projectID),
		},
		{ projection: { tickets: 1 } }
	);

	if (req.body.type) {
		const filteredTickets = query.tickets.filter(
			(el: { type: string }) => el.type === req.body.type
		);
		return res.status(200).send(filteredTickets);
	}

	res.status(200).send(query.tickets);
});

router.get(
	'/severity/:projectID',
	auth('getStats'),
	async (req: any, res: any) => {
		const projects: Collection = await dbHandler('projects');

		const query: any = await projects.findOne(
			{
				_id: new mongodb.ObjectID(req.params.projectID),
			},
			{ projection: { tickets: 1 } }
		);

		let statistic: { [key: string]: any } = {
			low: 0,
			medium: 0,
			high: 0,
			severe: 0,
		};

		for (const severity in statistic) {
			statistic[severity] = query.tickets.filter(
				(el: { severity: string }) => el.severity === severity
			).length;
		}

		res.status(200).send(statistic);
	}
);

router.get('/type/:projectID', auth('getStats'), async (req: any, res: any) => {
	const projects: Collection = await dbHandler('projects');

	const query: any = await projects.findOne(
		{
			_id: new mongodb.ObjectID(req.params.projectID),
		},
		{ projection: { tickets: 1 } }
	);

	let statistic: { [key: string]: any } = {};

	statistic['bug'] = query.tickets.filter(
		(el: { type: string }) => el.type === 'bug'
	).length;

	statistic['suggestion'] = query.tickets.filter(
		(el: { type: string }) => el.type === 'suggestion'
	).length;

	res.status(200).send(statistic);
});

export { router };
