import { objectId } from '../../utils/function';
import Post from '../post/post.model';
import { VoteType } from '../../utils/constant';
import PostReaction from './post-reaction.model';

const upsertPostReactionIntoDB = async (
  userId: string,
  payload: { postId: string; vote_type: 'UP' | 'DOWN' | '' },
) => {
  const vote_type = payload.vote_type;

  let reaction = await PostReaction.findOne({
    post: objectId(payload.postId),
    user: objectId(userId),
  }).populate('post');

  if (!reaction) {
    const data = {
      user: userId,
      post: payload.postId,
      vote_type,
    };

    return await PostReaction.create(data);
  }

  if (payload.vote_type === 'UP') {
    await Post.findByIdAndUpdate(payload.postId, { $inc: { total_upvote: 1 } });
    if (reaction.vote_type === 'DOWN') {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_downvote: -1 },
      });
    }
  } else if (vote_type === 'DOWN') {
    await Post.findByIdAndUpdate(payload.postId, {
      $inc: { total_downvote: 1 },
    });

    if (reaction.vote_type === 'UP') {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_upvote: -1 },
      });
    }
  } else if (payload.vote_type === '') {
    if (reaction.vote_type === 'UP') {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_upvote: -1 },
      });
    } else if (reaction.vote_type === 'DOWN') {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_downvote: -1 },
      });
    }
    return await PostReaction.deleteOne({ _id: reaction._id }, { new: true });
  }

  await PostReaction.findByIdAndUpdate(
    reaction._id,
    { vote_type },
    { runValidators: true },
  );
};

const getUserReactionOfPostFromDB = async (userId: string, postId: string) => {
  const reaction = await PostReaction.findOne({
    user: objectId(userId),
    post: objectId(postId),
  });

  let vote_type = reaction?.vote_type || null;

  return {
    vote_type,
  };
};

export const ReactionService = {
  upsertPostReactionIntoDB,
  getUserReactionOfPostFromDB,
};
