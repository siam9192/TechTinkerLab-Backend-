import { IRouter, Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.route';
import { UserRouter } from '../modules/user/user.route';
import { FollowerRouter } from '../modules/follower/follower.route';
import { PostRouter } from '../modules/post/post.route';
import { PostStateRouter } from '../modules/post-state/post-state-.route';
import { CommentRouter } from '../modules/comment/comment.route';
import { SubscriptionRouter } from '../modules/subscription/subcription.route';
import { PaymentRouter } from '../modules/payment/payment.route';

const router = Router();

interface IModuleRoute {
  path: string;
  router: IRouter;
}
const moduleRoutes: IModuleRoute[] = [
  {
    path: '/auth',
    router: AuthRouter,
  },
  {
    path: '/users',
    router: UserRouter,
  },
  {
    path: '/followers',
    router: FollowerRouter,
  },
  {
    path: '/posts',
    router: PostRouter,
  },
  {
    path: '/post-states',
    router: PostStateRouter,
  },
  {
    path: '/comments',
    router: CommentRouter,
  },
  {
    path: '/subscriptions',
    router: SubscriptionRouter,
  },
  {
    path:'/payments',
    router:PaymentRouter
  }
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
