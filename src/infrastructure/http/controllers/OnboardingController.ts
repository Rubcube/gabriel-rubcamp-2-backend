import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { created, fail } from 'common/utils/httpResponseUtil'

import { CreateOnboardingService } from 'modules/identity/service/OnboardingService'

export class OnboardingController {
	async create(request: Request, response: Response): Promise<Response> {
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
			return created(response)
		}

		return fail(response, result.value)
	}
}
