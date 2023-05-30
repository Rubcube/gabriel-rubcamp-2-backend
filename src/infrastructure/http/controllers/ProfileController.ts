import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { GetProfileService } from 'modules/identity/services/GetProfileService'
import { UserMapper } from 'modules/identity/mappers/UserMapper'
import { AccountMapper } from 'modules/identity/mappers/AccountMapper'

export class ProfileController {
	async get(request: Request, response: Response): Promise<Response> {
		const userId = request.userId

		const service = container.resolve(GetProfileService)

		const result = await service.execute({ userId })

		if (result.isRight()) {
			return ok(response, {
				user: UserMapper.toDTO(result.value.user),
				account: AccountMapper.toDTO(result.value.account)
			})
		}

		return fail(response, result.value)
	}
}
