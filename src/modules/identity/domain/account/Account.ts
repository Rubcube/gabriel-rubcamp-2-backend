import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'
import { Either, right } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { UUID } from 'common/seedword/domain/UUID'

import { TransactionalPassword } from './TransactionalPassword'

type AccountProperties = {
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

type CreateNewAccountProperties = Pick<AccountProperties, 'user_id' | 'transactional_password'>

export class Account extends AggregateRoot<AccountProperties> {
	private constructor(properties: AccountProperties, id?: UUID) {
		super(properties, id)
	}

	static generateAccountNumber(): string {
		const timestamp = new Date().getTime()
		const randomNumber = Math.floor(Math.random() * 900000) + 100000

		return timestamp.toString().slice(-5) + randomNumber.toString().slice(-1)
	}

	static create(properties: AccountProperties, id: UUID): Either<Violation[], Account> {
		return right(
			new Account(
				{
					user_id: properties.user_id,
					balance: properties.balance,
					account: properties.account,
					agency: properties.agency,
					status: properties.status,
					transactional_password: properties.transactional_password,
					created_at: properties.created_at,
					updated_at: properties.updated_at,
					closed_at: properties.closed_at,
					blocked_at: properties.blocked_at
				},
				id
			)
		)
	}

	static createNew(properties: CreateNewAccountProperties): Account {
		const now = new Date()

		return new Account({
			user_id: properties.user_id,
			balance: 0,
			account: Account.generateAccountNumber(),
			agency: '0001',
			status: 'opened',
			transactional_password: properties.transactional_password,
			created_at: now,
			updated_at: now
		})
	}
}
