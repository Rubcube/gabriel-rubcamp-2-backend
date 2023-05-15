import { Violation } from 'src/common/seedword/domain/Violation'
import { AppErrorCodes } from 'src/common/seedword/errors/AppErrorCodes'

export type HTTPError = {
	code: AppErrorCodes
	message: string
	violations?: Violation[]
}
