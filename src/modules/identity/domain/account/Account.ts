import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'
import { Either, left, right } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { UUID } from 'common/seedword/domain/UUID'

import { TransactionalPassword } from './TransactionalPassword'
import { AccountStatus } from './AccountStatus'

type AccountProperties = {
	user_id: UUID
	balance: number
	account: string
	agency: string
	status: AccountStatus
	transactional_password: TransactionalPassword
	created_at?: Date
	updated_at?: Date
	closed_at?: Date
	blocked_at?: Date
}

type CreateNewAccountProperties = Pick<AccountProperties, 'user_id' | 'transactional_password'>

export class Account extends AggregateRoot<AccountProperties> {
	private constructor(properties: AccountProperties, id?: UUID) {
		super(properties, id)
	}

	decrementBalance(amount: number): Either<null, null> {
		if (amount > this.props.balance) {
			return left(null)
		}

		this.props.balance -= amount

		return right(null)
	}

	incrementBalance(amount: number): void {
		this.props.balance += amount
	}

	static generateAccountNumber(): string {
		const timestamp = new Date().getTime()
		const randomNumber = Math.floor(Math.random() * 900000) + 100000

		return timestamp.toString().slice(-5) + randomNumber.toString().slice(-1)
	}

	static create(properties: AccountProperties, id: UUID): Either<Violation[], Account> {
		return right(new Account(properties, id))
	}

	static createNew(properties: CreateNewAccountProperties): Account {
		return new Account({
			user_id: properties.user_id,
			balance: 0,
			account: Account.generateAccountNumber(),
			agency: '0001',
			status: AccountStatus.create('OPEN'),
			transactional_password: properties.transactional_password
		})
	}
}
