const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comment');

const postSchema = new Schema({

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    votes: {
        positive: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        negative: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        total:
        {
            type: Number,
            default: 0
        }
    }

});


postSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        });
    }
});


module.exports = mongoose.model('Post', postSchema);