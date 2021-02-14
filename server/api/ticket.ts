import express, { Request, Response } from 'express';
import mongodb, { Collection } from 'mongodb';
import { auth } from '../tools/auth';
import { dbHandler } from '../tools/db';
import Joi from 'joi';
const router = express.Router();

router.post(
	'/:projectID',
	auth('user'),
	async (req: Request, res: Response) => {
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
						createdBy: req.user.username,
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

		res.status(201).send('Ticket submitted');
	}
);

router.post(
	'/:projectID/:ticketID',
	auth('user'),
	async (req: Request, res: Response) => {
		//Validate the request
		const { error } = Joi.object({
			text: Joi.string().required().min(10),
		}).validate(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const projects: Collection = await dbHandler('projects');

		await projects.findOneAndUpdate(
			{
				_id: new mongodb.ObjectID(req.params.projectID),
				'tickets._id': new mongodb.ObjectID(req.params.ticketID),
			},
			{
				$push: {
					'tickets.$.comments': {
						createdBy: req.user.username,
						dateCreated: new Date(),
						text: req.body.text,
					},
				},
			}
		);

		res.status(201).send('Comment added to ticket');
	}
);

router.put(
	'/:projectID/:ticketID',
	auth('user'),
	async (req: Request, res: Response) => {
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
			changedBy: req.user.username,
			dateChanged: new Date(),
		};

		for (const key in req.body) {
			let oldValue = await projects.findOneAndUpdate(
				{
					_id: new mongodb.ObjectID(req.params.projectID),
					'tickets._id': new mongodb.ObjectID(req.params.ticketID),
				},
				{
					$set: {
						[`tickets.$.${key}`]: req.body[key],
					},
				},
				{
					projection: { 'tickets.$': 1 },
				}
			);

			historyEntry.changes.push({
				propertyChanged: key,
				oldValue: oldValue.value.tickets[0][key],
				newValue: req.body[key],
			});
		}

		await projects.findOneAndUpdate(
			{
				_id: new mongodb.ObjectID(req.params.projectID),
				'tickets._id': new mongodb.ObjectID(req.params.ticketID),
			},
			{
				$push: {
					[`tickets.$.history`]: historyEntry,
				},
			}
		);

		res.status(201).send('Ticket modified');
	}
);

router.delete(
	'/:projectID/:ticketID',
	auth('user'),
	async (req: Request, res: Response) => {
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

		res.status(200).send('Ticket deleted');
	}
);

router.get('/:projectID', auth('user'), async (req: Request, res: Response) => {
	const projects: Collection = await dbHandler('projects');

	const query: any = await projects.findOne(
		{
			_id: new mongodb.ObjectID(req.params.projectID),
		},
		{ projection: { tickets: 1 } }
	);

	if (req.query.type) {
		const filteredTickets = query.tickets.filter(
			(el: { type: string }) => el.type === req.query.type
		);
		return res.status(200).send(filteredTickets);
	}

	res.status(200).send(query.tickets);
});

router.get(
	'/severity/:projectID',
	auth('statistics'),
	async (req: Request, res: Response) => {
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

router.get(
	'/type/:projectID',
	auth('statistics'),
	async (req: Request, res: Response) => {
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
	}
);

export { router };
