import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail, tooMany } from 'common/utils/httpResponseUtil'

import { LoginService } from 'modules/identity/services/LoginService'
import { UpdateUserPasswordService } from 'modules/identity/services/UpdateUserPasswordService'
import { ResetPasswordService } from 'modules/identity/services/ResetPasswordService'
import { SendForgotPasswordEmailService } from 'modules/identity/services/SendForgotPasswordEmailService'
import { SendVerificationCodeService } from 'modules/identity/services/SendVerificationCodeService'
import { CheckVerificationCodeService } from 'modules/identity/services/CheckVerificationCodeService'
import { MaxVerificationAttemptsError } from 'common/errors/MaxVerificationAttemptsError'
import moment from 'moment'

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

	async resetPassword(request: Request, response: Response): Promise<Response> {
		const { password } = request.body
		const { token } = request.params

		const service = container.resolve(ResetPasswordService)

		const result = await service.execute({ token, password })

		if (result.isRight()) {
			return ok(response)
		}

		return fail(response, result.value)
	}

	async initForgotPassword(request: Request, response: Response): Promise<Response> {
		const { document } = request.params

		const service = container.resolve(SendForgotPasswordEmailService)

		const result = await service.execute({ document })

		if (result.isRight()) {
			return ok(response)
		}

		return fail(response, result.value)
	}

	async sendVerificationCode(request: Request, response: Response): Promise<Response> {
		const userId = request.userId
		const { channel } = request.body

		const service = container.resolve(SendVerificationCodeService)

		const result = await service.execute({ userId, channel })

		if (result.isRight()) {
			return ok(response)
		}

		if (result.value instanceof MaxVerificationAttemptsError) {
			response.set('X-RateLimit-Limit', moment(result.value.retryAfter).unix().toString())

			return tooMany(response, result.value)
		}

		return fail(response, result.value)
	}

	async checkVerificationCode(request: Request, response: Response): Promise<Response> {
		const userId = request.userId
		const { code, channel } = request.body

		const service = container.resolve(CheckVerificationCodeService)

		const result = await service.execute({ userId, code, channel })

		if (result.isRight()) {
			return ok(response)
		}

		return fail(response, result.value)
	}
}
