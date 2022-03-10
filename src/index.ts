import express, { Request, Response, NextFunction } from 'express';
import { App } from './app.js';
import { LoggerService } from './logger/logger.service.js';
import { UserController } from './users/users.controller.js';


const port = 4200;

export async function bootstrap() {

    const logger = new LoggerService();
    const app = new App(port, logger);
    const usersController = new UserController(logger);
    app.useRoute('/users', usersController.router);
    await app.init();
}

bootstrap();