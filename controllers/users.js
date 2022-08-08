const User = require('../models/user');
const { catchAsync } = require('../utilities/catchAsync');

module.exports.renderRegisterForm = (req, res, next) => {
    res.render('users/register', { title: 'Регистрация' });
};

module.exports.register = catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome!');
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            };
            res.redirect('/posts');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

module.exports.renderLoginForm = (req, res, next) => {
    res.render('users/login', { title: 'Вход в аккаунт' });
};

module.exports.login = (req, res, next) => {
    const redirectUrl = req.session.returnTo || '/posts'; //doesn't work. after using middleware session doesn't have returnTo field
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/posts');
    });
};
