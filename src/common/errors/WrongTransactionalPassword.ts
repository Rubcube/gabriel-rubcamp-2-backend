import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class WrongTransactionalPasswordError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.WRONG_TRANSACTIONAL_PASSWORD,
			message: 'Senha transacional incorreta'
		})
	}
}
