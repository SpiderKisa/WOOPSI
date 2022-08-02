const Joi = require('joi');

const PostSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        image: Joi.string()
    }).required()
})

module.exports.PostSchema = PostSchema;

const CommentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required()
    }).required()
})

module.exports.CommentSchema = CommentSchema;