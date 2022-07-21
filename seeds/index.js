const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
//const Comment = require('../models/comment');
const names = require('./names');
const firstCount = names.first.length;
const lastCount = names.last.length;

mongoose.connect('mongodb://localhost:27017/project001');

const seedDB = async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const user = new User({
            firstName: names.first[Math.floor(Math.random() * firstCount)],
            lastName: names.last[Math.floor(Math.random() * lastCount)]
        });
        await user.save();
    }

    const users = User.find({}).cursor();
    for await (const user of users) {
        for (let i = 0; i < 20; i++) {
            const post = new Post({
                author_id: user._id,
                creation_date: new Date(),
                header: 'Lorem ipsum dolor sit amet',
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            });
            await post.save();
        }
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})
