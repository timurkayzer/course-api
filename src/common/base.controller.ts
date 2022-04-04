import { LoggerService } from '../logger/logger.service';
import { Response, Router } from 'express';
import { Route } from './route.interface';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private _baseRoute: string;
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	get baseRoute(): string {
		return this._baseRoute;
	}

	set baseRoute(route: string) {
		this._baseRoute = route;
	}

	protected bindRoutes(routes: Route[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}]:${route.path}`);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this.router[route.method](route.path, pipeline);
		});
	}

	protected ok(res: Response, data: unknown, status = 200): void {
		if (status) {
			res.status(status);
		}
		res.send(data);
	}
}
