import request from 'supertest'
import { config } from '../../helpers/config'

import { userMock } from '../../helpers/mocks/userMock'
import { prisma } from 'infrastructure/prisma/client'

describe('POST /onboarding', () => {
	afterEach(async () => {
		await Promise.all([prisma.account.deleteMany(), prisma.address.deleteMany()])

		await prisma.user.deleteMany()
	})

	it('should create onboarding with valid data', async () => {
		const mock = userMock()

		const response = await request(config.url)
			.post('/onboarding')
			.send({
				name: mock.name,
				email: mock.email,
				birthday: mock.birthday,
				phone: {
					country_code: mock.phone.country_code,
					area_code: mock.phone.area_code,
					number: mock.phone.number
				},
				document: mock.document,
				password: mock.password,
				transactional_password: mock.transactional_password,
				address: {
					zipcode: '123',
					city: 'Presidente Prudente',
					state: 'SP',
					street: 'Eufrásio Toledo',
					number: '33',
					complement: '',
					neighborhood: 'Jardim Marupiara'
				}
			})

		expect(response.status).toBe(201)
	})

	it('should not create with pending data', async () => {
		const response = await request(config.url).post('/onboarding').send()

		expect(response.body).toMatchObject({
			code: 'INVALID_PARAMETER',
			message: 'Parâmetro inválido passado',
			violations: expect.arrayContaining([
				{
					code: 'REQUIRED',
					field: 'name'
				},
				{
					code: 'REQUIRED',
					field: 'email'
				},
				{
					code: 'REQUIRED',
					field: 'birthday'
				},
				{
					code: 'REQUIRED',
					field: 'phone.country_code'
				},
				{
					code: 'REQUIRED',
					field: 'phone.area_code'
				},
				{
					code: 'REQUIRED',
					field: 'phone.number'
				},
				{
					code: 'REQUIRED',
					field: 'document'
				},
				{
					code: 'REQUIRED',
					field: 'password'
				},
				{
					code: 'REQUIRED',
					field: 'transactional_password'
				},
				{
					code: 'REQUIRED',
					field: 'address.zipcode'
				},
				{
					code: 'REQUIRED',
					field: 'address.city'
				},
				{
					code: 'REQUIRED',
					field: 'address.state'
				},
				{
					code: 'REQUIRED',
					field: 'address.street'
				},
				{
					code: 'REQUIRED',
					field: 'address.number'
				},
				{
					code: 'REQUIRED',
					field: 'address.complement'
				},
				{
					code: 'REQUIRED',
					field: 'address.neighborhood'
				}
			])
		})
		expect(response.status).toBe(400)
	})
})
