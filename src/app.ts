import express, { Express, Router } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';

export class App {
    private app: Express;
    private port: number;
    private server: Server;
    logger: LoggerService;

    constructor(port: number, logger: LoggerService) {
        this.app = express();
        this.port = port;
        this.logger = logger;
    }

    public useRoute(path: string, router: Router) {
        this.app.use(path, router);
    }

    public async init() {
        this.server = this.app.listen(this.port);
        this.logger.log('Сервер запущен на порту ' + this.port);
    }
}