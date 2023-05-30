import { Response } from 'express'
import { AppError } from 'common/seedword/errors/AppError'
import { AppErrorCodes } from 'common/seedword/errors/AppErrorCodes'

import { parseAppErrorToHTTPError } from './parseAppErrorToHttpError'

export function ok(expressResponse: Response, payload?: Record<string, any>): Response {
	return expressResponse.status(200).json(payload)
}

export function created(expressResponse: Response, payload?: Record<string, any>): Response {
	return payload ? expressResponse.status(201).json(payload) : expressResponse.status(201).send()
}

export function tooMany(expressResponse: Response, payload: AppError): Response {
	return payload
		? expressResponse.status(429).json(parseAppErrorToHTTPError(payload))
		: expressResponse.status(429).send()
}

export function fail(expressResponse: Response, payload: AppError): Response {
	switch (payload.code) {
		case AppErrorCodes.RESOURCE_NOT_FOUND:
		case AppErrorCodes.NOT_FOUND:
			return expressResponse.status(404).send(parseAppErrorToHTTPError(payload))
		case AppErrorCodes.INVALID_OPERATION:
		case AppErrorCodes.INVALID_PARAMETER:
			return expressResponse.status(400).send(parseAppErrorToHTTPError(payload))
		case AppErrorCodes.INTERNAL_ERROR:
		default:
			return expressResponse.status(500).send(parseAppErrorToHTTPError(payload))
	}
}
