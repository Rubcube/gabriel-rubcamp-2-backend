import { container } from 'tsyringe'

import { TokenProvider } from './implementations/TokenProvider'

container.registerInstance('TokenProvider', TokenProvider)
