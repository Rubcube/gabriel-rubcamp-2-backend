import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { LoginService } from 'modules/identity/service/LoginService'
import { UpdateUserPasswordService } from 'modules/identity/service/UpdateUserPasswordService'

export class AuthenticateController {
	async create(request: Request, response: Response): Promise<Response> {
		const { document, password } = request.body

		const service = container.resolve(LoginService)

		const result = await service.execute({
			document,
			password
		})

		if (result.isRight()) {
			return ok(response, { token: result.value.token })
		}

		return fail(response, result.value)
	}

	async updatePassword(request: Request, response: Response): Promise<Response> {
		const userId = request.userId
		const oldPassword = request.body.old_password
		const password = request.body.password

		const service = container.resolve(UpdateUserPasswordService)

		const result = await service.execute({
			userId,
			oldPassword,
			password
		})

		if (result.isRight()) {
			return ok(response)
		}

		return fail(response, result.value)
	}
}
