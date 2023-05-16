import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class NotFoundError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.NOT_FOUND,
			message: 'Rota não registrada'
		})
	}
}
