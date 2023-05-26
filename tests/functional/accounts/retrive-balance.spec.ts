import request from 'supertest'

import { config } from '../../helpers/config'
import { userMock } from '../../helpers/mocks/userMock'

describe('GET /accounts/balance', () => {
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

	it('should retrive the user account balance', async () => {
		const response = await request(config.url).get('/accounts/balance').set('Authorization', mockToken).send()

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({ balance: 0 })
	})
})
