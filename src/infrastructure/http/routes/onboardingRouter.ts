import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'
import { onboardingController } from '../controllers/onboardingController'

const onboardingRouter = Router()

onboardingRouter.use(ensureAuthentication)

onboardingRouter.post('/', onboardingController.create)

export { onboardingRouter }
