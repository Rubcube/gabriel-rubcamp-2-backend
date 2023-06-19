import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { TokenProvider } from 'common/providers/token/implementations/TokenProvider'

export const ensureAuthentication = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
	const { authorization } = request.headers

	if (!authorization) {
		response.status(401).send()

		return
	}

	const [, token] = authorization.split(' ')

	try {
		const tokenProvider = container.resolve<TokenProvider>('TokenProvider')

		const payload = tokenProvider.decodeAuthToken(token)

		if (payload.isLeft()) {
			response.status(401).send(payload.value)

			return
		}

		request.userId = payload.value.subject
		request.accountId = payload.value.account_id
	} catch {
		response.status(403).send()

		return
	}

	next()
}
