import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверно указана почта' })
	email: string;
	@IsString({ message: 'Неверно указан пароль' })
	password: string;
	@IsString({ message: 'Неверно указано имя' })
	name: string;
}
