import express, { Request, Response, NextFunction } from 'express';
import { App } from './app.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { LoggerService } from './logger/logger.service.js';
import { UserController } from './users/users.controller.js';


const port = 4200;

export async function bootstrap() {
    const logger = new LoggerService();
    const usersController = new UserController(logger);
    const exceptionFilter = new ExceptionFilter(logger);
    const app = new App(port, logger, [usersController], exceptionFilter);
    await app.init();
}

bootstrap();   