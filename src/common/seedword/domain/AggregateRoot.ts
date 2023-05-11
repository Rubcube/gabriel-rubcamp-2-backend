import { Entity } from './Entity'
import { type UUID } from './UUID'

export abstract class AggregateRoot<T> extends Entity<T> {
	get id(): UUID {
		return this._id
	}
}
