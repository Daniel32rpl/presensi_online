const Joi = require('joi')

const validateAttendance = (req, res, next) => {
    const rules = Joi
        .object()
        .keys({
            user_id: Joi.number().integer().required().messages({
                "number.base": "User ID harus berupa angka",
                "number.integer": "User ID harus berupa angka integer",
                "any.required": "User ID wajib diisi",
            }),
            date: Joi.string().isoDate().required().messages({
                "string.base": "Tanggal harus berupa string",
                "string.isoDate": "Tanggal harus dalam format ISO (YYYY-MM-DD)",
                "any.required": "Tanggal wajib diisi",
            }),
            time: Joi.string().pattern(/^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/).required().messages({
                "string.base": "Waktu harus berupa string",
                "string.pattern.base": "Waktu harus dalam format HH:MM:SS",
                "any.required": "Waktu wajib diisi",
            }),
            status: Joi.string().valid(`hadir`, `izin`, `sakit`).required().messages({
                "string.base": "Status harus berupa string",
                "any.only": "Status hanya boleh 'hadir', 'izin', atau 'sakit'",
                "any.required": "Status wajib diisi",
            }),
        })
        .options({ abortEarly: false });

    const { error } = rules.validate(req.body);

    if (error) {
        const errMessage = error.details.map((detail) => detail.message).join(",");

        return res.status(422).json({
            status: "error",
            message: errMessage,
        });
    }

    next();
};

module.exports = { validateAttendance };
