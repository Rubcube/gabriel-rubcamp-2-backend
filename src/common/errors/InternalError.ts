import { type Violation } from 'common/seedword/domain/Violation'
import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class InternalError extends AppError {
	constructor(violations?: Violation[]) {
		super({
			code: AppErrorCodes.INTERNAL_ERROR,
			message: 'Erro interno no servidor',
			violations
		})
	}
}
