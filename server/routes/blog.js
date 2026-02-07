const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary.config')

// Route công khai
router.get('/one/:bid', ctrls.getBlog)
router.get('/', ctrls.getBlogs)


// Route cần đăng nhập (User bình thường cũng like được nên không cần isAdmin)
router.put('/like', verifyAccessToken, ctrls.likeBlog) 
router.put('/dislike', verifyAccessToken, ctrls.dislikeBlog)
router.put('/uploadimage/:bid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImagesBlog)


// Route cần quyền Admin
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)


module.exports = router