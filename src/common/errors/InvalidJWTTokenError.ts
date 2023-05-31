import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class InvalidJWTTokenError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.INVALID_JWT_TOKEN,
			message: 'JWT Token inválido'
		})
	}
}
