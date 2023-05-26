import request from 'supertest'

import { config } from '../../helpers/config'
import { userMock } from '../../helpers/mocks/userMock'

describe('GET /auth/login', () => {
	const mock = userMock()

	beforeAll(async () => {
		await request(config.url).post('/onboarding').send(mock)
	})

	it('should login an user', async () => {
		const response = await request(config.url).post('/auth/login').send({
			document: mock.document,
			password: mock.password
		})

		expect(response.status).toBe(200)
		expect(response.body.token).toBeTruthy()
	})

	it('should not login a not existed user', async () => {
		const response = await request(config.url).post('/auth/login').send({
			document: '50897941039',
			password: 'mock.password!aA1'
		})

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			code: 'INVALID_PARAMETER',
			message: 'Parâmetro inválido passado'
		})
	})
})
