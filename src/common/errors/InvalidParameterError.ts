import { Violation } from 'common/seedword/domain/Violation'
import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class InvalidParameterError extends AppError {
	constructor(violations?: Violation[]) {
		super({
			code: AppErrorCodes.INVALID_PARAMETER,
			message: 'Parâmetro inválido passado',
			violations
		})
	}
}
