declare namespace Express {
	interface Request {
		user: {
			userid: string;
			name: string;
			isAdmin: Boolean;
			roles: [{
				_id: string;
				role: string;
			}]
		},
	};
};