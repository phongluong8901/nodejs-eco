const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async (req, res) => {
    const {name, discount, expiry} = req.body
    if (!name || !discount || !expiry) throw new Error('Missing inputs')

    const response = await Coupon.create({
        ...req.body,    //lay het name, discoint, expriry
        expiry: Date.now() + expiry*24*60*60*1000,  //lay dc expiry thi gan
    })
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new coupon'
    })
})

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAt -updateAt')
    return res.json({
        success: response ? true : false,
        coupons: response ? response : 'Cannot get coupons'
    })
})

const updateNewCoupon = asyncHandler(async (req, res) => {
    const {cid} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')

    if (req.body.expiry) req.body.expiry = Date.now() + req.body.expiry*24*60*60*1000
    const response = await Coupon.findByIdAndUpdate(cid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update coupon'
    })
})

const deleteNewCoupon = asyncHandler(async (req, res) => {
    const {cid} = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete coupon'
    })
})

module.exports = {
    createNewCoupon,
    getCoupons,
    updateNewCoupon,
    deleteNewCoupon
}