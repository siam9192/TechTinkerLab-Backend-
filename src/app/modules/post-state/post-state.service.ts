import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { objectId } from '../../utils/function';
import Post from '../post/post.model';
import PostState from './post-state.model';
import { VoteType } from '../../utils/constant';

const upsertPostState = async (userId: string, postId: string) => {
  const state = await PostState.findOne({
    user: objectId(userId),
    post: objectId(postId),
  });
  if (state) {
    await PostState.findByIdAndUpdate(state._id, { last_read_at: new Date() });
  } else {
    const post = await Post.exists({ _id: objectId(postId) });
    //    Checking post existence
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
    }
    const data = {
      user: userId,
      post: postId,
    };
    await PostState.create(data);
  }
  return true;
};

const updateVoteStatusIntoDB = async (
  userId: string,
  payload: { postId: string; vote_type: 'UP' | 'DOWN' | '' },
) => {
  let postState = await PostState.findOne({
    post: objectId(payload.postId),
    user: objectId(userId),
  }).populate('post');

  if (!postState) {
    const data = {
      user: userId,
      post: payload.postId,
    };
    postState = await PostState.create(data);
  }

  const vote: any = {};

  if (payload.vote_type === 'UP') {
    (vote.upvote = true), (vote.downvote = false);
    await Post.findByIdAndUpdate(payload.postId, { $inc: { total_upvote: 1 } });
    if (postState.vote.downvote) {
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

    if (postState.vote.upvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_upvote: -1 },
      });
    }
  } else if (payload.vote_type === '') {
    (vote.upvote = false), (vote.downvote = false);
    if (postState.vote.upvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_upvote: -1 },
      });
    } else if (postState.vote.downvote) {
      await Post.findByIdAndUpdate(payload.postId, {
        $inc: { total_downvote: -1 },
      });
    }
  }

  await PostState.findByIdAndUpdate(
    postState._id,
    { vote },
    { runValidators: true },
  );
};

const getUserActivityOfPostFromDB = async (userId: string, postId: string) => {
  const postState = await PostState.findOne({
    user: objectId(userId),
    post: objectId(postId),
  });

  let vote_type = VoteType.EMPTY;
  const vote = postState?.vote;

  if (vote?.upvote) {
    vote_type = VoteType.UP;
  } else if (vote?.downvote) {
    vote_type = VoteType.DOWN;
  }

  return {
    vote_type,
  };
};

export const PostStateService = {
  upsertPostState,
  updateVoteStatusIntoDB,
  getUserActivityOfPostFromDB,
};
