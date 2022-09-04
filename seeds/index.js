const mongoose = require('mongoose');
const Post = require('../models/post');
// const names = require('./names');
// const firstCount = names.first.length;
// const lastCount = names.last.length;

mongoose.connect('mongodb://localhost:27017/project001');

const seedDB = async () => {
    await Post.deleteMany({});

    for (let i = 0; i < 20; i++) {
        let parts = [];
        parts.push({ partType: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet consectetur adipiscing elit pellentesque habitant. Mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Tortor condimentum lacinia quis vel eros donec. Tellus molestie nunc non blandit massa. Sit amet tellus cras adipiscing. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Rhoncus aenean vel elit scelerisque mauris pellentesque. Dolor magna eget est lorem ipsum. Dui faucibus in ornare quam viverra orci sagittis. Vestibulum morbi blandit cursus risus at ultrices mi. Fermentum iaculis eu non diam. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Molestie nunc non blandit massa enim nec dui nunc.' });
        parts.push({ partType: 'image', src: 'https://res.cloudinary.com/dipba530d/image/upload/v1662283974/PROJECT001/u5s2c4w88mv6uvuwyccr.png', filename: 'PROJECT001/u5s2c4w88mv6uvuwyccr' })
        parts.push({ partType: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet consectetur adipiscing elit pellentesque habitant. Mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Tortor condimentum lacinia quis vel eros donec. Tellus molestie nunc non blandit massa. Sit amet tellus cras adipiscing. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Rhoncus aenean vel elit scelerisque mauris pellentesque. Dolor magna eget est lorem ipsum. Dui faucibus in ornare quam viverra orci sagittis. Vestibulum morbi blandit cursus risus at ultrices mi. Fermentum iaculis eu non diam. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Molestie nunc non blandit massa enim nec dui nunc.' });
        const post = new Post({
            author: '62ef5ffb47dacbf6a3d00af9',
            title: 'Lorem ipsum dolor sit amet',
            parts
        });
        await post.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
