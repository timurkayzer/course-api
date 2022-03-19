import { LoggerService } from "../logger/logger.service";
import { Router } from 'express';
import { Route } from "./route.interface";
import { injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
    private _baseRoute: string;
    private readonly _router: Router;

    constructor(private logger: ILogger) {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    get baseRoute() {
        return this._baseRoute;
    }

    set baseRoute(route: string) {
        this._baseRoute = route;
    }

    protected bindRoutes(routes: Route[]) {
        routes.forEach(route => {
            this.logger.log(`[${route.method}]:${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        })
    }

}