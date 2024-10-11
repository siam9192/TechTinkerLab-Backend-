import { object } from 'zod';
import { months, PaymentStatus } from '../../utils/constant';
import Payment from '../payment/payment.model';
import Post from '../post/post.model';
import Subscription from '../subscription/subscription.model';
import User from '../user/user.model';
import {
  dateDifference,
  getDaysInMonth,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  objectId,
} from '../../utils/function';
import { IAdminOverview, TMonthData } from './overview.interface';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import Comment from '../comment/comment.model';
import Reaction from '../post-reaction/post-reaction.model';
import Reader from '../reader/reader.model';
import UserActivity from '../user-activity/user-activity.model';

const getAdminOverviewDataFromDB = async (
  query: any,
): Promise<IAdminOverview> => {
  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);
  const currentMonthNumber = new Date().getMonth();
  const payments = await Payment.find({ createdAt: { $lte: lastDateOfYear } });
  const current_year= new Date().getFullYear()
  const userActivities = await UserActivity.find()
  const posts = await Post.find()
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
 
  const last_date_of_Year = new Date(current_year, 11, 31);
  const monthsData:TMonthData[] = months.map((month,index)=>(
    {
      month,
      payments:payments.filter(payment=>{
        const date = new Date(payment.createdAt)
        const dateNow = new Date()
        const month = date.getMonth()
        const year = date.getFullYear()
        return index === month  && dateNow.getFullYear() === year
      }).length,
      revenue:payments.filter(payment=>{
        const date = new Date(payment.createdAt)
        const dateNow = new Date()
        const month = date.getMonth()
        const year = date.getFullYear()
        return index === month  && dateNow.getFullYear() === year
      }).reduce((p,c)=>p+c.amount,0),
      posts:posts.filter(post=>{
        const date = new Date(post.createdAt)
        const dateNow = new Date()
        const month = date.getMonth()
        const year = date.getFullYear()
        return index === month  && dateNow.getFullYear() === year
      }).length,
      user_activities:posts.filter(activity=>{
        const date = new Date(activity.createdAt)
        const dateNow = new Date()
        const month = date.getMonth()
        const year = date.getFullYear()
        return index === month  && dateNow.getFullYear() === year
      }).length,
      upcoming: new Date().getMonth() < index
    }
  )) 
  
  return {
    total_user,
    total_payment,
    total_revenue,
    total_subscription,
    total_post,
    running_month_revenue,
    monthsData,
  };
};

const getCurrentUserOverviewDataFromDB = async (userId: string, query: any) => {
  const user = await User.findById(userId).select('latest_subscription');
  
  const latest_subscription = user?.latest_subscription

  // Getting all post of the user
  const posts = await Post.find({ author: objectId(userId) });
  const total_post = posts.length;
  const total_earning = 0;

  const comments = await Comment.find({post:{$in:posts.map(i=>i._id)}}).countDocuments()
   const total_reaction = posts.reduce((p,c)=>p+c.total_upvote!+c.total_downvote!,0)
  let subscription_end_in = null;
  if(latest_subscription){
    subscription_end_in =  dateDifference(latest_subscription?.subscription_start_date,latest_subscription?.subscription_end_date).diffInDays
  }
 
  const result = {
    total_post,
    total_reaction,
    total_earning,
    subscription_end_in,
    total_comment:comments
  };
 

  return result;
};

const getPostOverviewDataFromDB = async (
  postId: string,
  query: { view_type: 'month' | 'year' },
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
  const total_reaction = await Reaction.find({ post: post._id }).countDocuments();
  const total_reader = await Reader.find({ post: post._id }).countDocuments();
  

  let readers_summery;
  let comments_summery;
  let reactions_summery;
  
  const overview_type = query.view_type

  if (query.view_type === 'year') {
    const comments = await Comment.find({
      createdAt: { $lte: last_date_of_Year },
    });

    comments_summery = months.map((month, monthNumber) => {
      const total_comment = comments.filter(
        (comment) => new Date(comment.createdAt).getMonth() === monthNumber,
      ).length;
      return {
        type:overview_type,
        month: month,
        value:total_comment,
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
        type:overview_type,
        month: month,
        value:total_reaction,
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
        type:overview_type,
        month: month,
        value:total_reader,
        upcoming: new Date().getMonth() < monthNumber, // Checking  upcoming month (if month number is getter than  current month number then true otherwise false)
      };
    });
  } else {
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

   
    const reactionsOfCurrentDate = await Reaction.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    comments_summery = monthDates.map((date) => {
      const total_comment = commentsOfCurrentDate.filter(
        (comment) => new Date(comment.createdAt).getDate() === date,
      ).length;
      return {
        day:date,
        value: total_comment,
        upcoming: new Date().getMonth() < date, // Checking  upcoming day (if month number is getter than  current date number then true otherwise false)
      };
    });

    readers_summery = monthDates.map((date) => {
      const total_reader = reactionsOfCurrentDate.filter(
        (reader) => new Date(reader.createdAt).getDate() === date,
      ).length;
      return {
        type:overview_type,
        day:date,
        value:total_reader,
        upcoming: new Date().getMonth() < date, // Checking  upcoming day (if month number is getter than  current date number then true otherwise false)
      };
    });

    reactions_summery = monthDates.map((date) => {
      const total_reaction = commentsOfCurrentDate.filter(
        (comment) => new Date(comment.createdAt).getDate() === date,
      ).length;
      return {
        type:overview_type,
        day:date,
       value: total_reaction,
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
