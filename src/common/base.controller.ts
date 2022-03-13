import { LoggerService } from "../logger/logger.service";
import { Router } from 'express';
import { Route } from "./route.interface";

export abstract class BaseController {
    private _baseRoute: string;
    private logger: LoggerService
    private readonly _router: Router;

    constructor(logger: LoggerService, router: Router, route: string) {
        this.logger = logger;
        this._router = router;
        this._baseRoute = route;
    }

    get router() {
        return this._router;
    }

    get baseRoute() {
        return this._baseRoute;
    }

    protected bindRoutes(routes: Route[]) {
        routes.forEach(route => {
            this.logger.log(`[${route.method}]:${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        })
    }

}