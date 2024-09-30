import { string, z } from 'zod';

const PackageSubscriptionRequestValidation = z.object({
  package_id: string(),
  redirect_url:string()
});

export const SubscriptionValidations = {
  PackageSubscriptionRequestValidation,
};
