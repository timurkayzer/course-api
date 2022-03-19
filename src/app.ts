import express, { Express, Router } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from './common/base.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import 'reflect-metadata';
import { IUserController } from './users/users.controller.interface';

@injectable()
export class App {
    private app: Express;
    private port = 4200;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.IUserController) private userController: IUserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter) {
        this.app = express();
        this.logger = logger;
        this.exceptionFilter = exceptionFilter;
    }

    private useRoute(path: string, router: Router): void {
        this.app.use(path, router);
    }

    private useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useRoute(this.userController.baseRoute, this.userController.router);
        this.useExceptionFilters();
        this.logger.log('Сервер запущен на порту ' + this.port);
        this.app.listen(this.port);
    }
}