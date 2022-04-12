import express, { Express, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import { IUserController } from './users/users.controller.interface';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './db/prisma.service';

@injectable()
export class App {
	private app: Express;
	private port = 4200;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: IUserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.logger = logger;
		this.exceptionFilter = exceptionFilter;
	}

	private useRoute(path: string, router: Router): void {
		this.app.use(path, router);
	}

	private useMiddleware(): void {
		this.app.use(json());
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoute(this.userController.baseRoute, this.userController.router);
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.logger.log('Сервер запущен на порту ' + this.port);
		this.app.listen(this.port);
	}
}
