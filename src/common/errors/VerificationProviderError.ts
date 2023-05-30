import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export class VerificationProviderError extends AppError {
	constructor() {
		super({
			code: AppErrorCodes.VERIFICATION_PROVIDER_ERROR,
			message: 'Erro no provedor de códigos de verificação'
		})
	}
}
