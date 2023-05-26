import { ValueObject } from 'common/seedword/domain/ValueObject'

export enum AccountStatusEnum {
	OPEN = 'OPEN',
	CLOSED = 'CLOSED',
	BLOCKED = 'BLOCKED',
	PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

type AccountStatusProperties = {
	value: AccountStatusEnum
}

export class AccountStatus extends ValueObject<AccountStatusProperties> {
	static create(property: keyof typeof AccountStatusEnum): AccountStatus {
		return new AccountStatus({ value: AccountStatusEnum[property] })
	}
}
