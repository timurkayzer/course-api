import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.baseRoute = '/users';
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
		]);
	}

	login(req: Request, res: Response, next: NextFunction): Promise<void> {
		throw new Error('Непредвиденная ошибка');
	}

	register(req: Request, res: Response, next: NextFunction): Promise<void> {
		throw new HttpError(500, 'Непредвиденная ошибка', 'Контроллер');

		//res.send('Registered');
	}
}
