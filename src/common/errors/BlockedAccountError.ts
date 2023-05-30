import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class BlockedAccountError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.BLOCKED_ACCOUNT,
			message: 'Conta bloqueada pelo sistema'
		})
	}
}
