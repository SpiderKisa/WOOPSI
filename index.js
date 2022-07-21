const express = require('express');
const { request } = require('http');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/project001')
    .then(() => {
        console.log('MONGO CONNECTION OPEN');
    }).catch(e => {
        console.log('MONGO CONNECTION ERROR');
        console.log(e);
    });

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('HELLLOO');
})

let port = 3000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
