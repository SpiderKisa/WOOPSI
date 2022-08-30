const { model } = require('mongoose');
const Post = require('../models/post');
const { catchAsync } = require('../utilities/catchAsync');

function PostNotFound(req, res) {
    req.flash('error', 'Пост не найден');
    res.redirect('/posts');
}

module.exports.index = catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).limit(30);
    res.render('post/index', { posts, title: 'Все посты' });
});

module.exports.renderNewForm = (req, res, next) => {
    res.render('post/new', { title: 'Создать новый пост' });
};

const getImagesFromRequest = (req) => {
    return req.files.map(f => ({ url: f.path, filename: f.filename }));
}

module.exports.createNewPost = catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    post.images = getImagesFromRequest(req);
    post.author = req.user._id;
    await post.save();
    res.redirect(`/posts/${post._id}`);
});

module.exports.show = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!post) PostNotFound(req, res);
    res.render('post/show', { post, title: post.title });
});

module.exports.renderEditForm = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        PostNotFound(req, res);
    } else {
        res.render('post/edit', { post, title: `Редактировать - ${post.title}` });
    }
});

module.exports.edit = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post);
    if (!post) PostNotFound(req, res);
    console.log(post.images);
    post.images = getImagesFromRequest(req);
    console.log(post.images);
    await post.save();
    req.flash('success', 'Пост успешно редактирован');
    res.redirect(`/posts/${post._id}`);
});

module.exports.delete = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) PostNotFound(req, res);
    req.flash('success', 'Пост успешно удален');
    res.redirect('/posts');
});

module.exports.upvote = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user_id = req.user._id;

    const upvoted = post.votes.positive.includes(user_id);
    const downvoted = post.votes.negative.includes(user_id);

    if (upvoted) {
        post.votes.positive.splice(post.votes.positive.indexOf(user_id), 1);
        post.votes.total -= 1;
    } else {

        if (downvoted) {
            post.votes.negative.splice(post.votes.negative.indexOf(user_id), 1);
            post.votes.total += 1;
        }

        post.votes.positive.push(user_id);
        post.votes.total += 1;
    }

    await post.save();
    res.json({ total: post.votes.total, post_id: id });
})

module.exports.downvote = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user_id = req.user._id;

    const upvoted = post.votes.positive.includes(user_id);
    const downvoted = post.votes.negative.includes(user_id);

    if (downvoted) {
        post.votes.negative.splice(post.votes.negative.indexOf(user_id), 1);
        post.votes.total += 1;
    } else {

        if (upvoted) {
            post.votes.positive.splice(post.votes.positive.indexOf(user_id), 1);
            post.votes.total -= 1;
        }

        post.votes.negative.push(user_id);
        post.votes.total -= 1;
    }

    await post.save();

    res.json({ total: post.votes.total, post_id: id });
})

module.exports.upload = catchAsync(async (req, res, next) => {
    const file = req.files[0];
    res.json({ url: file.path, filename: file.filename });
})