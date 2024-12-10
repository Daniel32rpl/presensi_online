const express = require('express')
const app = express.Router();
const attendanceController = require('../controllers/attendance.controller')
const { authorize } = require('../controllers/auth.controller')
const { validateAttendance } = require(`../middlewares/attendance-validation`);
app.use(express.json());

app.post('/', [authorize], [validateAttendance], attendanceController.addAttendance)

app.get('/history/:user_id', [authorize], attendanceController.getAttendanceByuser_id)

app.get('/summary/:user_id', [authorize], attendanceController.getMonthlyattendanceSummary)

module.exports = app
