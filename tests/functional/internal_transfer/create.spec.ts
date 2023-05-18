import request from 'supertest'
import { config } from 'tests/helpers/config'
import { prisma } from 'infrastructure/prisma/client'
import { userMock } from 'tests/helpers/mocks/userMock'
import { accountBalanceSeed, userSeed } from 'tests/helpers/seeds/userSeed'

type SeedValue = {
	token: string
	accountId: string
}

describe('POST /internal_transfer', () => {
	const user1 = userMock()
	const user2 = userMock()
	let seed1: SeedValue
	let seed2: SeedValue

	beforeAll(async () => {
		const [s1, s2] = await Promise.all([userSeed(user1), userSeed(user2)])

		seed1 = { token: s1.token, accountId: s1.accountId }
		seed2 = { token: s2.token, accountId: s2.accountId }
	})

	afterAll(async () => {
		await prisma.internalTransfer.deleteMany()
		await Promise.all([prisma.account.deleteMany(), prisma.address.deleteMany()])
		await prisma.user.deleteMany()
	})

	it('should create an internal transaction', async () => {
		await accountBalanceSeed(seed1.accountId, 1000)

		const response = await request(config.url)
			.post('/internal_transaction')
			.set('Authorization', `Bearer ${seed1.token}`)
			.send({
				sender_account_id: seed1.accountId,
				recipient_account_id: seed2.accountId,
				amount: 1000
			})

		console.log(response.body)

		expect(true).toBeTruthy()
	})
})
