import { type Request, type Response, type NextFunction } from 'express'

export const ensureAuthentication = (req: Request, res: Response, next: NextFunction): void => {
	const not_valid = false

	if (not_valid) {
		res.status(401).send({ messsage: 'deu erro' })

		return
	}

	next()
}
