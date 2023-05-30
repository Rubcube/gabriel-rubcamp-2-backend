import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'
import { Either, left, right } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { UUID } from 'common/seedword/domain/UUID'

import { TransactionalPassword } from './TransactionalPassword'
import { AccountStatus } from './AccountStatus'

type AccountProperties = {
	userId: UUID
	balance: number
	account: string
	agency: string
	status: AccountStatus
	transactionalPassword: TransactionalPassword
	loginAttempts: number
	createdAt?: Date
	updatedAt?: Date
	closedAt?: Date
	blockedAt?: Date
}

type CreateNewAccountProperties = Pick<AccountProperties, 'userId' | 'transactionalPassword'>

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

	get status(): AccountStatus {
		return this.props.status
	}

	set status(value: AccountStatus) {
		this.props.status = value
	}

	statusToPendingVerification() {
		this.props.status = AccountStatus.create('PENDING_VERIFICATION')
	}

	open() {
		this.props.status = AccountStatus.create('OPEN')
	}

	canLogin() {
		if (this.isOpen() || this.isPendingVerification()) {
			return true
		}

		return false
	}

	addLoginAttempt() {
		if (this.props.loginAttempts === 4) {
			this.props.status = AccountStatus.create('BLOCKED')
		}

		this.props.loginAttempts++
	}

	isOpen(): boolean {
		return this.props.status.props.value === 'OPEN'
	}

	isClosed(): boolean {
		return this.props.status.props.value === 'CLOSED'
	}

	isBlocked(): boolean {
		return this.props.status.props.value === 'BLOCKED'
	}

	isLocked(): boolean {
		return this.props.status.props.value === 'LOCKED'
	}

	isPendingVerification(): boolean {
		return this.props.status.props.value === 'PENDING_VERIFICATION'
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
			userId: properties.userId,
			balance: 0,
			account: Account.generateAccountNumber(),
			agency: '0001',
			status: AccountStatus.create('PENDING_VERIFICATION'),
			transactionalPassword: properties.transactionalPassword,
			loginAttempts: 0
		})
	}
}
