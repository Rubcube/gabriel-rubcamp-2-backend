import { type Violation } from 'src/common/seedword/domain/Violation'
import { AppError } from 'src/common/seedword/errors/AppError'
import { AppErrorCodes } from 'src/common/seedword/errors/AppErrorCodes'

export class InternalError extends AppError {
	constructor(violations?: Violation[]) {
		super({
			code: AppErrorCodes.INTERNAL_ERROR,
			message: 'Erro interno no servidor',
			violations
		})
	}
}
