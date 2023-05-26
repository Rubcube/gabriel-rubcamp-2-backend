import request from 'supertest'

import { config } from '../../helpers/config'
import { userMock } from '../../helpers/mocks/userMock'

describe('GET /profiles', () => {
	const mock = userMock()
	let mockToken: string

	beforeAll(async () => {
		await request(config.url).post('/onboarding').send(mock)

		const response = await request(config.url).post('/auth/login').send({
			document: mock.document,
			password: mock.password
		})

		mockToken = `Bearer ${String(response.body.token)}`
	})

	it('should retrive the user profile', async () => {
		const response = await request(config.url).get('/profiles').set('Authorization', mockToken).send()

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			user: expect.objectContaining({
				name: mock.name,
				email: mock.email,
				birthday: mock.birthday,
				phone: mock.phone,
				document: mock.document,
				address: expect.objectContaining(mock.address)
			}),
			account: expect.objectContaining({
				balance: 0,
				status: 'OPEN',
				closed_at: null,
				blocked_at: null
			})
		})
	})
})
