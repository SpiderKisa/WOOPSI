const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    autor_id: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    },
    is_reply: {
        type: Boolean,
        default: false,
        required: true
    },
    reply_id: {
        type: String
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);