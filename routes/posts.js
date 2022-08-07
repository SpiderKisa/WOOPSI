const express = require('express');
const router = express.Router();

const { catchAsync } = require('../utilities/catchAsync');
const { isLoggedIn, validatePost, isPostAuthor } = require('../middleware');

const Post = require('../models/post');


function PostNotFound(req, res) {
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
    post.author = req.user._id;
    await post.save();
    res.redirect(`/posts/${post._id}`);
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(post);
    if (!post) PostNotFound(req, res);
    res.render('post/show', { post, title: post.title });
}))

router.get('/:id/edit', isLoggedIn, isPostAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        PostNotFound(req, res);
    } else {
        res.render('post/edit', { post, title: `Редактировать - ${post.title}` });
    }
}))

router.put('/:id', validatePost, isPostAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Пост успешно редактирован');
    res.redirect(`/posts/${post._id}`);
}))

router.delete('/:id', isLoggedIn, isPostAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Пост успешно удален');
    res.redirect('/posts');
}))

module.exports = router;