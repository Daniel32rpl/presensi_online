const attendanceModel = require(`../models/index`).attendance
const userModel = require(`../models/index`).user
const moment = require(`moment`)
const Op = require(`sequelize`).Op
const { fn, col, literal } = require('sequelize');

exports.addAttendance = (request, response) => {
    let newAttendance = {
        user_id: request.body.user_id,
        date: request.body.date,
        time: request.body.time,
        status: request.body.status
    }

    attendanceModel.create(newAttendance)
        .then(attendance => {
            return response.json({
                status: "success",
                message: "Presensi berhasil dicatat",
                data: {
                    attendance_id: attendance.id,
                    user_id: attendance.user_id,
                    date: moment(attendance.date).format('YYYY-MM-DD'),
                    time: attendance.time,
                    status: attendance.status
                }
            })  
        })
        .catch(error => {
            return response.json({
                status: "error",
                message: error.message
            })
        })
}

exports.getAttendanceByuser_id = (request, response) => {
    let user_id = request.params.user_id;

    attendanceModel.findAll({ where: { user_id: user_id },
        attributes: [`id`, `date`, `time`, `status`]
    })
        .then(attendance => {
            return response.json({
                status: "success",
                data: attendance
            })
        })
        .catch(error => {
            return response.json({
                status: "error",
                message: error.message
            })
        })
}
exports.getMonthlyattendanceSummary = (request, response) => {
    const { user_id } = request.params;
    const year = request.query.year || moment().format('YYYY');
    const month = request.query.month || moment().format('MM');
    const formattedMonth = month.toString().padStart(2, '0');

    attendanceModel.findAll({
        where: {
            user_id: user_id,
            date: {
                [Op.between]: [`${year}-${formattedMonth}-01`,` ${year}-${formattedMonth}-31`],
            },
        },
        attributes: [
            [fn('MONTH', col('date')), 'month'],
            [fn('YEAR', col('date')), 'year'],
            [fn('COUNT', col('status')), 'total'],
            [literal("SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END)"), 'hadir'],
            [literal("SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END)"), 'izin'],
            [literal("SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END)"), 'sakit'],
            [literal("SUM(CASE WHEN status = 'alpa' THEN 1 ELSE 0 END)"), 'alpa'],
        ],
        group: ['year', 'month'],
        raw: true,
    })
        .then(data => {
            if (!data.length) {
                return response.status(404).json({
                    success: false,
                    message:` No attendance records found for user ID ${user_id} in ${year}-${formattedMonth}`,
                });
            }
            const summary = {
                user_id,
                month: `${formattedMonth}-${year}`,
                attendanceSummary: {
                    hadir: data[0].hadir,
                    izin: data[0].izin,
                    sakit: data[0].sakit,
                    alpa: data[0].alpa,
                },
            };
            return response.json({
                status: 'success',
                data: summary,
            });
        })
        .catch(error => {
            return response.status(500).json({
                success: false,
                message: `Error retrieving monthly attendance summary: ${error.message}`,
            });
        });
};