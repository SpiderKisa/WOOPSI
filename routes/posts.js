const express = require('express');
const router = express.Router();

const { isLoggedIn, validatePost, isPostAuthor } = require('../middleware');
const posts = require('../controllers/posts');

router.route('/')
    .get(posts.index)
    .post(isLoggedIn, validatePost, posts.createNewPost)

router.get('/new', isLoggedIn, posts.renderNewForm)

router.route('/:id')
    .get(posts.show)
    .put(validatePost, isPostAuthor, posts.edit)
    .delete(isLoggedIn, isPostAuthor, posts.delete)

router.get('/:id/edit', isLoggedIn, isPostAuthor, posts.renderEditForm)

router.put('/:id/upvote', isLoggedIn, posts.upvote);
router.put('/:id/downvote', isLoggedIn, posts.downvote);

module.exports = router;