import request from 'supertest'
import moment from 'moment'

import { config } from 'tests/helpers/config'
import { userMock } from 'tests/helpers/mocks/userMock'
import { accountBalanceSeed, userSeed } from 'tests/helpers/seeds/userSeed'

type SeedValue = {
	token: string
	accountId: string
}

describe('POST /internal_transfers', () => {
	const user1 = userMock()
	const user2 = userMock()
	let seed1: SeedValue
	let seed2: SeedValue

	beforeAll(async () => {
		const s1 = await userSeed(user1)
		const s2 = await userSeed(user2)

		seed1 = { token: s1.token, accountId: s1.accountId }
		seed2 = { token: s2.token, accountId: s2.accountId }
	})

	it('should create an internal transfer', async () => {
		await accountBalanceSeed(seed1.accountId, 10000)

		const response = await request(config.url)
			.post('/internal_transfers')
			.set('Authorization', `Bearer ${seed1.token}`)
			.send({
				recipient_account_id: seed2.accountId,
				transactional_password: user1.transactional_password,
				amount: 980
			})

		expect(response.status).toBe(201)
		expect(response.body).toMatchObject({
			id: expect.any(String),
			sender_account_id: seed1.accountId,
			recipient_account_id: seed2.accountId,
			amount: 980,
			status: 'COMPLETED',
			scheduled_to: null
		})
	})

	it('should create a scheduled internal transfer', async () => {
		await accountBalanceSeed(seed1.accountId, 10000)

		const response = await request(config.url)
			.post('/internal_transfers')
			.set('Authorization', `Bearer ${seed1.token}`)
			.send({
				recipient_account_id: seed2.accountId,
				transactional_password: user1.transactional_password,
				scheduled_to: moment().add(2, 'day').format('YYYY-MM-DD'),
				amount: 980
			})

		expect(response.status).toBe(201)
		expect(response.body).toMatchObject({
			id: expect.any(String),
			sender_account_id: seed1.accountId,
			recipient_account_id: seed2.accountId,
			amount: 980,
			status: 'SCHEDULED',
			scheduled_to: moment().add(2, 'day').format('YYYY-MM-DD')
		})
	})
})
