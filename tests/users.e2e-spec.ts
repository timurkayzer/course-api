import request from 'supertest';
import { boot } from '../src';
import { App } from '../src/app';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register already registered user', async () => {
		const res = await request(application.server)
			.post('/users/register')
			.send({ email: 'timurkayzer@gmail.com', password: '12345', name: 'T K' });

		expect(res.statusCode).toBe(422);
	});

	it('Login unsuccessfully', async () => {
		const res = await request(application.server)
			.post('/users/login')
			.send({ email: 'timurkayzer@gmail.com', password: 'lol12345' });

		expect(res.statusCode).toBe(401);
	});

	let token: string;

	it('Login successfully', async () => {
		const res = await request(application.server)
			.post('/users/login')
			.send({ email: 'timurkayzer@gmail.com', password: 'lol123' });

		expect(res.statusCode).toBe(200);
		token = res.body.token;
	});

	it('Info successfully', async () => {
		const res = await request(application.server)
			.get('/users/info')
			.set('Authorization', 'Bearer ' + token);

		expect(res.statusCode).toBe(200);
	});
});

afterAll(() => {
	application.shutdown();
});
