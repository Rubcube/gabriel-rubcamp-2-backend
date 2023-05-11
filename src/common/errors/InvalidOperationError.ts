import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class InvalidOperationError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.INVALID_OPERATION,
			message: 'Operação inválida'
		})
	}
}
