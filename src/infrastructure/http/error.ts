import { Violation } from 'common/seedword/domain/Violation'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export type HTTPError = {
	code: AppErrorCodes
	message: string
	violations?: Violation[]
}
