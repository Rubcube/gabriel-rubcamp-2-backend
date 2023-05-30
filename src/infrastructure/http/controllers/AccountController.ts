import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { TransactionMapper } from 'modules/transactions/mappers/TransactionMapper'

import { GetBalanceService } from 'modules/identity/services/GetBalanceService'
import { GetStatementService } from 'modules/transactions/services/GetStatementService'

export class AccountController {
	async getBalance(request: Request, response: Response): Promise<Response> {
		const accountId = request.accountId

		const service = container.resolve(GetBalanceService)

		const result = await service.execute({ accountId })

		if (result.isRight()) {
			return ok(response, { balance: result.value })
		}

		return fail(response, result.value)
	}

	async getStatement(request: Request, response: Response): Promise<Response> {
		const accountId = request.accountId
		const createdSince = request.query.created_since ? String(request.query.created_since) : undefined
		const createdUntil = request.query.created_until ? String(request.query.created_until) : undefined
		const type = request.query.type ? String(request.query.type) : undefined

		const page = request.query.page ? parseInt(Number(request.query.page).toString()) : undefined
		const count = request.query.count ? parseInt(Number(request.query.count).toString()) : undefined

		const service = container.resolve(GetStatementService)

		const result = await service.execute({
			accountId,
			createdSince,
			createdUntil,
			type,
			page,
			count
		})

		if (result.isRight()) {
			return ok(response, { transactions: result.value.map(transaction => TransactionMapper.toDTO(transaction)) })
		}

		return fail(response, result.value)
	}
}
