import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указана почта' })
	email: string;
	@IsString({ message: 'Неверно указан пароль' })
	password: string;
}
