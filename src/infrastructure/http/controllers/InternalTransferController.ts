import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { fail, created, ok } from 'common/utils/httpResponseUtil'

import { InternalTransferMapper } from 'modules/transactions/mappers/InternalTransferMapper'

import { GetInternalTransferService } from 'modules/transactions/services/GetInternalTransferService'
import { CreateInternalTransferService } from 'modules/transactions/services/CreateInternalTransferService'

export class InternalTransferController {
	async get(request: Request, response: Response): Promise<Response> {
		const requesterAccountId = request.accountId
		const internalTransferId = request.params.internal_transfer_id

		const service = container.resolve(GetInternalTransferService)

		const result = await service.execute({ internalTransferId, requesterAccountId })

		if (result.isRight()) {
			return ok(response, InternalTransferMapper.toDTO(result.value))
		}

		return fail(response, result.value)
	}

	async create(request: Request, response: Response): Promise<Response> {
		const accountId = request.accountId
		const recipientAccountId = request.body.recipient_account_id
		const transactionalPassword = request.body.transactional_password
		const scheduledTo = request.body.scheduled_to
		const amount = request.body.amount

		const service = container.resolve(CreateInternalTransferService)

		const result = await service.execute({
			recipientAccountId,
			senderAccountId: accountId,
			transactionalPassword,
			scheduledTo,
			amount
		})

		if (result.isRight()) {
			return created(response, InternalTransferMapper.toDTO(result.value))
		}

		return fail(response, result.value)
	}
}
