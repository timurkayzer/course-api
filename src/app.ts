import express, { Express, Router } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import { IUserController } from './users/users.controller.interface';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './db/prisma.service';
import { JwtMiddleware } from './common/jwt.middleware';

@injectable()
export class App {
	private app: Express;
	server: Server;
	private port = 4200;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: IUserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.logger = logger;
		this.exceptionFilter = exceptionFilter;
	}

	private useRoute(path: string, router: Router): void {
		this.app.use(path, router);
	}

	private useMiddleware(): void {
		const jwtMiddleware = new JwtMiddleware(this.configService.get<string>('JWT_SECRET'));
		this.app.use(json());
		this.app.use(jwtMiddleware.execute.bind(jwtMiddleware));
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
		this.server = this.app.listen(this.port);
	}

	public shutdown(): void {
		this.server.close(() => {
			this.logger.log('Сервер завершил работу');
		});
	}
}
