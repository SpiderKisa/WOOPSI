const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: BaseJoi.string(),
    messages: {
        'string.EscapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value);
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

const PostSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required().escapeHTML(),
        userId: Joi.string().required(),
        inputs: Joi.array(),
    }).required()
})

module.exports.PostSchema = PostSchema;

const CommentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.CommentSchema = CommentSchema;

