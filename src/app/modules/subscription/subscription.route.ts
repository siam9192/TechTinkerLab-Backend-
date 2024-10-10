import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionValidations } from './subscription.validation';
import { SubscriptionController } from './subscription.controller';

const router = Router();

router.post(
  '/package/payment',
  auth('USER'),
  validateRequest(SubscriptionValidations.PackageSubscriptionRequestValidation),
  SubscriptionController.handelPackageSubscriptionRequest,
);

router.get(
  '/payment/success',
  SubscriptionController.handelPackageSubscriptionPaymentSuccess,
);
router.get(
  '/payment/cancel',
  SubscriptionController.handelPackageSubscriptionPaymentCancel,
);


router.get(
  '/latest-subscription/current-user',
  auth('USER'),
  SubscriptionController.getCurrentUserLatestSubscription,
);
export const SubscriptionRouter = router;
