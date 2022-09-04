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

const getPostParts = (postData) => {
    const imageType = `image${postData.userId}`;
    let parts = [];
    for (let input of postData.inputs) {
        const inputData = input.split('<>');
        if (inputData[0] === imageType) {
            const imageData = input.split('<>');
            parts.push({
                partType: 'image',
                src: imageData[1],
                filename: imageData[2]
            })
        } else {
            parts.push({
                partType: 'text',
                text: input
            })
        }
    }
    return parts;
}

module.exports.edit = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) PostNotFound(req, res);
    const postData = req.body.post;
    post.parts = getPostParts(postData);
    post.title = postData.title;
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

module.exports.createNewPost = catchAsync(async (req, res, next) => {
    const postData = req.body.post;
    const userId = postData.userId;
    const parts = getPostParts(postData);
    const post = new Post({
        title: postData.title,
        author: userId
    });

    post.parts.push(...parts);

    await post.save();

    res.redirect(`/posts/${post._id}`);
})