import moment from 'moment'
import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'
import { Violation } from 'common/seedword/domain/Violation'
import { Either, left, right } from 'common/seedword/core/Either'

import { UUID } from 'common/seedword/domain/UUID'
import { Name } from './Name'
import { Email } from './Email'
import { Birthday } from './Birthday'
import { Phone } from './Phone'
import { Document } from './Document'
import { Password } from './Password'
import { Address } from './Address'

import { NewPasswordEqualOldViolation } from 'common/domain/violations/NewPasswordEqualOld'
import { WrongOldPasswordViolation } from 'common/domain/violations/WrongOldPasswordViolation'

type UserProperties = {
	name: Name
	email: Email
	birthday: Birthday
	phone: Phone
	document: Document
	password: Password
	address: Address
	isPhoneVerified: boolean
	isEmailVerified: boolean
	verificationAttempts: number
	lastVerificationTry?: Date
	createdAt?: Date
	updatedAt?: Date
}

type CreateNewUserProperties = Omit<
	UserProperties,
	'createdAt' | 'updatedAt' | 'isPhoneVerified' | 'isEmailVerified' | 'verificationAttempts' | 'lastVerificationTry'
>

export class User extends AggregateRoot<UserProperties> {
	private constructor(properties: UserProperties, id?: UUID) {
		super(properties, id)
	}

	get name(): Name {
		return this.props.name
	}

	set name(value: Name) {
		this.props.name = value
	}

	get email(): Email {
		return this.props.email
	}

	set email(value: Email) {
		this.props.email = value
	}

	get birthday(): Birthday {
		return this.props.birthday
	}

	set birthday(value: Birthday) {
		this.props.birthday = value
	}

	get phone(): Phone {
		return this.props.phone
	}

	set phone(value: Phone) {
		this.props.phone = value
	}

	get document(): Document {
		return this.props.document
	}

	get password(): Password {
		return this.props.password
	}

	private set password(value: Password) {
		this.props.password = value
	}

	get address(): Address {
		return this.props.address
	}

	set address(value: Address) {
		this.props.address = value
	}

	get isVerified() {
		return this.props.isPhoneVerified && this.props.isEmailVerified
	}

	get isPhoneVerified(): boolean {
		return this.props.isPhoneVerified
	}

	set isPhoneVerified(value: boolean) {
		this.props.isPhoneVerified = value
	}

	get isEmailVerified(): boolean {
		return this.props.isEmailVerified
	}

	set isEmailVerified(value: boolean) {
		this.props.isEmailVerified = value
	}

	get verificationAttempts(): number {
		return this.props.verificationAttempts
	}

	set verificationAttempts(value: number) {
		this.props.verificationAttempts = value
	}

	private addVerificationAttempt(): void {
		this.lastVerificationTry = new Date()
		this.props.verificationAttempts++
	}

	private cleanVerificationAttempts(): void {
		this.lastVerificationTry = undefined
		this.props.verificationAttempts = 0
	}

	get lastVerificationTry(): Date | undefined {
		return this.props.lastVerificationTry
	}

	set lastVerificationTry(value: Date | undefined) {
		this.props.lastVerificationTry = value
	}

	private canPerformVerification(): boolean {
		const lastTryMoment = moment(this.lastVerificationTry)

		switch (this.verificationAttempts) {
			case 0:
				return true
			case 1:
				return moment().isAfter(lastTryMoment.add(1, 'minute'))
			case 2:
				return moment().isAfter(lastTryMoment.add(2, 'minute'))
			case 3:
				return moment().isAfter(lastTryMoment.add(6, 'minute'))
			case 4:
				return moment().isAfter(lastTryMoment.add(24, 'minute'))
			default:
				return moment().isAfter(lastTryMoment.add(60, 'minute'))
		}
	}

	public retryVerificationAfter(): Date {
		const lastTryMoment = moment(this.lastVerificationTry)

		switch (this.verificationAttempts) {
			case 0:
				return moment().toDate()
			case 1:
				return lastTryMoment.add(1, 'minute').toDate()
			case 2:
				return lastTryMoment.add(2, 'minute').toDate()
			case 3:
				return lastTryMoment.add(6, 'minute').toDate()
			case 4:
				return lastTryMoment.add(24, 'minute').toDate()
			default:
				return lastTryMoment.add(60, 'minute').toDate()
		}
	}

	public tryAddVerificationAttempt(): boolean {
		if (!this.canPerformVerification()) return false

		this.addVerificationAttempt()

		return true
	}

	public verifyPhone() {
		this.cleanVerificationAttempts()

		this.isPhoneVerified = true
	}

	public verifyEmail() {
		this.cleanVerificationAttempts()

		this.isEmailVerified = true
	}

	get createdAt(): Date | undefined {
		return this.props.createdAt
	}

	set createdAt(value: Date | undefined) {
		this.props.createdAt = value
	}

	get updatedAt(): Date | undefined {
		return this.props.updatedAt
	}

	set updatedAt(value: Date | undefined) {
		this.props.updatedAt = value
	}

	public async changePassword(oldPassword: string, password: Password): Promise<Either<Violation, null>> {
		if (!(await this.password.comparePassword(oldPassword))) {
			return left(new WrongOldPasswordViolation())
		}

		if (oldPassword === password.value) {
			return left(new NewPasswordEqualOldViolation())
		}

		this.password = password

		return right(null)
	}

	public resetPassword(password: Password): Either<Violation, null> {
		if (this.password.value === password.value) {
			return left(new NewPasswordEqualOldViolation())
		}

		this.password = password

		return right(null)
	}

	static create(properties: UserProperties, id: UUID): User {
		return new User(properties, id)
	}

	static createNew(properties: CreateNewUserProperties): User {
		return new User({
			...properties,
			isPhoneVerified: false,
			isEmailVerified: false,
			verificationAttempts: 0
		})
	}
}
