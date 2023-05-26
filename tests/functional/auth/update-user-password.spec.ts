import request from 'supertest'

import { config } from '../../helpers/config'
import { userMock } from '../../helpers/mocks/userMock'
import { generatePassword } from '../../helpers/generatePassword'

describe('PATCH /auth/password', () => {
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

	it('should update the user password', async () => {
		const response = await request(config.url).patch('/auth/password').set('Authorization', mockToken).send({
			old_password: mock.password,
			password: generatePassword()
		})

		expect(response.status).toBe(200)
		expect(response.body).toBeFalsy()
	})

	it('should not update the user password with wrong old password', async () => {
		const response = await request(config.url).patch('/auth/password').set('Authorization', mockToken).send({
			old_password: '123',
			password: generatePassword()
		})

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			code: 'INVALID_PARAMETER',
			message: 'Parâmetro inválido passado',
			violations: [{ code: 'WRONG_OLD_PASSWORD', field: 'old_password' }]
		})
	})
})
