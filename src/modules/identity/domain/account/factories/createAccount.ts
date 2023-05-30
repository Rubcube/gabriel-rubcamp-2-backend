import { Either, left, combineLefts } from 'common/seedword/core/Either'
import { Account } from '../Account'

import { UUID } from 'common/seedword/domain/UUID'
import { TransactionalPassword } from '../TransactionalPassword'
import { Violation } from 'common/seedword/domain/Violation'
import { AccountStatus, AccountStatusEnum } from '../AccountStatus'

type CreateAccountProperties = {
	id: string
	userId: string
	balance: number
	account: string
	agency: string
	status: keyof typeof AccountStatusEnum
	transactionalPassword: string
	loginAttempts: number
	createdAt: Date
	updatedAt: Date
	closedAt?: Date
	blockedAt?: Date
}

export function createAccount(properties: CreateAccountProperties): Either<Violation[], Account> {
	const id = UUID.createFrom({ value: properties.id, field: 'id' })
	const userId = UUID.createFrom({ value: properties.userId, field: 'user_id' })
	const transactionalPassword = TransactionalPassword.create(properties.transactionalPassword)

	if (id.isLeft() || userId.isLeft() || transactionalPassword.isLeft()) {
		return left(combineLefts(id, userId, transactionalPassword))
	}

	return Account.create(
		{
			userId: userId.value,
			balance: properties.balance,
			account: properties.account,
			agency: properties.agency,
			status: AccountStatus.create(properties.status),
			transactionalPassword: transactionalPassword.value,
			loginAttempts: properties.loginAttempts,
			createdAt: properties.createdAt,
			updatedAt: properties.updatedAt,
			closedAt: properties.closedAt,
			blockedAt: properties.blockedAt
		},
		id.value
	)
}
