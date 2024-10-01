import { objectId } from "../../utils/function";
import Comment from "../comment/comment.model";
import { CommentReaction } from "./comment-reaction.model";

const upsertCommentReactionIntoDB = async (
    userId: string,
    payload: { postId: string; vote_type: 'UP' | 'DOWN' | '' },
  ) => {
    let reaction = await CommentReaction.findOne({
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
   
     return await CommentReaction.create(data);
    }
  
    const vote: any = {};
  
    if (payload.vote_type === 'UP') {
      (vote.upvote = true), (vote.downvote = false);
      await Comment.findByIdAndUpdate(payload.postId, { $inc: { total_upvote: 1 } });
      if (reaction.vote.downvote) {
        await Comment.findByIdAndUpdate(payload.postId, {
          $inc: { total_downvote: -1 },
        });
      }
    } else if (payload.vote_type === 'DOWN') {
      vote.downvote = true;
      vote.upvote = false;
  
      await Comment.findByIdAndUpdate(payload.postId, {
        $inc: { total_downvote: 1 },
      });
  
      if (reaction.vote.upvote) {
        await Comment.findByIdAndUpdate(payload.postId, {
          $inc: { total_upvote: -1 },
        });
      }
    } else if (payload.vote_type === '') {
    
      if (reaction.vote.upvote) {
        await Comment.findByIdAndUpdate(payload.postId, {
          $inc: { total_upvote: -1 },
        });
      } else if (reaction.vote.downvote) {
        await Comment.findByIdAndUpdate(payload.postId, {
          $inc: { total_downvote: -1 },
        });
      }
     return  await CommentReaction.deleteOne({_id:reaction._id},{new:true})
    }
  
    await CommentReaction.findByIdAndUpdate(
      reaction._id,
      { vote },
      { runValidators: true },
    );
  };
  