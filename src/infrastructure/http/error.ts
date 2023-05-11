import { type Violation } from 'common/seedword/domain/Violation'
import { type AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

export interface HTTPError {
	code: AppErrorCodes
	message: string
	violations?: Violation[]
}
