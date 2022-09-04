const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comment');

const postSchema = new Schema({

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parts: [
        {
            partType: {
                type: String,
                required: true,
                enum: ['image', 'text']
            },
            src: String,
            filename: String,
            text: String,
            _id: false,
        }
    ],
    title: {
        type: String,
        required: true
    },
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