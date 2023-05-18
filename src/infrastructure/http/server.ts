import express, { Request, NextFunction, Response } from 'express'
import { DateTime } from 'luxon'
import 'express-async-errors'
import 'reflect-metadata'
import 'common/container'

import { onboardingRouter } from './routes/onboardingRouter'
import { authRouter } from './routes/authRouter'
import { accountRouter } from './routes/accountRouter'
import { internalTransferRouter } from './routes/internalTransferRouter'
import { profileRouter } from './routes/profileRouter'

import { fail } from 'common/utils/httpResponseUtil'
import { InternalError } from 'common/errors/InternalError'
import { NotFoundError } from 'common/errors/NotFoundError'

DateTime.local().setZone('America/Sao_Paulo')
const app = express()

app.use(express.json())

app.get('/health_check', (_, response) => response.send('Hello World!'))
app.use('/onboarding', onboardingRouter)
app.use('/auth', authRouter)
app.use('/accounts', accountRouter)
app.use('/internal_transfers', internalTransferRouter)
app.use('/profile', profileRouter)

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

export { app }
