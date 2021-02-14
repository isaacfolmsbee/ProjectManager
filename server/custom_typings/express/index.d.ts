declare namespace Express {
	interface Request {
		user: {
			userid: string;
			username: string;
			isAdmin: Boolean;
			roles: [{
				_id: string;
				role: string;
			}]
		},
	};
};