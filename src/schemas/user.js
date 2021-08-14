import Joi from "joi"

export const schema = Joi.object().keys({
  email: Joi.string().email().required().label("Email"),
  username: Joi.string().alphanum().min(4).max(30).required().label("Username"),
  name: Joi.string().max(254).required().label("Name"),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/)
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character",
    }),
})
