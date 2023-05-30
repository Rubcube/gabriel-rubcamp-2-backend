import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class MaxVerificationAttemptsError extends AppError {
	private readonly _retryAfter: Date

	constructor(retryAfter: Date) {
		super({
			code: AppErrorCodes.MAX_VERIFICATION_ATTEMPTS_ERROR,
			message: `Muitas requisições de código de verificação`
		})

		this._retryAfter = retryAfter
	}

	get retryAfter(): Date {
		return this._retryAfter
	}
}
