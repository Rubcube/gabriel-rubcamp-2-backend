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
	created_at?: Date
	updated_at?: Date
}

type CreateNewUserProperties = Omit<UserProperties, 'created_at' | 'updated_at'>

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

	set document(value: Document) {
		this.props.document = value
	}

	get password(): Password {
		return this.props.password
	}

	set password(value: Password) {
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
		return this.isPhoneVerified
	}

	set isPhoneVerified(value: boolean) {
		this.isPhoneVerified = value
	}

	get isEmailVerified(): boolean {
		return this.isEmailVerified
	}

	set isEmailVerified(value: boolean) {
		this.isEmailVerified = value
	}

	get verificationAttempts(): number {
		return this.props.verificationAttempts
	}

	addVerificationAttempt(): void {
		this.props.verificationAttempts++
	}

	cleanVerificationAttempts(): void {
		this.props.verificationAttempts = 0
	}

	get lastVerificationTry(): Date | undefined {
		return this.props.lastVerificationTry
	}

	set lastVerificationTry(value: Date | undefined) {
		this.props.lastVerificationTry = value
	}

	get created_at(): Date | undefined {
		return this.props.created_at
	}

	set created_at(value: Date | undefined) {
		this.props.created_at = value
	}

	get updated_at(): Date | undefined {
		return this.props.updated_at
	}

	set updated_at(value: Date | undefined) {
		this.props.updated_at = value
	}

	public async changePassword(oldPassword: string, password: string): Promise<Either<Violation, null>> {
		console.log(await this.password.comparePassword(oldPassword))
		if (oldPassword === password) {
			return left(new NewPasswordEqualOldViolation())
		}

		if (!(await this.password.comparePassword(oldPassword))) {
			return left(new WrongOldPasswordViolation())
		}

		const newPassword = Password.create(password, false)

		if (newPassword.isLeft()) {
			return left(newPassword.value)
		}

		this.password = newPassword.value

		return right(null)
	}

	static create(properties: UserProperties, id: UUID): User {
		return new User(properties, id)
	}

	static createNew(properties: CreateNewUserProperties): User {
		return new User(properties)
	}
}
