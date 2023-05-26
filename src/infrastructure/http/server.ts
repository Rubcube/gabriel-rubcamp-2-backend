import express, { Request, NextFunction, Response } from 'express'
import { DateTime } from 'luxon'
import 'express-async-errors'
import 'reflect-metadata'
import 'common/container'

// import client from 'twilio'

import { onboardingRouter } from './routes/onboardingRouter'
import { authRouter } from './routes/authRouter'
import { userRouter } from './routes/userRouter'
import { accountRouter } from './routes/accountRouter'
import { profileRouter } from './routes/profileRouter'
import { internalTransferRouter } from './routes/internalTransferRouter'

import { fail } from 'common/utils/httpResponseUtil'
import { InternalError } from 'common/errors/InternalError'
import { NotFoundError } from 'common/errors/NotFoundError'

DateTime.local().setZone('America/Sao_Paulo')
const app = express()

app.use(express.json())

app.get('/health_check', (_, response) => response.status(200).send('Hello World!'))
app.use('/onboarding', onboardingRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/accounts', accountRouter)
app.use('/profiles', profileRouter)
app.use('/internal_transfers', internalTransferRouter)

app.use('*', (_, response) => {
	return fail(response, new NotFoundError())
})

app.use((error: any, _request: Request, response: Response, _next: NextFunction): Response => {
	console.log('>>> ERROR HANDLER:', error)
	return fail(response, new InternalError())
})

app.listen(process.env.PORT ?? 3344, () => {
	console.log('Application initialized')
})

// async function go() {
// 	try {
// 		const a = await client('AC4c87f783befe74fdcd9110cabd2522ac', 'd16462054050a96d81c7e5fd59dfc385')
// 			.verify.v2.services('VA946c2b9eb7832fde2d2a25c5d8f4e803')
// 			.verifications.create({
// 				to: 'ogabrielribeirof@gmail.com',
// 				channel: 'email',
// 				channelConfiguration: {
// 					substitutions: {
// 						name: 'Amanda'
// 					}
// 				}
// 			})

// 		console.log(a.status)
// 	} catch (error) {
// 		console.error(error)
// 	}
// }
// go()

export { app }
