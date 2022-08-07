const express = require('express');
const router = express.Router({ mergeParams: true });

const { catchAsync } = require('../utilities/catchAsync');
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');

const Post = require('../models/post');
const Comment = require('../models/comment');

router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post_id}`);
}))

router.delete('/:comment_id', isLoggedIn, isCommentAuthor, catchAsync(async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    await Post.findByIdAndUpdate(post_id, { $pull: { comments: comment_id } });
    await Comment.findByIdAndDelete(comment_id);
    res.redirect(`/posts/${post_id}`);

}))

module.exports = router;