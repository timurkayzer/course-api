import express, { Express, Router } from 'express';
import { Server } from 'http';
import { BaseController } from './common/base.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';

export class App {
    private app: Express;
    private port: number;
    private server: Server;
    private controllers: BaseController[];
    private exceptionFilter: IExceptionFilter;
    logger: ILogger;

    constructor(port: number, logger: ILogger, controllers: BaseController[], exceptionFilter: IExceptionFilter) {
        this.app = express();
        this.port = port;
        this.logger = logger;
        this.controllers = controllers;
        this.exceptionFilter = exceptionFilter;
    }

    private useRoute(path: string, router: Router): void {
        this.app.use(path, router);
    }

    private useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.server = this.app.listen(this.port);
        this.controllers.forEach(controller => {
            this.useRoute(controller.baseRoute, controller.router);
        });
        this.useExceptionFilters();
        this.logger.log('Сервер запущен на порту ' + this.port);
    }
}