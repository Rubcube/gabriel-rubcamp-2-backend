import { AggregateRoot } from 'src/common/seedword/domain/AggregateRoot'
import { type Either, right } from 'src/common/seedword/core/Either'
import { type Violation } from 'src/common/seedword/domain/Violation'

import { type UUID } from 'src/common/seedword/domain/UUID'

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
