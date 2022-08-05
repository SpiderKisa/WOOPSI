const express = require('express');
const router = express.Router();

const ExpressError = require('../utilities/ExpressError');
const { catchAsync } = require('../utilities/catchAsync');
const { PostSchema } = require('../schemas');
const Post = require('../models/post');

const validatePost = (req, res, next) => {
    const { error } = PostSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(e => e.message).join(','), 400);
    }
    next();
}

function PostNotFound(req, res) {
    // throw new ExpressError('Post not found', 404);
    req.flash('error', 'Post not found');
    res.redirect('/posts');
}

router.get('/', catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).limit(30);
    res.render('post/index', { posts, title: 'All Posts' });
}))

router.get('/new', catchAsync(async (req, res, next) => {
    res.render('post/new', { title: 'Create New Post' });
}))

router.post('/', validatePost, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    await post.save();
    req.flash('success', 'Succesfully created a new post!');
    res.redirect(`/posts/${post._id}`);
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments');
    if (!post) PostNotFound(req, res);
    res.render('post/show', { post, title: post.title });
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        PostNotFound(req, res);
    } else {
        res.render('post/edit', { post, title: post.title });
    }
}))

router.put('/:id', validatePost, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Succesfully edited post!');
    res.redirect(`/posts/${post._id}`);
}))

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Succesfully deleted post!');
    res.redirect('/posts');
}))

module.exports = router;