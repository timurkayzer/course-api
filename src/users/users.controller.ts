import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../common/base.controller";
import { HttpError } from "../errors/http-error";
import { LoggerService } from "../logger/logger.service";

export class UserController extends BaseController {
    constructor(loggerService: LoggerService) {
        super(loggerService, Router(), '/users');
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

        //res.send('Logged in');
        throw new Error('Непредвиденная ошибка');
    }

    private register(req: Request, res: Response, next: NextFunction) {
        throw new HttpError(500, 'Непредвиденная ошибка', 'Контроллер');

        //res.send('Registered');
    }

}