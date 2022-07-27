const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({

    creation_date: {
        type: Date,
        default: new Date(),
        required: true
    },
    last_modified: {
        type: Date
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: String
});

module.exports = mongoose.model('Post', postSchema);