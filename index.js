const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Post = require('./models/post');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/project001')
    .then(() => {
        console.log('MONGO CONNECTION OPEN');
    }).catch(e => {
        console.log('MONGO CONNECTION ERROR');
        console.log(e);
    });

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/posts/new', async (req, res) => {
    res.render('post/new', { title: 'Create New Post' });
})

app.post('/posts', async (req, res) => {
    const post = new Post(req.body);
    await post.save();
    res.redirect(`/posts/${post._id}`);
})

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    // const author = await User.findById(post.author_id);
    // res.render('post/show', { post, title: post.title, author });
    res.render('post/show', { post, title: post.title });
})

app.get('/posts', async (req, res) => {
    const posts = await Post.find({}).limit(30);
    res.render('post/list', { posts });
})

app.get('/posts/:id/edit', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('post/edit', { post, title: post.title });
})

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    res.redirect(`/posts/${post._id}`);
})

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.redirect('/posts');
})

let port = 3000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
