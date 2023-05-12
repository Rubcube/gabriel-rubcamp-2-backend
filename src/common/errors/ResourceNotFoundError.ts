import { AppError } from 'src/common/seedword/errors/AppError'
import { AppErrorCodes } from 'src/common/seedword/errors/AppErrorCodes'

export class ResourceNotFound extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.RESOURCE_NOT_FOUND,
			message: 'Recurso não encontrado'
		})
	}
}
