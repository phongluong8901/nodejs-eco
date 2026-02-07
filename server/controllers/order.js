const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon } = req.body || {}
    
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

    // 1. Đảm bảo giá trị mặc định là 0 và ép kiểu số cho price
    let total = user.cart.reduce((sum, el) => {
        const price = el.product?.price || 0
        return (price * el.quantity) + sum
    }, 0)

    // 2. Kiểm tra Coupon kỹ càng
    if (coupon) {
        // Nếu coupon gửi lên là string "10", nó sẽ thành số 10. Nếu là "ABC", nó thành NaN
        const discountValue = Number(coupon) 
        
        if (!isNaN(discountValue)) {
            total = Math.round((total * (1 - discountValue / 100)) / 1000) * 1000
        } else {
            // Nếu coupon là mã chữ, ông có thể xử lý tìm trong DB, 
            // còn hiện tại nếu chỉ tính % thì ta bỏ qua hoặc báo lỗi
            console.log("Coupon is not a valid number percentage")
        }
    }

    // 3. Cuối cùng, đảm bảo total không được là NaN trước khi tạo
    if (isNaN(total)) total = 0

    const rs = await Order.create({ products, total, orderBy: _id })

    // if (rs) await User.findByIdAndUpdate(_id, { cart: [] })

    return res.json({
        success: !!rs,
        rs: rs || 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const {oid} = req.params
    const {status} = req.body
    if (!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, {status}, {new: true})
    return res.json({
        success: response ? true : false,
        response: response ? response: 'Somethings went wrongs'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    
    // Dùng find để lấy mảng danh sách đơn hàng
    // Thêm populate để xem được tên sản phẩm cho đẹp
    const response = await Order.find({ orderBy: _id })
        .populate('products.product', 'title price thumb')

    return res.json({
        success: response.length > 0 ? true : false,
        response: response.length > 0 ? response : 'Bạn chưa có đơn hàng nào'
    })
})

const getUserAdmin = asyncHandler(async (req, res) => {
    // 1. Thêm populate 'orderBy' để biết ai đặt hàng
    // 2. Thêm sort('-createdAt') để đơn mới nhất lên đầu
    const response = await Order.find()
        .populate('products.product', 'title price thumb')
        .populate('orderBy', 'firstname lastname mobile address') 
        .sort('-createdAt')

    return res.json({
        success: response.length > 0 ? true : false,
        // Sửa lại câu thông báo cho đúng ngữ cảnh Admin
        response: response.length > 0 ? response : 'Hệ thống chưa có đơn hàng nào'
    })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getUserAdmin
}