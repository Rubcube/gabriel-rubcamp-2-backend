import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { GetBalanceService } from 'modules/identity/service/GetBalanceService'
import { GetStatementService } from 'modules/transactions/services/GetStatementService'

export class AccountController {
	async getBalance(request: Request, response: Response): Promise<Response> {
		const { account_id } = request.params

		const service = container.resolve(GetBalanceService)

		const result = await service.execute({ account_id })

		if (result.isRight()) {
			return ok(response, { balance: result.value })
		}

		return fail(response, result.value)
	}

	async getStatement(request: Request, response: Response): Promise<Response> {
		const { account_id } = request.params

		const service = container.resolve(GetStatementService)

		const result = await service.execute({ accountId: account_id })

		if (result.isRight()) {
			return ok(response, result.value)
		}

		return fail(response, result.value)
	}
}
