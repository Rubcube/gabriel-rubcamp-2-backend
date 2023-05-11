import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'
import { type Either, right } from 'common/seedword/core/Either'
import { type Violation } from 'common/seedword/domain/Violation'

import { type UUID } from 'common/seedword/domain/UUID'

import { type TransactionalPassword } from './TransactionalPassword'

interface AccountProperties {
	user_id: UUID
	balance: number
	account: string
	agency: string
	status: string
	transactional_password: TransactionalPassword
	created_at: Date
	updated_at: Date
	closed_at?: Date
	blocked_at?: Date
}

type CreateAccountProperties = Omit<
	AccountProperties,
	'balance' | 'account' | 'agency' | 'status' | 'created_at' | 'updated_at'
> & {
	balance?: number
	account?: string
	agency?: string
	status?: string
	created_at?: Date
	updated_at?: Date
}

export class Account extends AggregateRoot<AccountProperties> {
	private constructor(properties: AccountProperties, id?: UUID) {
		super(properties, id)
	}

	static create(properties: CreateAccountProperties, id?: UUID): Either<Violation[], Account> {
		return right(
			new Account(
				{
					user_id: properties.user_id,
					balance: properties.balance ?? 0,
					account: properties.account ?? '9080',
					agency: properties.agency ?? '0001',
					status: properties.status ?? 'opened',
					transactional_password: properties.transactional_password,
					created_at: properties.created_at ?? new Date(),
					updated_at: properties.updated_at ?? new Date(),
					closed_at: properties.closed_at,
					blocked_at: properties.blocked_at
				},
				id
			)
		)
	}
}
