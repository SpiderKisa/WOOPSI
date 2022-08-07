const express = require('express');
const router = express.Router();

const ExpressError = require('../utilities/ExpressError');
const { catchAsync } = require('../utilities/catchAsync');
const { isLoggedIn } = require('../middleware');

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
    req.flash('error', 'Пост не найден');
    res.redirect('/posts');
}

router.get('/', catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).limit(30);
    res.render('post/index', { posts, title: 'Все посты' });
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res, next) => {
    res.render('post/new', { title: 'Создать новый пост' });
}))

router.post('/', isLoggedIn, validatePost, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    await post.save();
    // req.flash('success', 'Новый пост опубликован');
    res.redirect(`/posts/${post._id}`);
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments').populate('author');
    if (!post) PostNotFound(req, res);
    res.render('post/show', { post, title: post.title });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        PostNotFound(req, res);
    } else {
        res.render('post/edit', { post, title: `Редактировать - ${post.title}` });
    }
}))

router.put('/:id', validatePost, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Пост успешно редактирован');
    res.redirect(`/posts/${post._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Пост успешно удален');
    res.redirect('/posts');
}))

module.exports = router;