declare namespace Express {
	interface Request {
		user: {
			userid: string;
			username: string;
			role: string;
			projects: string[];
		},
	};
};