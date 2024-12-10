const express = require('express'); // Memperbaiki penulisan require
const cors = require('cors'); // Memperbaiki require cors
const app = express();
const PORT = 8000;

app.use(cors()); // Middleware untuk mengaktifkan CORS

// Mengimpor rute
const userRoute = require ('./route/user.route'); 
const authRoute = require ('./route/auth.route');
const attendanceRoute = require ('./route/attendance.route');

// Menambahkan middleware rute
app.use('/api/users', userRoute); // Rute untuk users
app.use('/api/auth/login', authRoute); // Rute untuk autentikasi
app.use('/api/attendance', attendanceRoute);
app.listen(PORT, () => {
    console.log(`Server runs on port ${PORT}`);
});
