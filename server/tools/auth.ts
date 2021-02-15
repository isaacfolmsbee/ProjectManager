import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

export function auth(permission: string) {
	return async function (req: Request, res: Response, next: NextFunction) {
		// Get token and check if it exists
		const token: string | undefined = req.header('auth');
		if (!token) {
			return res.status(401).send('Missing JWT');
		}

		const TOKEN_SECRET: any = process.env.TOKEN_SECRET;

		// Verify token and assign it to req.user
		try {
			const verifiedToken: string | object = jwt.verify(token, TOKEN_SECRET);
			req.user = verifiedToken as {
				userid: string,
				username: string,
				role: string,
				projects: string[],
			};
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
			return res.status(400).send('Invalid ID param');
		}

		// If permission is empty than no need to check
		if (permission === '') {
			return next();
		}

		// If they are admin override checking their perms
		if (req.user.role === 'admin') {
			return next();
		} else if (permission === 'admin') {
			return res.status(403).send(`This request requires being admin`);
		}

		let hasProjectPermission;
		try {
			hasProjectPermission = req.user.projects.find(
				(element) => element === req.query.projectID
			);
		} catch (error) {
			return res.status(400).send('Invalid Token');
		}
		

		// This hunka junk is to see if they have permission to the request
		if (hasProjectPermission) {
			switch (req.user.role) {
				case 'projectAdmin':
					return next();
				case 'user':
					if (permission !== 'projectAdmin') {
						return next();
					}
				case 'statistics':
					if (permission === 'statistics') {
						return next();
					}
				default:
					res.status(403).send(
						`This request requires the ${permission} role`
					);
					break;
			}
		} else {
			return res.status(403).send("You don't have access to this project");
		}
	};
}
