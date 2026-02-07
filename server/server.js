const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

// SỬA TẠI ĐÂY
app.use(cors({
    origin: process.env.CLIENT_URL, // Đảm bảo trong .env là http://localhost:3000
    methods: ['POST', 'PUT', 'GET', 'DELETE'], // Sửa lỗi viết sai 'mehthos'
    credentials: true // BẮT BUỘC: Cho phép gửi/nhận Cookie qua lại
}))

const port = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({extended: true})) // Sửa extends -> extended cho đúng chuẩn
app.use(cookieParser())

dbConnect()
initRoutes(app)

app.listen(port, () => {
    console.log('Server running on the port ' + port)
})