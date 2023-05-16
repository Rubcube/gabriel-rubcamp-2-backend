import { container } from 'tsyringe'

import { TokenProvider } from './token/implementations/TokenProvider'

container.registerInstance('TokenProvider', TokenProvider)
