const { PostSchema, CommentSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError')

const Post = require('./models/post');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Для продолжения необходимо войти в аккаунт');
        return res.redirect('/login');
    }
    next();
}

module.exports.isPostAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('Недостаточно прав для выполнения операции');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const comment = await Comment.findById(comment_id);
    if (!comment.author.equals(req.user._id)) {
        req.flash('Недостаточно прав для выполнения операции');
        return res.redirect(`/posts/${post_id}`);
    }
    next();
}

module.exports.validatePost = (req, res, next) => {
    const { error } = PostSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(e => e.message).join(','), 400);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = CommentSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(e => e.message).join(','), 400);
    }
    next();
}

