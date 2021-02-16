declare namespace Express {
	interface Request {
		user: {
			_id: string;
			username: string;
			isAdmin: boolean;
			projects: [
				{
					_id: string;
					role: string;
					permissions: string[];
				},
			];
		};
	};
};