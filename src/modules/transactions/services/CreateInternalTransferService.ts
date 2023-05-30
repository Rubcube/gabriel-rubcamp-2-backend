import { inject, injectable } from 'tsyringe'
import { combineLefts, Either, left, right } from 'common/seedword/core/Either'
import { UUID } from 'common/seedword/domain/UUID'
import { AppError } from 'common/seedword/errors/AppError'

import { Violation } from 'common/seedword/domain/Violation'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { InsufficientFundsError } from 'common/errors/InsufficientFundsError'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'
import { WrongTransactionalPasswordError } from 'common/errors/WrongTransactionalPassword'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { InternalTransfer } from '../domain/internal_transfer/InternalTransfer'
import { InternalTransferStatus } from '../domain/internal_transfer/InternalTransferStatus'
import { IInternalTransferRepository } from '../domain/internal_transfer/IInternalTransferRepository'
import { Amount } from '../domain/internal_transfer/Amount'
import { ScheduledTo } from '../domain/internal_transfer/ScheduledTo'

import { TransactionalPassword } from 'modules/identity/domain/account/TransactionalPassword'
import { IAccountRepository } from 'modules/identity/domain/account/IAccountRepository'

type Input = {
	transactionalPassword: string
	senderAccountId: string
	recipientAccountId: string
	scheduledTo?: string
	amount: number
}

type Output = Either<AppError, InternalTransfer>

@injectable()
export class CreateInternalTransferService {
	constructor(
		@inject('InternalTransferRepository')
		private readonly internalTransferRespository: IInternalTransferRepository,
		@inject('AccountRepository')
		private readonly accountRepository: IAccountRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const senderAccountId = UUID.createFrom({ value: input.senderAccountId, field: 'sender_account_id' })
		const recipientAccountId = UUID.createFrom({ value: input.recipientAccountId, field: 'recipient_account_id' })
		const amount = Amount.create({ value: input.amount })
		const transactionalPassword = TransactionalPassword.create(input.transactionalPassword)

		if (senderAccountId.isLeft() || recipientAccountId.isLeft() || amount.isLeft() || transactionalPassword.isLeft()) {
			return left(
				new InvalidParameterError(combineLefts(senderAccountId, recipientAccountId, amount, transactionalPassword))
			)
		}

		if (senderAccountId.value.equals(recipientAccountId.value)) {
			return left(new InvalidOperationError())
		}

		const senderAccount = await this.accountRepository.findById(senderAccountId.value.value)

		if (!senderAccount) {
			return left(new ResourceNotFound())
		}

		if (!senderAccount.isOpen()) {
			return left(new InvalidOperationError())
		}

		if (!senderAccount.props.transactional_password.equals(transactionalPassword.value)) {
			return left(new WrongTransactionalPasswordError())
		}

		const recipientAccount = await this.accountRepository.findById(recipientAccountId.value.value)

		if (!recipientAccount) {
			return left(new ResourceNotFound())
		}

		if (!recipientAccount.isOpen()) {
			return left(new InvalidOperationError())
		}

		let internalTransfer: Either<Violation[], InternalTransfer>

		if (input.scheduledTo) {
			const scheduledTo = ScheduledTo.create(input.scheduledTo)

			if (scheduledTo.isLeft()) {
				return left(new InvalidParameterError([scheduledTo.value]))
			}

			internalTransfer = InternalTransfer.createNew({
				sender_account_id: senderAccountId.value,
				recipient_account_id: recipientAccountId.value,
				scheduled_to: scheduledTo.value,
				status: InternalTransferStatus.create('SCHEDULED'),
				amount: amount.value
			})
		} else {
			if (senderAccount.decrementBalance(amount.value.props.value).isLeft()) {
				return left(new InsufficientFundsError())
			}

			recipientAccount.incrementBalance(amount.value.props.value)

			internalTransfer = InternalTransfer.createNew({
				sender_account_id: senderAccountId.value,
				recipient_account_id: recipientAccountId.value,
				scheduled_to: null,
				status: InternalTransferStatus.create('COMPLETED'),
				amount: amount.value
			})
		}

		if (internalTransfer.isLeft()) {
			return left(new InvalidParameterError(internalTransfer.value))
		}

		await this.internalTransferRespository.create(internalTransfer.value, senderAccount, recipientAccount)

		return right(internalTransfer.value)
	}
}
