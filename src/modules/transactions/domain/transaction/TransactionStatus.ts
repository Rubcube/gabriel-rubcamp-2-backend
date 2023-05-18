import { ValueObject } from 'common/seedword/domain/ValueObject'

export enum TransactionStatusEnum {
	VOID = 'VOID',
	POSTED = 'POSTED',
	OPEN = 'OPEN'
}

type TransactionStatusProperties = {
	value: TransactionStatusEnum
}

export class TransactionStatus extends ValueObject<TransactionStatusProperties> {
	static create(properties: TransactionStatusProperties): TransactionStatus {
		return new TransactionStatus(properties)
	}
}
