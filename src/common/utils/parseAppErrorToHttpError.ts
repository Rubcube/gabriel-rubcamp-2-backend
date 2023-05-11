import { type AppError } from 'common/seedword/errors/AppError'
import { type HTTPError } from 'infrastructure/http/error'

export function parseAppErrorToHTTPError(appError: AppError): HTTPError {
	return {
		code: appError.code,
		message: appError.message,
		violations: appError.violations?.map(value => {
			return {
				code: value.code,
				field: value.field,
				message: value.message,
				value: value.value
			}
		})
	}
}