import { ValueObject } from 'common/seedword/domain/ValueObject'

export enum TransactionTypeEnum {
	INTERNAL_TRANSFER_INBOUND = 'INTERNAL_TRANSFER_INBOUND',
	INTERNAL_TRANSFER_OUTBOUND = 'TRANSFER_OUTBOUND'
}

type TransactionTypeProperties = {
	value: TransactionTypeEnum
}

export class TransactionType extends ValueObject<TransactionTypeProperties> {
	static create(properties: TransactionTypeProperties): TransactionType {
		return new TransactionType(properties)
	}
}
