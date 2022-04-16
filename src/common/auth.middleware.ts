import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../users/users.service.interface';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private userService: IUserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.user) {
			res.status(403).send();
		} else {
			const user = await this.userService.getUserInfo(req.user);
			if (user) {
				req.userModel = user;
				next();
			} else {
				res.status(403).send();
			}
		}
	}
}
