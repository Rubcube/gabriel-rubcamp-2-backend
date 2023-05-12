import { AppError } from 'src/common/seedword/errors/AppError'
import { AppErrorCodes } from 'src/common/seedword/errors/AppErrorCodes'

export class InvalidOperationError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.INVALID_OPERATION,
			message: 'Operação inválida'
		})
	}
}
