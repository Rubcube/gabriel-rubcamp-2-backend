import bcrypt from 'bcryptjs'

import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { Either, right, left } from 'src/common/seedword/core/Either'
import { Violation } from 'src/common/seedword/domain/Violation'
import { BadPasswordLengthViolation } from 'src/common/domain/violations/BadPasswordLengthViolation'
import { Guard } from 'src/common/seedword/core/Guard'
import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'
import { BadPasswordFormatViolation } from 'src/common/domain/violations/BadPasswordFormatViolation'

type PasswordProperties = {
	value: string
	hashed: boolean
}

export class Password extends ValueObject<PasswordProperties> {
	get value(): string {
		return this.props.value
	}

	get hashed(): boolean {
		return this.props.hashed
	}

	static isValid(password: string): boolean {
		return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/.test(password)
	}

	public async getHashedValue(): Promise<string> {
		if (this.hashed) {
			return this.value
		}

		return await bcrypt.hash(this.value, 8)
	}

	public async comparePassword(plainTextPassword: string): Promise<boolean> {
		const hashedPassword = this.value

		if (this.hashed) {
			return await bcrypt.compare(plainTextPassword, hashedPassword)
		}

		return hashedPassword === plainTextPassword
	}

	static create(value: string, hashed: boolean): Either<Violation, Password> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('password', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('password', typeof value))
		}

		if (value.trim().length < 8 || value.trim().length > 255) {
			return left(new BadPasswordLengthViolation('password', value))
		}

		if (!hashed && !this.isValid(value)) {
			return left(new BadPasswordFormatViolation('password', value))
		}

		return right(new Password({ value, hashed }))
	}
}
