const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');

const ExpressError = require('./utilities/ExpressError');
const { catchAsync } = require('./utilities/catchAsync');

const Post = require('./models/post');
const PostSchema = require('./schemas/post');

mongoose.connect('mongodb://localhost:27017/project001')
    .then(() => {
        console.log('MONGO CONNECTION OPEN');
    }).catch(e => {
        console.log('MONGO CONNECTION ERROR');
        console.log(e);
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('assets'));

const validatePost = (req, res, next) => {
    const { error } = PostSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(e => e.message).join(','), 400);
    }
    next();
}

function PostNotFound() {
    throw new ExpressError('Post not found', 404);
}

app.get('/posts', catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).limit(30);
    res.render('post/index', { posts, title: 'All Posts' });
}))

app.get('/posts/new', catchAsync(async (req, res, next) => {
    res.render('post/new', { title: 'Create New Post' });
}))

app.post('/posts', validatePost, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    await post.save();
    res.redirect(`/posts/${post._id}`);
}))

app.get('/posts/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) PostNotFound()
    res.render('post/show', { post, title: post.title });
}))

app.get('/posts/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) PostNotFound()
    res.render('post/edit', { post, title: post.title });
}))

app.put('/posts/:id', validatePost, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post);
    if (!post) PostNotFound()
    res.redirect(`/posts/${post._id}`);
}))

app.delete('/posts/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) PostNotFound()
    res.redirect('/posts');
}))

app.all('*', (req, res, next) => { //for every path that didn't match previous ones
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    res.render('error', { err, title: `Ошибка ${err.statusCode}` });
})

let port = 3000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
