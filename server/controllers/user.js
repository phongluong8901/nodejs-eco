const User = require('../models/user')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')

const asyncHandler = require('express-async-handler')
const { response } = require('express')

// const register = async (req, res, next) => {
//     try {
//         const { email, password, firstname, lastname } = req.body
        
//         // Thay vì return res.status(400), ta throw lỗi luôn
//         if (!email || !password || !lastname || !firstname) {
//             res.status(400) // Set code để errHandler biết là lỗi 400
//             throw new Error('Missing inputs')
//         }

//         const user = await User.findOne({ email })
//         if (user) {
//             res.status(400)
//             throw new Error('User has existed')
//         }

//         const newUser = await User.create(req.body)

//         // Nếu tạo thành công thì trả về res, nếu fail thì throw lỗi
//         if (!newUser) throw new Error('Something went wrong')

//         return res.status(200).json({
//             success: true,
//             mes: 'Register is successfully, Please go login'
//         })

//     } catch (error) {
//         // Lệnh này sẽ đẩy lỗi vào file errHandler.js của ông
//         next(error) 
//     }
// }
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !lastname || !firstname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })

    // 1. Kiểm tra xem user đã tồn tại chưa (Dùng findOne, KHÔNG dùng create)
    const user = await User.findOne({ $or: [{ email }, { mobile }] })
    if (user) return res.status(400).json({ success: false, mes: 'User has existed' })

    // 2. Tạo token ngẫu nhiên
    const token = makeToken() 

    // 3. Lưu thông tin tạm vào cookie để đối chiếu khi user click link
    res.cookie('dataregister', { ...req.body, token }, { 
    httpOnly: true, 
    maxAge: 15 * 60 * 1000,
    sameSite: 'Lax', // QUAN TRỌNG: Cho phép gửi cookie khi click link từ email
    secure: false    // Vì bạn đang dùng http://localhost nên phải để false
});

    // 4. Gửi mail (Nhớ có dấu / trước token)
    const html = `Xin vui lòng click vào link để hoàn tất đăng ký: 
        <a href="${process.env.URL_SERVER}/api/user/finalregister/${token}">Click here</a>`

    await sendMail({ email, html, subject: 'Register Finish Digital' })

    return res.status(200).json({ 
        success: true, 
        mes: 'Please check your email to active your account!' 
    })
})

const finalRegister = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    const { token } = req.params


    // 1. Kiểm tra cookie và token có khớp không
    if (!cookie || cookie?.dataregister?.token !== token) {
        // Sau khi kiểm tra xong nên xóa cookie lỗi
        res.clearCookie('dataregister')
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    }

    // 2. Tạo user thật trong DB
    const newUser = await User.create({
        email: cookie.dataregister?.email,
        password: cookie.dataregister?.password,
        mobile: cookie.dataregister?.mobile,
        firstname: cookie.dataregister?.firstname,
        lastname: cookie.dataregister?.lastname,
    })

    // 3. Xóa cookie sau khi đăng ký thành công
    res.clearCookie('dataregister')
    if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)

})

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ success: false, mes: 'Missing inputs' })

        const user = await User.findOne({ email })
        if (user && await user.isCorrectPassword(password)) {
            const { password, role, refreshToken, ...userData } = user.toObject()
            const accessToken = generateAccessToken(user._id, role)
            const newrefreshToken = generateRefreshToken(user._id)

            await User.findByIdAndUpdate(user._id, { newrefreshToken }, { new: true })
            res.cookie('refreshToken', newrefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

            return res.status(200).json({ success: true, accessToken, userData })
        } else {
            throw new Error('Invalid credentials!')
        }
    } catch (error) { next(error) }
}

const getCurrent = async (req, res, next) => {
    try {
        const { _id } = req.user
        const user = await User.findById(_id).select('-refreshToken -password -role')
        return res.status(200).json({
            success: !!user,
            rs: user || 'User not found'
        })
    } catch (error) { next(error) }
}

const refreshAccessToken = async (req, res, next) => {
    try {
        const cookies = req.cookies
        if (!cookies || !cookies.refreshToken) throw new Error('No refresh token in cookies')
        
        const decoded = jwt.verify(cookies.refreshToken, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, refreshToken: cookies.refreshToken })
        
        if (!user) throw new Error('Refresh token invalid or not matched')
        
        const newAccessToken = generateAccessToken(user._id, user.role)
        return res.status(200).json({ success: true, newAccessToken })
    } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
    try {
        const cookie = req.cookies
        if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
        
        await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: "" })
        res.clearCookie('refreshToken', { httpOnly: true, secure: true })
        
        return res.status(200).json({ success: true, mes: 'Logout is done!' })
    } catch (error) { next(error) }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) throw new Error('Missing email')
        const user = await User.findOne({ email })
        if (!user) throw new Error('User is not found')

        const resetToken = user.createPasswordChangedToken()
        await User.findByIdAndUpdate(user._id, {
            passwordResetToken: user.passwordResetToken,
            passwordResetExpires: user.passwordResetExpires
        })

        const html = `Xin vui lòng click vào link: 
        <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`
        const rs = await sendMail({ email, html, subject: 'Forgot Password' })
        return res.status(200).json({ success: rs.response?.includes('OK') ? true: false, mes: rs.response?.includes('OK') ? 'Ckeck your email' : 'Something went wrong. Please try again!' })
    } catch (error) { next(error) }
}

const resetPassword = async (req, res, next) => {
    try {
        const { password, token } = req.body
        const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            passwordResetToken,
            passwordResetExpires: { $gt: Date.now() }
        })

        if (!user) throw new Error('Invalid or expired reset token')

        // Thay vì save(), ta update trực tiếp
        const salt = require('bcrypt').genSaltSync(10)
        const hashedPassword = require('bcrypt').hashSync(password, salt)

        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            passwordResetToken: undefined,
            passwordResetExpires: undefined,
            passwordChangeAt: Date.now()
        })

        return res.status(200).json({ success: true, mes: 'Updated password successfully' })
    } catch (error) {
        next(error)
    }
}

const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true: false,
        users: response
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const {_id} = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true: false,
        deleteedUser: response ? `user with email ${response.email} deleted` : 'No user deleted'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const {_id} = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true: false,
        updateUser: response ? response : 'Some thing went wrong'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const {uid} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true: false,
        updateUser: response ? response : 'Some thing went wrong'
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const {_id} = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, {$push: {address: req.body.address}}, {new: true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true: false,
        updateUserAddress: response ? response : 'Some thing went wrong'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {pid, quantity, color} = req.body
    if (!pid || !quantity || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User.updateOne({cart: {$elemMatch: alreadyProduct}}, {$set: {"cart.$.quantity": quantity}}, {new: true})
            return res.status(200).json({
                success: response ? true: false,
                updateCart: response ? response : 'Some thing went wrong'
            })
        } else {
            const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity, color}}}, {new: true})
            return res.status(200).json({
                success: response ? true: false,
                updateCart: response ? response : 'Some thing went wrong'
            })
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity, color}}}, {new: true})
        return res.status(200).json({
            success: response ? true: false,
            updateCart: response ? response : 'Some thing went wrong'
        })
    }
    
})

module.exports = {
    register, login, getCurrent, 
    refreshAccessToken, logout, 
    forgotPassword, resetPassword,
    getUsers, deleteUser, updateUser, updateUserByAdmin,
    updateUserAddress, updateCart, finalRegister
}