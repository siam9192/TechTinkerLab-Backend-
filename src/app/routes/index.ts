import { IRouter, Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.route';
import { UserRouter } from '../modules/user/user.route';
import { FollowerRouter } from '../modules/follower/follower.route';
import { PostRouter } from '../modules/post/post.route';

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
    path:'/posts',
    router:PostRouter
  }
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
