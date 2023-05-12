import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default (): void => {
	console.log(process.env.DATABASE_URL)
}
