import { Violation } from '../domain/Violation'
import { AppErrorCodes } from './AppErrorCodes'

type AppErrorProperties = {
	code: AppErrorCodes
	message: string
	violations?: Violation[]
}

export abstract class AppError {
	code: AppErrorCodes
	message: string
	violations?: Violation[]

	constructor(properties: AppErrorProperties) {
		this.code = properties.code
		this.message = properties.message
		this.violations = properties.violations
	}
}
