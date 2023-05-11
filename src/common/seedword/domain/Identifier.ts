export abstract class Identifier<T> {
	constructor(public readonly value: T) {
		this.value = value
	}

	equals(id?: Identifier<T>): boolean {
		if (!(id instanceof this.constructor)) {
			return false
		}

		return id?.value === this.value
	}

	toString(): string {
		return String(this.value)
	}
}
