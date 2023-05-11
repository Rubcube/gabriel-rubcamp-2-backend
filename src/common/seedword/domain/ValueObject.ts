type ValueObjectProperties = Record<string, any>

export abstract class ValueObject<T extends ValueObjectProperties> {
	public props: T

	constructor(props: T) {
		this.props = props
	}

	public equals(object?: ValueObject<T>): boolean {
		if (object === null || object === undefined) {
			return false
		}

		return JSON.stringify(this.props) === JSON.stringify(object.props)
	}
}
