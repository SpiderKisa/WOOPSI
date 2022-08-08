const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.register);

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;