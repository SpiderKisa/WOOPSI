const express = require('express');
const router = express.Router({ mergeParams: true });

const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');

router.post('/', isLoggedIn, validateComment, comments.createNewComment);

router.delete('/:comment_id', isLoggedIn, isCommentAuthor, comments.delete);

module.exports = router;