import request from 'supertest'

import { config } from '../../helpers/config'
import { userMock } from '../../helpers/mocks/userMock'

describe('PATCH /users', () => {
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

	it('should update an user', async () => {
		const newInformationMock = userMock()

		const response = await request(config.url)
			.patch('/users')
			.set('Authorization', mockToken)
			.send({
				name: newInformationMock.name,
				email: newInformationMock.email,
				birthday: newInformationMock.birthday,
				phone: newInformationMock.phone,
				document: newInformationMock.document,
				address: {
					zipcode: newInformationMock.address.zipcode,
					city: newInformationMock.address.city,
					state: newInformationMock.address.state,
					street: newInformationMock.address.street,
					number: newInformationMock.address.number,
					complement: newInformationMock.address.complement,
					neighborhood: newInformationMock.address.neighborhood
				}
			})

		expect(response.status).toBe(200)
		expect(response.body).toMatchObject({
			name: newInformationMock.name,
			email: newInformationMock.email,
			birthday: newInformationMock.birthday,
			phone: newInformationMock.phone,
			document: mock.document,
			address: {
				zipcode: newInformationMock.address.zipcode,
				city: newInformationMock.address.city,
				state: newInformationMock.address.state,
				street: newInformationMock.address.street,
				number: newInformationMock.address.number,
				complement: newInformationMock.address.complement,
				neighborhood: newInformationMock.address.neighborhood
			}
		})
	})

	it('should not update an user with wrong informations', async () => {
		const response = await request(config.url).patch('/users').set('Authorization', mockToken).send({
			name: 'W',
			email: 'W',
			birthday: 'W',
			phone: 'W'
		})

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject({
			code: 'INVALID_PARAMETER',
			message: 'Parâmetro inválido passado',
			violations: [
				{ code: 'BAD_LENGTH', field: 'name', value: 'W' },
				{ code: 'INVALID_EMAIL', field: 'email', value: 'W' },
				{ code: 'INVALID_BIRTHDAY', field: 'birthday', value: 'W' },
				{ code: 'REQUIRED', field: 'phone.country_code' },
				{ code: 'REQUIRED', field: 'phone.area_code' },
				{ code: 'REQUIRED', field: 'phone.number' },
				{ code: 'REQUIRED', field: 'address.zipcode' },
				{ code: 'REQUIRED', field: 'address.city' },
				{ code: 'REQUIRED', field: 'address.state' },
				{ code: 'REQUIRED', field: 'address.street' },
				{ code: 'REQUIRED', field: 'address.number' },
				{ code: 'REQUIRED', field: 'address.complement' },
				{ code: 'REQUIRED', field: 'address.neighborhood' }
			]
		})
	})
})
