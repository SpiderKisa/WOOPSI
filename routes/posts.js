const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');

const upload = multer({ storage });

const { isLoggedIn, validatePost, isPostAuthor } = require('../middleware');
const posts = require('../controllers/posts');

router.route('/')
    .get(posts.index)
    .post(isLoggedIn, validatePost, posts.createNewPost)

router.get('/new', isLoggedIn, posts.renderNewForm)

router.post('/upload', isLoggedIn, upload.any(), posts.upload);

router.route('/:id')
    .get(posts.show)
    .put(isPostAuthor, validatePost, posts.edit)
    .delete(isLoggedIn, isPostAuthor, posts.delete)

router.get('/:id/edit', isLoggedIn, isPostAuthor, posts.renderEditForm)

router.put('/:id/upvote', isLoggedIn, posts.upvote);
router.put('/:id/downvote', isLoggedIn, posts.downvote);


module.exports = router;