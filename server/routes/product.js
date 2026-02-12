const  router = require('express').Router()
const ctrls = require('../controllers/product')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getProducts)

router.get('/:pid', ctrls.getProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deletedProduct)

router.put('/ratings', verifyAccessToken, ctrls.ratings)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)

// router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImagesProduct)
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImagesProduct)


router.post('/admin-create', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), ctrls.createProductByAdmin)

router.put('/admin-update/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), ctrls.updateProductByAdmin)

router.put('/variants/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), ctrls.addVariant)

module.exports = router