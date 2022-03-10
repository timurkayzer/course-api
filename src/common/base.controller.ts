import { LoggerService } from "../logger/logger.service";
import { Router } from 'express';
import { Route } from "./route.interface";

export abstract class BaseController {
    private logger: LoggerService
    private readonly _router: Router;

    constructor(logger: LoggerService, router: Router) {
        this.logger = logger;
        this._router = router;
    }

    get router() {
        return this._router;
    }

    protected bindRoutes(routes: Route[]) {
        routes.forEach(route => {
            this.logger.log(`[${route.method}]:${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        })
    }

}