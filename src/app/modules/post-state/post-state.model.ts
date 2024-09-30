const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const PostStateSchema = new Schema({
    post: {
        type: Types.ObjectId,
        ref: 'Post', 
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',  
        required: true
    },
    vote: {
        upvote: { type: Boolean, default: false },
        downvote: { type: Boolean, default: false }
    },
    last_read_at: {
        type: Date,
        default: Date.now
    }
});

const PostState = mongoose.model('PostState', PostStateSchema);

export default PostState
