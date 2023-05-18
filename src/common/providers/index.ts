import { container } from 'tsyringe'

import { TokenProvider } from './token/implementations/TokenProvider'

container.registerSingleton('TokenProvider', TokenProvider)
