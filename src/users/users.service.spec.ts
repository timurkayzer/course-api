import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const configServiceMock: IConfigService = {
	get: jest.fn(),
};

const usersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userService: IUserService;
let usersRepository: IUsersRepository;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(usersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('UserService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValue('1');

		usersRepository.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: 'timurkayzer@gmail.com',
			name: 'Timur Kaiser',
			password: '12345',
		});

		expect(createdUser?.email).toEqual('timurkayzer@gmail.com');
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('12345');
	});

	it('validateUser - valid user', async () => {
		const validatedUser = {
			email: 'timurkayzer@gmail.com',
			password: '12345',
			name: 'Timur Kaiser',
		};

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const validUser = await userService.validateUser(validatedUser);
		expect(validUser).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		const validatedUser = {
			email: 'timurkayzer@gmail.com',
			password: '1234',
			name: 'Timur Kaiser',
		};

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const validUser = await userService.validateUser(validatedUser);
		expect(validUser).toBeFalsy();
	});

	it('validateUser - missing user', async () => {
		const validatedUser = {
			email: 'timurkayzer@gmail.com',
			password: '12345',
			name: 'Timur Kaiser',
		};

		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const validUser = await userService.validateUser(validatedUser);
		expect(validUser).toBeFalsy();
	});
});
