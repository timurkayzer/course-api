declare namespace Express {
	export interface Request {
		user: string;
		userModel: {
			id: number;
			email: string;
			name: string;
			password: string;
		};
	}
}
