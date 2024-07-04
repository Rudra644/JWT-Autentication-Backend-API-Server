import Joi from 'joi';

export const validateRegister = (data: any) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });
    return schema.validate(data);
};

export const validateLogin = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });
    return schema.validate(data);
};
