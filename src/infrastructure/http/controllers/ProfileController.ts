import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { GetProfileService } from 'modules/identity/service/GetProfileService'
import { UserMapper } from 'modules/identity/mappers/UserMapper'
import { AccountMapper } from 'modules/identity/mappers/AccountMapper'

export class ProfileController {
	async get(request: Request, response: Response): Promise<Response> {
		const { user_id } = request.params

		const service = container.resolve(GetProfileService)

		const result = await service.execute({ user_id })

		if (result.isRight()) {
			return ok(response, {
				user: UserMapper.toDTO(result.value.user),
				account: AccountMapper.toDTO(result.value.account)
			})
		}

		return fail(response, result.value)
	}
}
