import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import QueryBuilder from "../../middlewares/QueryBuilder";
import { objectId } from "../../utils/function";
import User from "../user/user.model";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPostIntoDB = async(userId:string,payload:IPost)=>{
    payload.author = objectId(userId)
    return await Post.create(payload)
}

const getPostsFromDB = async (query:any)=>{
    const result = await new QueryBuilder(Post.find(),query).find().textSearch().sort().paginate().populate('author').get()
    const meta = await new QueryBuilder(Post.find(),query).find().textSearch().getMeta()
    return {
        result,
        meta
    }
}

const getPostForUserReadFromDB  = async(userId:string,postId:string)=>{
    
    if(!postId){
        throw new AppError(httpStatus.NOT_FOUND,'Post id is is required')
    }

    const user = await User.findById(userId)
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'User not found')
    }

    const userLatestSubscription = user.latest_subscription;

    //  Checking is user verified by comparing current date and subscription end date
    const isUserVerified = userLatestSubscription
      ? new Date(userLatestSubscription.subscription_end_date).valueOf() <
        new Date().valueOf()
      : false;
   
      const post = await Post.findById(postId).select('title content category tags is_premium total_upvote total_downvote total_read total_reader author').populate('author')

      if(!post){
        throw new AppError (httpStatus.NOT_FOUND,'Post not found')
      }
    //  if user is not verified and the post is premium content then throw an error
      if(post.is_premium && !isUserVerified){
         throw new AppError(httpStatus.NOT_ACCEPTABLE,'This is premium content.Please Subscribe our monthly package to  access all of premium contents')
      }
      const doc:any = {...post}
      const latest_subscription = doc._doc.author.latest_subscription

      const is_verified = userLatestSubscription
    ? new Date(userLatestSubscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;
     
    
      return post
} 

export const PostService = {
    createPostIntoDB,
    getPostsFromDB,
    getPostForUserReadFromDB
}