import { container } from 'tsyringe'
import { Request, Response } from 'express'

import { CreateOnboardingService } from 'modules/users/service/OnboardingService'

export const onboardingController = {
	async create(request: Request, response: Response): Promise<void> {
		const { name, email, birthday, document, password, transactional_password } = request.body
		const phone = Object(request.body.phone)
		const address = Object(request.body.address)

		const service = container.resolve(CreateOnboardingService)

		const result = await service.execute({
			name,
			email,
			birthday,
			phone,
			document,
			password,
			transactional_password,
			address: {
				zipcode: address.zipcode,
				city: address.city,
				state: address.state,
				street: address.street,
				number: address.number,
				complement: address.complement,
				neighborhood: address.neighborhood
			}
		})

		if (result.isRight()) {
			response.status(201).send()

			return
		}

		response.status(400).send(result.value)
	}
}
