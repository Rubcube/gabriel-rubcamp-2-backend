import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class ClosedAccountError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.CLOSED_ACOUNT,
			message: 'Conta fechada'
		})
	}
}
