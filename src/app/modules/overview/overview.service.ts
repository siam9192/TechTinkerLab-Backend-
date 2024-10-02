import { object } from 'zod';
import { months, PaymentStatus } from '../../utils/constant';
import Payment from '../payment/payment.model';
import Post from '../post/post.model';
import Subscription from '../subscription/subscription.model';
import User from '../user/user.model';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  objectId,
} from '../../utils/function';
import { IAdminOverview } from './overview.interface';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import Comment from '../comment/comment.model';
import Reaction from '../post-reaction/post-reaction.model';
import Reader from '../reader/reader.model';

const getAdminOverviewDataFromDB = async (
  query: any,
): Promise<IAdminOverview> => {
  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);
  const currentMonthNumber = new Date().getMonth();
  const payments = await Payment.find({ createdAt: { $lte: lastDateOfYear } });

  const monthsPayments = months.map((month, monthNumber) => {
    const monthPayments = payments.filter(
      (payment) => new Date(payment.createdAt).getMonth() === monthNumber,
    );
    return {
      month: month,
      payments: monthPayments,
      upcoming: new Date().getMonth() < monthNumber, // Checking  upcoming month (if month number is getter than  current month number then true otherwise false)
    };
  });

  const monthsRevenue = monthsPayments.map((item) => ({
    month: item.month,
    total_revenue: item.payments.reduce((p, c) => p + c.amount, 0),
    upcoming: item.upcoming,
  }));

  const running_month_revenue =
    monthsRevenue.find((_, monthNumber) => monthNumber === currentMonthNumber)
      ?.total_revenue || 0;

  const total_user = await User.countDocuments();
  const total_payment = await Payment.find({
    status: PaymentStatus.SUCCESS,
  }).countDocuments();
  const total_post = await Post.countDocuments();
  const total_subscription = await Subscription.countDocuments();
  const total_revenue = payments.reduce((p, c) => p + c.amount, 0);

  return {
    total_user,
    total_payment,
    total_revenue,
    total_subscription,
    total_post,
    running_month_revenue,
    months_revenue: monthsRevenue,
  };
};

const getCurrentUserOverviewDataFromDB = async (userId: string, query: any) => {
  const user = await User.findById(userId).select('latest_subscription');

  // Getting all post of the user
  const posts = await Post.find({ author: objectId(userId) });
  const total_post = posts.length;
  const total_earning = 0;
  const latest_posts = posts.slice(-4, posts.length);

  const result = {
    total_post,
    total_earning,
    latest_posts,
  };

  return result;
};

const getPostOverviewDataFromDB = async (
  postId: string,
  query: { view_type: 'date' | 'month' | 'year' },
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const current_month_number = new Date().getMonth();
  const current_year = new Date().getFullYear();
  const last_date_of_Year = new Date(current_year, 11, 31);
  const monthDates = getDaysInMonth(current_year, current_month_number);

  const total_read = post.total_read;
  const total_earning = post.total_earning;
  const total_reaction = await Reaction.find({ post: post }).countDocuments();
  const total_reader = await Reader.find({ post: post._id }).countDocuments();

  let readers_summery;
  let comments_summery;
  let reactions_summery;

  if (query.view_type === 'month') {
    const comments = await Comment.find({
      createdAt: { $lte: last_date_of_Year },
    });

    comments_summery = months.map((month, monthNumber) => {
      const total_comment = comments.filter(
        (comment) => new Date(comment.createdAt).getMonth() === monthNumber,
      ).length;
      return {
        month: month,
        total_comment,
        upcoming: new Date().getMonth() < monthNumber, // Checking  upcoming month (if month number is getter than  current month number then true otherwise false)
      };
    });

    const reactions = await Reaction.find({
      createdAt: { $lte: last_date_of_Year },
    });
    reactions_summery = months.map((month, monthNumber) => {
      const total_reaction = reactions.filter(
        (reaction) => new Date(reaction.createdAt).getMonth() === monthNumber,
      ).length;
      return {
        month: month,
        total_reaction,
        upcoming: new Date().getMonth() < monthNumber, // Checking  upcoming month (if month number is getter than  current month number then true otherwise false)
      };
    });

    const readers = await Reader.find({
      createdAt: { $lte: last_date_of_Year },
    });
    readers_summery = months.map((month, monthNumber) => {
      const total_reader = readers.filter(
        (reader) => new Date(reader.createdAt).getMonth() === monthNumber,
      ).length;

      return {
        month: month,
        total_reader,
        upcoming: new Date().getMonth() < monthNumber, // Checking  upcoming month (if month number is getter than  current month number then true otherwise false)
      };
    });
  } else if (query.view_type === 'date') {
    const firstDayOfMonth = getFirstDayOfMonth(
      current_year,
      current_month_number,
    );
    const lastDayOfMonth = getLastDayOfMonth(
      current_year,
      current_month_number,
    );

    const commentsOfCurrentDate = await Comment.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    const readersOfCurrentDate = await Reader.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    const reactionsOfCurrentDate = await Reaction.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    comments_summery = monthDates.map((date) => {
      const total_comment = commentsOfCurrentDate.filter(
        (comment) => new Date(comment.createdAt).getDate() === date,
      ).length;
      return {
        date,
        total_comment,
        upcoming: new Date().getMonth() < date, // Checking  upcoming day (if month number is getter than  current date number then true otherwise false)
      };
    });

    readers_summery = monthDates.map((date) => {
      const total_reader = reactionsOfCurrentDate.filter(
        (reader) => new Date(reader.createdAt).getDate() === date,
      ).length;
      return {
        date,
        total_reader,
        upcoming: new Date().getMonth() < date, // Checking  upcoming day (if month number is getter than  current date number then true otherwise false)
      };
    });

    reactions_summery = monthDates.map((date) => {
      const total_reaction = commentsOfCurrentDate.filter(
        (comment) => new Date(comment.createdAt).getDate() === date,
      ).length;
      return {
        date,
        total_reaction,
        upcoming: new Date().getMonth() < date, // Checking  upcoming day (if month number is getter than  current date number then true otherwise false)
      };
    });
  }

  return {
    total_read,
    total_earning,
    total_reaction,
    total_reader,
    readers_summery,
    comments_summery,
    reactions_summery,
  };
};

export const OverviewService = {
  getAdminOverviewDataFromDB,
  getCurrentUserOverviewDataFromDB,
  getPostOverviewDataFromDB,
};
