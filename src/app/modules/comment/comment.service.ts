import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import {
  getCustomizePostData,
  getCustomizeUserData,
  objectId,
} from '../../utils/function';
import Post from '../post/post.model';
import Comment from './comment.model';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { CommentReaction } from '../comment-reaction/comment-reaction.model';

const createCommentIntoDB = async (
  userId: string,
  payload: { postId: string; comment: string },
) => {
  const post = await Post.exists({ _id: objectId(payload.postId) });

  // Checking post existence
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  const commentData = {
    comment: payload.comment,
    post: payload.postId,
    author: userId,
  };
  await Post.findByIdAndUpdate(payload.postId,{$inc:{total_comment:1}})
  return await Comment.create(commentData);
};

const updateCommentIntoDB = async (
  userId: string,
  payload: { commentId: string; comment: string },
) => {
  const comment = await Comment.findById(payload.commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  if (comment.author.toString() !== userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Comment can not be updated');
  }
  
  return await Comment.findByIdAndUpdate(
    payload.commentId,
    { comment: payload.comment },
    { new: true, runValidators: true },
  );
};

const deleteCommentFromDB = async (userId: string, commentId: string) => {
  const comment = await Comment.findById(commentId);
   
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  //  Checking is that user is author of this comment
  if (comment.author.toString() !== userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Comment can not be updated');
  }
  // const reaction = await CommentReaction.findOne({comment:comment._id,user:objectId(userId)})

  // if(reaction){
  //   if(reaction.vote_type === 'DOWN'){

  //   }
  // }
  await Post.findByIdAndUpdate(comment.post,{$inc:{total_comment:-1}})
  return await Comment.findByIdAndDelete(commentId, { new: true });
};

const getPostCommentsFromDB = async (postId: string, query: any) => {
  query.post = postId
 
  let comments: any[] = await new QueryBuilder(Comment.find(), query).find()
    .sort()
    .paginate()
    .populate('author')
    .get();
   

  const meta = await new QueryBuilder(Comment.find(), query).find().getMeta();

  comments =  comments.map((comment) => {
    comment.author = getCustomizeUserData(comment.author);
    return comment;
  });
 
  
  return {
    result: comments,
    meta,
  };
};

export const CommentService = {
  createCommentIntoDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
  getPostCommentsFromDB,
};
