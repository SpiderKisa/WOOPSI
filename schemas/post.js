const Joi = require('joi');

const PostSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        image: Joi.string()
    })
})

module.exports = PostSchema;