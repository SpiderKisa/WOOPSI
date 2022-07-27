const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const Post = require('./models/post');

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
    res.render('post/index', { posts, title: 'All Posts' });
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


app.use((req, res) => { //for every path that didn't match previous ones
    res.status(404).send('404 NOT FOUND');
})

let port = 3000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
