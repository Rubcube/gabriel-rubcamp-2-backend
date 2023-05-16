import { container } from 'tsyringe'
import { Request, Response } from 'express'

import { LoginService } from 'modules/users/service/LoginService'
import { created, fail } from 'common/utils/httpResponseUtil'

export class AuthenticateController {
	async create(request: Request, response: Response): Promise<Response> {
		const { document, password } = request.body

		const service = container.resolve(LoginService)

		const result = await service.execute({
			document,
			password
		})

		if (result.isRight()) {
			return created(response, { token: result.value.token })
		}

		return fail(response, result.value)
	}
}
