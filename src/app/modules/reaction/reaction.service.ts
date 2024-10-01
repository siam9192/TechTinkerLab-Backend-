import { objectId } from '../../utils/function';
import Post from '../post/post.model';
import { VoteType } from '../../utils/constant';
import Reaction from './reaction.model';



const upsertReactionIntoDB = async (
  userId: string,
  payload: { postId: string; vote_type: 'UP' | 'DOWN' | '' },
) => {
  let reaction = await Reaction.findOne({
    post: objectId(payload.postId),
    user: objectId(userId),
  }).populate('post');

  if (!reaction) {
    const data = {
      user: userId,
      post: payload.postId,
      vote:{
        upvote:payload.vote_type === 'UP',
        downvote:payload.vote_type === 'DOWN',
      }
    };
 
   return await Reaction.create(data);
  }

  const vote: any = {};

  if (payload.vote_type === 'UP') {
    (vote.upvote = true), (vote.downvote = false);
    await Post.findByIdAndUpdate(payload.postId, { $inc: { total_upvote: 1 } });
    if (reaction.vote.downvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_downvote: -1 },
      });
    }
  } else if (payload.vote_type === 'DOWN') {
    vote.downvote = true;
    vote.upvote = false;

    await Post.findByIdAndUpdate(payload.postId, {
      $inc: { total_downvote: 1 },
    });

    if (reaction.vote.upvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_upvote: -1 },
      });
    }
  } else if (payload.vote_type === '') {
  
    if (reaction.vote.upvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_upvote: -1 },
      });
    } else if (reaction.vote.downvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_downvote: -1 },
      });
    }
   return  await Reaction.deleteOne({_id:reaction._id},{new:true})
  }

  await Reaction.findByIdAndUpdate(
    reaction._id,
    { vote },
    { runValidators: true },
  );
};

const getUserReactionOfPostFromDB = async (userId: string, postId: string) => {
  const reaction = await Reaction.findOne({
    user: objectId(userId),
    post: objectId(postId),
  });

  let vote_type = VoteType.EMPTY;
  const vote = reaction?.vote;

  if (vote?.upvote) {
    vote_type = VoteType.UP;
  } else if (vote?.downvote) {
    vote_type = VoteType.DOWN;
  }

  return {
    vote_type,
  };
};

export const ReactionService = {
  upsertReactionIntoDB,
  getUserReactionOfPostFromDB

};
