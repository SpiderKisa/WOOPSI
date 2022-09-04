const Joi = require('joi');

const PostSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        userId: Joi.string().required(),
        inputs: Joi.array(),
    }).required()
})

module.exports.PostSchema = PostSchema;

const CommentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required()
    }).required()
})

module.exports.CommentSchema = CommentSchema;

