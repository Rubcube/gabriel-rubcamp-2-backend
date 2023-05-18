import { prisma } from 'infrastructure/prisma/client'
import request from 'supertest'
import { config } from '../config'
import { userMock } from '../mocks/userMock'

export async function userSeed(user: ReturnType<typeof userMock>): Promise<{ token: string; accountId: string }> {
	await request(config.url).post('/onboarding').send(user)

	const authResult = await request(config.url)
		.post('/auth/login')
		.send({ document: user.document, password: user.password })

	const accountResult = await prisma.user.findUnique({
		where: {
			document: user.document
		},
		select: {
			account: {
				select: {
					id: true
				}
			}
		}
	})

	if (!accountResult?.account) throw new Error('userSeed: not found user')

	return {
		token: authResult.body.token,
		accountId: accountResult.account.id
	}
}

export async function accountBalanceSeed(accountId: string, balance: number): Promise<void> {
	await prisma.account.update({
		data: {
			balance
		},
		where: {
			id: accountId
		}
	})
}
