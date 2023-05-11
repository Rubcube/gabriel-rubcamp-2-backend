import { type Either, left } from 'common/seedword/core/Either'
import { Account } from '../Account'

import { type Violation } from 'common/seedword/domain/Violation'
import { TransactionalPassword } from '../TransactionalPassword'
import { UUID } from 'common/seedword/domain/UUID'

interface CreateAccountProperties {
	id?: string
	user_id: string
	balance?: number
	account?: string
	agency?: string
	status?: string
	transactional_password: string
	created_at?: Date
	updated_at?: Date
	closed_at?: Date
	blocked_at?: Date
}

export function createAccount(properties: CreateAccountProperties): Either<Violation[], Account> {
	const id = UUID.createUndefinable({ value: properties.id, field: 'id' })
	const user_id = UUID.createFrom({ value: properties.user_id, field: 'user_id' })
	const transactional_password = TransactionalPassword.create(properties.transactional_password)

	if (id.isLeft()) {
		return left([id.value])
	}

	if (user_id.isLeft()) {
		return left([user_id.value])
	}

	if (transactional_password.isLeft()) {
		return left([transactional_password.value])
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
