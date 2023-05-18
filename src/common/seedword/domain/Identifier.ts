export abstract class Identifier<T> {
	constructor(public readonly value: T) {
		this.value = value
	}

	equals(id?: Identifier<T>): boolean {
		return id?.value === this.value
	}

	toString(): string {
		return String(this.value)
	}
}
