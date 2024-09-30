"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const follower_route_1 = require("../modules/follower/follower.route");
const post_route_1 = require("../modules/post/post.route");
const post_state__route_1 = require("../modules/post-state/post-state-.route");
const comment_route_1 = require("../modules/comment/comment.route");
const subcription_route_1 = require("../modules/subscription/subcription.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        router: auth_route_1.AuthRouter,
    },
    {
        path: '/users',
        router: user_route_1.UserRouter,
    },
    {
        path: '/followers',
        router: follower_route_1.FollowerRouter,
    },
    {
        path: '/posts',
        router: post_route_1.PostRouter,
    },
    {
        path: '/post-states',
        router: post_state__route_1.PostStateRouter,
    },
    {
        path: '/comments',
        router: comment_route_1.CommentRouter,
    },
    {
        path: '/subscriptions',
        router: subcription_route_1.SubscriptionRouter,
    },
];
const routes = moduleRoutes.map((route) => router.use(route.path, route.router));
exports.default = routes;
