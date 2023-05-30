import supertest from 'supertest'

import { config } from './tests/helpers/config'
import prisma from './src/infrastructure/prisma/client'

export default async () => {
	try {
		await prisma.$queryRaw`SELECT 1`

		const response = await supertest(config.url).get('/health_check')

		if (response.status !== 200) {
			throw new Error('Bad health check')
		}
	} catch (error) {
		console.error(error)
	}
}
