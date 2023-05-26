import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'
import { UnauthorizedError } from 'common/errors/UnauthorizedError'

import { UUID } from 'common/seedword/domain/UUID'
import { IInternalTransferRepository } from '../domain/internal_transfer/IInternalTransferRepository'
import { InternalTransfer } from '../domain/internal_transfer/InternalTransfer'

type Input = {
	internalTransferId: string
	requesterAccountId: string
}

type Output = Either<InvalidParameterError, InternalTransfer>

@injectable()
export class GetInternalTransferService {
	constructor(
		@inject('InternalTransferRepository') private readonly internalTransferRepository: IInternalTransferRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const internalTransferId = UUID.createFrom({ value: input.internalTransferId, field: 'internal_transfer_id' })

		if (internalTransferId.isLeft()) {
			return left(new InvalidParameterError([internalTransferId.value]))
		}

		const internalTransfer = await this.internalTransferRepository.getById(internalTransferId.value)

		if (!internalTransfer) {
			return left(new ResourceNotFound())
		}

		if (
			internalTransfer.props.sender_account_id.value !== input.requesterAccountId &&
			internalTransfer.props.recipient_account_id.value !== input.requesterAccountId
		) {
			return left(new UnauthorizedError())
		}

		return right(internalTransfer)
	}
}
