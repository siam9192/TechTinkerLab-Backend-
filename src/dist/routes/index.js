"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const follower_route_1 = require("../modules/follower/follower.route");
const post_route_1 = require("../modules/post/post.route");
const comment_route_1 = require("../modules/comment/comment.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const payment_route_1 = require("../modules/payment/payment.route");
const overview_route_1 = require("../modules/overview/overview.route");
const post_reaction_route_1 = require("../modules/post-reaction/post-reaction.route");
const category_route_1 = require("../modules/category/category.route");
const comment_reaction_route_1 = require("../modules/comment-reaction/comment-reaction.route");
const user_activity_route_1 = require("../modules/user-activity/user-activity.route");
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
        path: '/categories',
        router: category_route_1.CategoryRouter,
    },
    {
        path: '/post-reactions',
        router: post_reaction_route_1.PostReactionRouter,
    },
    {
        path: '/comments',
        router: comment_route_1.CommentRouter,
    },
    {
        path: '/comment-reactions',
        router: comment_reaction_route_1.CommentReactionRouter,
    },
    {
        path: '/subscriptions',
        router: subscription_route_1.SubscriptionRouter,
    },
    {
        path: '/payments',
        router: payment_route_1.PaymentRouter,
    },
    {
        path: '/overview',
        router: overview_route_1.OverviewRouter,
    },
    {
        path: '/user-activities',
        router: user_activity_route_1.UserActivityRouter,
    },
];
const routes = moduleRoutes.map((route) => router.use(route.path, route.router));
exports.default = routes;
