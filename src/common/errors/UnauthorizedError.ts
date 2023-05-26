import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class UnauthorizedError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.UNAUTHORIZED,
			message: 'Falta de permissão para performar essa ação'
		})
	}
}
