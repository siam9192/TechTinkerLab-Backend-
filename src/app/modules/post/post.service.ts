import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { getCustomizePostData, objectId } from '../../utils/function';
import User from '../user/user.model';
import { IPost } from './post.interface';
import Post from './post.model';
import { startSession } from 'mongoose';
import Reader from '../reader/reader.model';

const createPostIntoDB = async (userId: string, payload: IPost) => {
  payload.author = objectId(userId);
  const session = await startSession();
  await session.startTransaction();
  
  try {
    const createdPost = await Post.create([payload], { session });
    // Checking is the post created successfully
    if (!createdPost) {
      throw new Error();
    }

    const updatedUserStatus = await User.updateOne(
      { _id: objectId(userId) },
      { $inc: { total_post: 1 } },
    );

    // Checking  is the user post count updates successfully
    if (!updatedUserStatus.modifiedCount) {
      throw new Error();
    }
    await session.commitTransaction();
    await session.endSession();

    return createdPost;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Post can not be created.something went wrong',
    );
  }
};



const getPostsFromDB = async (query: any) => {
  
 const sort  = query.sort
  const sorts = [
    {
      type:'posted Time (ace)',
       value:'createdAt'
    },
    {
      type:'upvote (ace)',
       value:'total_upvote'
    },
    {
      type:'upvote (dec)',
       value:'-total_upvote'
    },
    {
      type:'downvote (ace)',
       value:'createdAt'
    },
    {
      type:'downvote (dec)',
       value:'-createdAt'
    }
  ]
  
  sorts.forEach(item=>{
    if(item.type === sort){
      query.sort = item.value
    }
  })
    query.limit = 3
  let result = await new QueryBuilder(Post.find(), query)
    .find()
    .textSearch()
    .sort()
    .paginate()
    .populate('author')
    .get();
  const meta = await new QueryBuilder(Post.find(), query)
    .find()
    .textSearch()
    .getMeta();

  result = result.map((post) => getCustomizePostData(post));
  return {
    result,
    meta,
  };
};

const getPostByIdFromDB = async (postId:string)=>{
  return await Post.findById(postId)
}

const getCurrentUserPostsFromDB = async (userId:string)=>{
  return await Post.find({author:objectId(userId)}).select('title thumbnail  category is_premium createdAt')
}

const getPostForUserReadFromDB = async (userId: string, postId: string) => {
  if (!postId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post id is is required');
  }


  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userLatestSubscription = user.latest_subscription;

  const post = await Post.findById(postId)
    .select(
      'title content category thumbnail tags is_premium total_upvote total_downvote total_read total_reader author',
    )
    .populate('author');

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  //  Only post author,admin and moderator can access this post with out verification
  if (user.role === 'USER' && userId !== post.author._id.toString()) {
    
    //  Checking is user verified by comparing current date and subscription end date
    const is_verified = userLatestSubscription
    ? new Date(userLatestSubscription.subscription_end_date).getTime() >
     Date.now()
    : false;
    //  if user is not verified and the post is premium content then throw an error
    if (
      post.author._id.toString() !== userId &&
      post.is_premium &&
      !is_verified
    ) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'This is premium content.Please Subscribe our monthly package to  access all of premium contents',
      );
    }
  }

  const reader = await Reader.findOne({user:objectId(userId)})
  
  if(reader){
  await Post.findByIdAndUpdate(postId,{$inc:{total_reader:1}})
  }
  
  else {
  // Creating the new reader of the post
 await Reader.create({user:userId,post:postId});
  }
   // await Post.findByIdAndUpdate(postId,{total_reader:{$inc:1}})
 await Post.findByIdAndUpdate(postId,{$inc:{total_read:1}})
 
  const result = getCustomizePostData(post);

  return result;
};

export const updatePostIntoDB = async (
  userId: string,
  postId: string,
  payload: Partial<IPost>,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  } else if (post.author.toString() !== userId) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Post can not be updated');
  }
  
  const updatedPost = await Post.updateOne({_id:objectId(postId)}, payload);
   
  if (!updatedPost.modifiedCount) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Post can not be updated');
  }
  return null;
};

const deletePostFromDB = async (userId: string, postId: string) => {
  const post = await Post.findById(postId);

  //  Checking post existence
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // // Checking is the author of this post is user
  // else if (post.author.toString() !== userId) {
  //   throw new AppError(httpStatus.BAD_GATEWAY, 'Post can not be deleted');
  // }

  const session = await startSession();
  await session.startTransaction();

  try {
    // Deleting post
    const deleteStatus = await Post.deleteOne({ _id: post._id }, { session });

    // Checking the post successfully deleted
    if (!deleteStatus.deletedCount) {
      throw new Error();
    }

    const userUpdateStatus = await User.updateOne(
      { _id: objectId(userId) },
      { $inc: { total_post: -1 } },
      { session },
    );

    // Checking the user post count undated successfully
    if (!userUpdateStatus.modifiedCount) {
      throw new Error();
    }

    await session.commitTransaction();
    await session.endSession();
    return null;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Post can not be deleted something went wrong',
    );
  }
};

const getProfilePostsFromDB = async (username:string)=>{
  const user = await User.findOne({username})
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND,'User not found')
  }
 const result = await Post.find({author:user?._id}).populate('author')
 return result.map((post) => getCustomizePostData(post));
 
}



export const PostService = {
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
  getPostByIdFromDB,
  getPostsFromDB,
  getPostForUserReadFromDB,
  getCurrentUserPostsFromDB,
  getProfilePostsFromDB,
};
