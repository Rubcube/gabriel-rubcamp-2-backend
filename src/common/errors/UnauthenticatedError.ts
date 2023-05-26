import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class UnauthenticatedError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.UNAUTHENTICATED,
			message: 'Forneça um token válido e tente novamente'
		})
	}
}
