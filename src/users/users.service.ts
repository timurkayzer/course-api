import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const user = new User(dto.email, dto.name);
		await user.setPassword(dto.password, this.configService.get<number>('PASSWORD_SALT'));
		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return false;
	}
}
