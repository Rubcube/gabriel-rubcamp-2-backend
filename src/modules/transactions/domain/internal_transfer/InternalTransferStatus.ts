import { ValueObject } from 'common/seedword/domain/ValueObject'

export enum InternalTransferStatusEnum {
	COMPLETED = 'COMPLETED',
	CANCELED = 'CANCELED',
	REJECTED = 'REJECTED',
	REFUNDED = 'REFUNDED',
	SCHEDULED = 'SCHEDULED'
}

type InternalTransferStatusProperties = {
	value: InternalTransferStatusEnum
}

export class InternalTransferStatus extends ValueObject<InternalTransferStatusProperties> {
	static create(property: keyof typeof InternalTransferStatusEnum): InternalTransferStatus {
		return new InternalTransferStatus({ value: InternalTransferStatusEnum[property] })
	}
}
