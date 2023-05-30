import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class LockedAccountError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.LOCKED_ACCOUNT,
			message: 'Conta bloqueada'
		})
	}
}
