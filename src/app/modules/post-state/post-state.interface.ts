import { Types } from "mongoose";

export interface IPostState {
    post:Types.ObjectId,
    user:Types.ObjectId,
    vote:{
        upvote:boolean,
        downvote:boolean
    },
    last_read_at:Date
}


