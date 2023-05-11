interface IGuardResult {
	succeeded: boolean
	fail: boolean
}

interface ITypeBulkRequest {
	value: any
	field: string
}

interface ITypeBulkResult extends IGuardResult {
	fields: string[]
}

interface INullUndefinedBulkRequest {
	value: any
	field: string
}

interface INullUndefinedBulkRseult extends IGuardResult {
	fields: string[]
}

function mountResult(expression: boolean): IGuardResult {
	return expression ? { succeeded: true, fail: false } : { succeeded: false, fail: true }
}

export class Guard {
	public static isOfType(type: string, value: any): IGuardResult {
		// eslint-disable-next-line valid-typeof
		return mountResult(typeof value === type)
	}

	public static isOfTypeBulk(type: string, args: ITypeBulkRequest[]): ITypeBulkResult {
		const fields = args.filter(arg => this.isOfType(type, arg.value).fail)

		if (fields.length === 0) {
			return {
				succeeded: true,
				fail: false,
				fields: []
			}
		}

		return {
			succeeded: false,
			fail: true,
			fields: fields.map(value => value.field)
		}
	}

	public static greaterThan(min_value: number, actual_value: number): IGuardResult {
		return mountResult(actual_value > min_value)
	}

	public static atLeast(min_value: number, actual_value: number): IGuardResult {
		return mountResult(actual_value >= min_value)
	}

	public static atMost(maxValue: number, actual_value: number): IGuardResult {
		return mountResult(actual_value <= maxValue)
	}

	public static againstNullOrUndefined(value: any): IGuardResult {
		return mountResult(!(value === null || value === undefined))
	}

	public static againstNullOrUndefinedBulk(args: INullUndefinedBulkRequest[]): INullUndefinedBulkRseult {
		const fields = args.filter(arg => this.againstNullOrUndefined(arg.value).fail)

		if (fields.length === 0) {
			return {
				succeeded: true,
				fail: false,
				fields: []
			}
		}

		return {
			fail: true,
			succeeded: false,
			fields: fields.map(value => value.field)
		}
	}

	public static isOneOf(value: string | number, valid_values: Array<number | string>): IGuardResult {
		let is_valid = false

		for (const valid_value of valid_values) {
			if (value === valid_value) {
				is_valid = true
				break
			}
		}

		return mountResult(is_valid)
	}

	public static inRange(min: number, max: number, num: number): IGuardResult {
		return mountResult(num >= min && num <= max)
	}
}
