import express, { type Request, type NextFunction, type Response } from 'express'
import 'express-async-errors'

import { DateTime } from 'luxon'

import { onboardingRouter } from './routes/onboardingRouter'
import { authRouter } from './routes/authRouter'
import { InternalError } from 'common/errors/InternalError'
import { fail } from 'common/utils/httpResponseUtil'

const app = express()
DateTime.local().setZone('America/Sao_Paulo')

app.use(express.json())

app.get('/health_check', (_, response) => response.send('Hello World!'))
app.use('/onboarding', onboardingRouter)
app.use('/auth', authRouter)

app.use((error: any, _request: Request, response: Response, _next: NextFunction): Response => {
	console.log('>>> ERROR HANDLER:', error)

	return fail(response, new InternalError())
})

app.listen(process.env.PORT ?? 3344, () => {
	console.log('Application initialized')
})