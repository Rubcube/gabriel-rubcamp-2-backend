import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class InsufficientFundsError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.INSUFFICIENT_FUNDS,
			message: 'Fundos insuficientes'
		})
	}
}
