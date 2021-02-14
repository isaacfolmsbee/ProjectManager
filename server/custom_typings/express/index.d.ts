declare namespace Express {
	interface Request {
		user: {
			userid: String;
			name: String;
			isAdmin: Boolean;
			roles: [{
				_id: String;
				role: String;
			}]
		},
	};
};