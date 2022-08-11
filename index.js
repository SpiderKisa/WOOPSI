const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utilities/ExpressError');

const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

const User = require('./models/user');

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
app.use(express.static(path.join(__dirname, 'assets')));

const sessionOptions = {
    secret: 'secretSecretSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
})

app.use('/posts', postRoutes);
app.use('/posts/:post_id/comments', commentRoutes);
app.use('/', userRoutes);


app.all('*', (req, res, next) => { //for every path that didn't match previous ones
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    res.render('error', { err, title: `Ошибка ${err.statusCode}` });
})

let port = 3000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
