'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const auth_route_1 = require('../modules/auth/auth.route');
const router = (0, express_1.Router)();
const moduleRoutes = [
  {
    path: '/auth',
    router: auth_route_1.AuthRouter,
  },
];
const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);
exports.default = routes;
