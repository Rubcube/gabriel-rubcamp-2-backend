import { Router } from 'express'

import { OnboardingController } from '../controllers/OnboardingController'

const onboardingRouter = Router()
const onboardingController = new OnboardingController()

onboardingRouter.post('/', onboardingController.create)

export { onboardingRouter }
