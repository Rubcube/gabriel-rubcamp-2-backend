import prisma from 'infrastructure/prisma/client'
import request from 'supertest'

import { config } from '../config'
import { userMock } from '../mocks/userMock'

export async function userSeed(user: ReturnType<typeof userMock>): Promise<{ token: string; accountId: string }> {
	try {
		const onboardingResult = await request(config.url).post('/onboarding').send(user)

		if (onboardingResult.status !== 201) throw new Error('userSeed: onboarding error' + String(onboardingResult.body))

		const authResult = await request(config.url)
			.post('/auth/login')
			.send({ document: user.document, password: user.password })

		if (authResult.status !== 200) throw new Error('userSeed: authentication error' + String(authResult.body))

		const accountResult = await prisma.user.findUnique({
			where: {
				document: user.document
			},
			select: {
				account: true
			}
		})

		if (!accountResult?.account) throw new Error('userSeed: not found user' + String(accountResult?.account))

		return {
			token: authResult.body.token,
			accountId: accountResult.account.id
		}
	} catch (error) {
		throw new Error(String(error))
	}
}

export async function accountBalanceSeed(accountId: string, balance: number): Promise<void> {
	try {
		await prisma.account.update({
			data: {
				balance
			},
			where: {
				id: accountId
			}
		})
	} catch (error) {
		throw new Error(String(error))
	}
}
