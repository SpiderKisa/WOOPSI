const express = require('express');
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utilities/ExpressError');
const { catchAsync } = require('../utilities/catchAsync');
const { isLoggedIn } = require('../middleware');

const { CommentSchema } = require('../schemas');
const Post = require('../models/post');
const Comment = require('../models/comment');

const validateComment = (req, res, next) => {
    const { error } = CommentSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(e => e.message).join(','), 400);
    }
    next();
}

router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    const comment = new Comment(req.body.comment);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post_id}`);
}))

router.delete('/:comment_id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    await Post.findByIdAndUpdate(post_id, { $pull: { comments: comment_id } });
    await Comment.findByIdAndDelete(comment_id);
    res.redirect(`/posts/${post_id}`);

}))

module.exports = router;