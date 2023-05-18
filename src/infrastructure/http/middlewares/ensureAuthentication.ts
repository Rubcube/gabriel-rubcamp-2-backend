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

		const payload = await tokenProvider.decodeToken(token)

		request.userId = payload.subject
		request.accountId = payload.account_id
	} catch {
		response.status(403).send()

		return
	}

	next()
}
