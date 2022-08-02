const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comment', CommentSchema);