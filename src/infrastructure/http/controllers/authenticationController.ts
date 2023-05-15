import { container } from 'tsyringe'
import { Request, Response } from 'express'

import { AuthenticateService } from 'modules/users/service/AuthenticateService'

export const authenticateController = {
	async create(request: Request, response: Response): Promise<void> {
		const { document, password } = request.body

		const service = container.resolve(AuthenticateService)

		const result = await service.execute({
			document,
			password
		})

		if (result.isRight()) {
			response.status(201).json({ token: result.value.token })

			return
		}

		response.status(400).send(result.value)
	}
}
