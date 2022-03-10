import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";

export class UserController extends BaseController {
    constructor(loggerService: LoggerService) {
        super(loggerService, Router());
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register
            },
            {
                path: '/login',
                method: 'post',
                func: this.login
            }
        ]);
    }

    private login(req: Request, res: Response, next: NextFunction) {
        res.send('Logged in');
    }

    private register(req: Request, res: Response, next: NextFunction) {
        res.send('Registered');
    }

}