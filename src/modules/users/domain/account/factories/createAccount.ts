import { Either, left, combineLefts } from 'src/common/seedword/core/Either'
import { Account } from '../Account'

import { UUID } from 'src/common/seedword/domain/UUID'
import { TransactionalPassword } from '../TransactionalPassword'
import { Violation } from 'src/common/seedword/domain/Violation'

type CreateAccountProperties = {
	id: string
	user_id: string
	balance: number
	account: string
	agency: string
	status: string
	transactional_password: string
	created_at: Date
	updated_at: Date
	closed_at?: Date
	blocked_at?: Date
}

export function createAccount(properties: CreateAccountProperties): Either<Violation[], Account> {
	const id = UUID.createFrom({ value: properties.id, field: 'id' })
	const user_id = UUID.createFrom({ value: properties.user_id, field: 'user_id' })
	const transactional_password = TransactionalPassword.create(properties.transactional_password)

	if (id.isLeft() || user_id.isLeft() || transactional_password.isLeft()) {
		return left(combineLefts(id, user_id, transactional_password))
	}

	return Account.create(
		{
			user_id: user_id.value,
			balance: properties.balance,
			account: properties.account,
			agency: properties.agency,
			status: properties.status,
			transactional_password: transactional_password.value,
			created_at: properties.created_at,
			updated_at: properties.updated_at,
			closed_at: properties.closed_at,
			blocked_at: properties.blocked_at
		},
		id.value
	)
}
