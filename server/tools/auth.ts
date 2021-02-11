import { NextFunction } from 'express';
import mongodb, { Collection } from 'mongodb';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { dbHandler } from './db';

export function auth(permission: string) {
	return async function (req: any, res: any, next: NextFunction) {
		// Get token and check if it exists
		const token: string | undefined = req.header('authtoken');
		if (!token) {
			return res.status(401).send();
		}

		const TOKEN_SECRET: any = process.env.TOKEN_SECRET;

		// Verify token and assign it to req.user
		try {
			const verifiedToken: string | object = jwt.verify(token, TOKEN_SECRET);
			req.user = verifiedToken;
		} catch (error) {
			return res.status(400).send('Invalid Token');
		}

		// Validate their ID params
		const { error } = Joi.object({
			projectID: Joi.string().hex().min(24).max(24),
			userID: Joi.string().hex().min(24).max(24),
			ticketID: Joi.string().hex().min(24).max(24),
		}).validate(req.params);
		if (error) {
			return res.status(400).send('Invalid ID parameter');
		}

		// If permission is empty than no need to check
		if (permission === '') {
			return next();
		}

		// If they are admin override checking their perms
		if (req.user.isAdmin === true) {
			return next();
		} else if (permission === 'admin') {
			return res.status(403).send(`This request requires being admin`);
		}

		const projects: Collection = await dbHandler('projects');

		const project: any = await projects.findOne(
			{
				_id: new mongodb.ObjectID(req.params.projectID),
			},
			{ projection: { roles: 1 } }
		);

		// This loops through the user's roles in the project of this API call
		// and checks if they have the required permission
		if (req.user.projectRoles[req.params.projectID]) {
			for (const role of req.user.projectRoles[req.params.projectID]) {
				if (project.roles[role].includes(permission)) {
					return next();
				}
			}
		}

		return res
			.status(403)
			.send(`This request requires the ${permission} permission`);
	};
}
