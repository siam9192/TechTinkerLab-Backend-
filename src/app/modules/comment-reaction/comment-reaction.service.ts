import { objectId } from '../../utils/function';
import Comment from '../comment/comment.model';
import { CommentReaction } from './comment-reaction.model';

const upsertCommentReactionIntoDB = async (
  userId: string,
  payload: { commentId: string; vote_type: 'UP' | 'DOWN' | '' },
) => {
  const vote_type = payload.vote_type;

  let reaction = await CommentReaction.findOne({
    comment: objectId(payload.commentId),
    user: objectId(userId),
  }).populate('post');

  if (!reaction) {
    const comment = await Comment.findById(payload.commentId);

    const data = {
      user: userId,
      comment: payload.commentId,
      post: comment?.post,
      vote_type,
    };

    return await CommentReaction.create(data);
  }

  if (vote_type === 'UP') {
    await Comment.findByIdAndUpdate(payload.commentId, {
      $inc: { total_upvote: 1 },
    });
    if (reaction.vote_type === 'DOWN') {
      await Comment.findByIdAndUpdate(payload.commentId, {
        $inc: { total_downvote: -1 },
      });
    }
  } else if (vote_type === 'DOWN') {
    await Comment.findByIdAndUpdate(payload.commentId, {
      $inc: { total_downvote: 1 },
    });

    if (reaction.vote_type === 'UP') {
      await Comment.findByIdAndUpdate(payload.commentId, {
        $inc: { total_upvote: -1 },
      });
    }
  } else if (vote_type === '') {
    if (reaction.vote_type === 'UP') {
      await Comment.findByIdAndUpdate(payload.commentId, {
        $inc: { total_upvote: -1 },
      });
    } else if (reaction.vote_type === 'DOWN') {
      await Comment.findByIdAndUpdate(payload.commentId, {
        $inc: { total_downvote: -1 },
      });
    }
    return await CommentReaction.deleteOne(
      { _id: reaction._id },
      { new: true },
    );
  }

  return await CommentReaction.findByIdAndUpdate(
    reaction._id,
    { vote_type: vote_type },
    { runValidators: true, new: true },
  );
};

const getCurrentUserCommentsReactionOfPostFromDB = async (
  userId: string,
  postId: string,
) => {
  const reactions = await CommentReaction.find({
    user: objectId(userId),
    post: objectId(postId),
  });
  return reactions.map((reaction) => ({
    comment: reaction.comment,
    vote_type: reaction.vote_type,
  }));
};

export const CommentReactionService = {
  upsertCommentReactionIntoDB,
  getCurrentUserCommentsReactionOfPostFromDB,
};
