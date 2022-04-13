import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	public client: PrismaClient;

	constructor(@inject(TYPES.Logger) private loggerService: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('Подключено к базе данных');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error('Ошибка подключения к БД:', e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.loggerService.log('Отключено от базы данных');
	}
}
