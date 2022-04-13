import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

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

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const userModel = await this.usersRepository.find(email);

		if (userModel) {
			const user = new User(userModel.email, userModel.name, userModel.password);
			return await user.checkPassword(password);
		}

		return false;
	}
}
