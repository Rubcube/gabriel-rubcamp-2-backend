import { type Violation } from 'src/common/seedword/domain/Violation'
import { AppError } from 'src/common/seedword/errors/AppError'
import { AppErrorCodes } from 'src/common/seedword/errors/AppErrorCodes'

export class InvalidParameterError extends AppError {
	constructor(violations?: Violation[]) {
		super({
			code: AppErrorCodes.INVALID_PARAMETER,
			message: 'Parâmetro inválido passado',
			violations
		})
	}
}
