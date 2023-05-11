import { type Response } from 'express'
import { type AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

import { parseAppErrorToHTTPError } from './parseAppErrorToHttpError'

export function ok(expressResponse: Response, payload?: Record<string, any>): Response {
	return expressResponse.status(200).json(payload)
}

export function fail(expressResponse: Response, payload: AppError): Response {
	switch (payload.code) {
		case AppErrorCodes.NOT_FOUND:
			return expressResponse.status(404).send(parseAppErrorToHTTPError(payload))
		case AppErrorCodes.INVALID_PARAMETER:
			return expressResponse.status(400).send(parseAppErrorToHTTPError(payload))
		case AppErrorCodes.INTERNAL_ERROR:
		default:
			return expressResponse.status(500).send(parseAppErrorToHTTPError(payload))
	}
}
