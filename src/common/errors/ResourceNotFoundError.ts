import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class ResourceNotFound extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.RESOURCE_NOT_FOUND,
			message: 'Recurso não encontrado'
		})
	}
}
