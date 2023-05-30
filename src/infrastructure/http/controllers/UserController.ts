import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { UserMapper } from 'modules/identity/mappers/UserMapper'
import { UpdateUserService } from 'modules/identity/services/UpdateUserService'

export class UserController {
	async update(request: Request, response: Response): Promise<Response> {
		const userId = request.userId
		const { name, email, birthday, document } = request.body
		const phone = Object(request.body.phone)
		const address = Object(request.body.address)

		const service = container.resolve(UpdateUserService)

		const result = await service.execute({
			id: userId,
			name,
			email,
			birthday,
			phone,
			document,
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
			return ok(response, UserMapper.toDTO(result.value))
		}

		return fail(response, result.value)
	}
}
