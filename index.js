const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// const Joi = require('joi');

const ExpressError = require('./utilities/ExpressError');

const posts = require('./routes/posts');
const comments = require('./routes/comments');

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

app.use('/posts', posts);
app.use('/posts/:post_id/comments', comments);


app.all('*', (req, res, next) => { //for every path that didn't match previous ones
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    res.render('error', { err, title: `Ошибка ${err.statusCode}` });
})

let port = 3000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
