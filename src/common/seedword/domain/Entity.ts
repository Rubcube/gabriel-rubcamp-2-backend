import { UUID } from './UUID'

export abstract class Entity<T> {
	protected readonly _id: UUID
	public readonly props: T

	constructor(props: T, id?: UUID) {
		this._id = id ?? new UUID()
		this.props = props
	}

	public equals(object?: Entity<T>): boolean {
		return this._id.equals(object?._id)
	}
}
