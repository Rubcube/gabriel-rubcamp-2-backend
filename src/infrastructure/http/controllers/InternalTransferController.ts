import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { ok, fail } from 'common/utils/httpResponseUtil'

import { CreateInternalTransferService } from 'modules/transactions/services/CreateInternalTransferService'
import { InternalTransferMapper } from 'modules/transactions/mappers/InternalTransferMapper'

export class InternalTransferController {
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
			return ok(response, InternalTransferMapper.toDTO(result.value))
		}

		return fail(response, result.value)
	}
}
