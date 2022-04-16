import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';

export class JwtMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (error, decoded: any) => {
				if (error) {
					next();
				} else if (decoded) {
					req.user = decoded.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
