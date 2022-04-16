import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { sign } from 'jsonwebtoken';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.usersRepository.find(dto.email);

		if (existedUser) {
			return null;
		} else {
			const user = new User(dto.email, dto.name);
			const salt = this.configService.get<number>('PASSWORD_SALT');
			await user.setPassword(dto.password, Number(salt));
			return await this.usersRepository.create(user);
		}
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		const userModel = await this.usersRepository.find(email);

		if (userModel) {
			return userModel;
		} else {
			return null;
		}
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const userModel = await this.usersRepository.find(email);

		if (userModel) {
			const user = new User(userModel.email, userModel.name, userModel.password);
			return await user.checkPassword(password);
		}

		return false;
	}

	async signToken(email: string): Promise<string | null> {
		const secret = this.configService.get<string>('JWT_SECRET');
		return new Promise<string | null>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(error, token) => {
					if (error) {
						reject(error);
					}
					if (token) {
						resolve(token);
					} else {
						resolve(null);
					}
				},
			);
		});
	}
}
