const Joi = require(`joi`);

const validateUser = (req, res, next) => {
    const rules = Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('siswa','guru')
    }).options({ abortEarly: false })

    let { error } = rules.validate(req.body)

    if (error != null) {
        let errMessage = error.details.map(it => it.message).join(",")
        return res.status(422).json({
            success: false,
            message: errMessage
        })
    }
    next()
}

module.exports = { validateUser }