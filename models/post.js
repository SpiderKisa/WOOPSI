const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comment');

const postSchema = new Schema({

    // creation_date: {
    //     type: Date,
    //     default: new Date(),
    //     required: true
    // },
    // last_modified: {
    //     type: Date
    // },
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
    ]
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