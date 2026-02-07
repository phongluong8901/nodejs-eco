const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/coupon')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewCoupon)
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateNewCoupon)
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteNewCoupon)
router.get('/', ctrls.getCoupons)


module.exports = router