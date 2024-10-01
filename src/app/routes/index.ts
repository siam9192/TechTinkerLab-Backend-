import { IRouter, Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.route';
import { UserRouter } from '../modules/user/user.route';
import { FollowerRouter } from '../modules/follower/follower.route';
import { PostRouter } from '../modules/post/post.route';
import { CommentRouter } from '../modules/comment/comment.route';
import { SubscriptionRouter } from '../modules/subscription/subscription.route';
import { PaymentRouter } from '../modules/payment/payment.route';
import { OverviewRouter } from '../modules/overview/overview.route';
import { ReactionRouter } from '../modules/reaction/reaction.route';
import { CategoryRouter } from '../modules/category/category.route';

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
    path: '/categories',
    router: CategoryRouter,
  },
  
  {
    path: '/reactions',
    router: ReactionRouter,
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
  },
  {
    path:'/overview',
    router:OverviewRouter
  }
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
