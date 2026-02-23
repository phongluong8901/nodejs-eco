const Order = require('../models/order')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    // Lấy thêm address và status từ body do Frontend gửi lên
    const { coupon, address, status } = req.body || {}
    
    const user = await User.findById(_id)
        .select('cart')
        .populate('cart.product', 'title price')

    if (!user || user.cart.length === 0) {
        res.status(400)
        throw new Error('Cart is empty!')
    }

    const products = user.cart.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color,
        price: el.product.price
    }))

    let total = user.cart.reduce((sum, el) => {
        const price = el.product?.price || 0
        return (price * el.quantity) + sum
    }, 0)

    if (coupon) {
        const discountValue = Number(coupon) 
        if (!isNaN(discountValue)) {
            total = Math.round((total * (1 - discountValue / 100)) / 1000) * 1000
        }
    }

    if (isNaN(total)) total = 0

    // 1. Tạo đơn hàng (Thêm address và status vào đây)
    const rs = await Order.create({ 
        products, 
        total, 
        orderBy: _id,
        address, // Lưu địa chỉ từ FE
        status: status || 'Processing' // Lưu trạng thái từ FE (ví dụ: 'Successed')
    })

    // 2. QUAN TRỌNG: Mở comment dòng này để xóa giỏ hàng sau khi tạo đơn thành công
    if (rs) {
        await User.findByIdAndUpdate(_id, { cart: [] })
    }

    return res.json({
        success: !!rs,
        rs: rs || 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.json({
        success: !!response,
        response: response || 'Somethings went wrongs'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })
        .populate('products.product', 'title price thumb')

    return res.json({
        success: response ? true : false,
        response: response || 'Bạn chưa có đơn hàng nào'
    })
})

const getUserAdmin = asyncHandler(async (req, res) => {
    // Thêm phân trang hoặc đếm số lượng nếu cần cho Frontend
    const response = await Order.find()
        .populate('products.product', 'title price thumb')
        .populate('orderBy', 'firstname lastname mobile address') 
        .sort('-createdAt')

    return res.json({
        success: response ? true : false,
        orders: response, // Đặt tên là orders để khớp với Frontend bạn đã viết
        counts: response.length
    })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getUserAdmin
}