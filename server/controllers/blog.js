const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const {title, description, category} = req.body
    if (!title || !description || !category) throw new Error('Missing inputs')

    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if (Object.keys(req.body).length === 0 ) throw new Error('Missing inputs')

    const response = await Blog.findByIdAndUpdate(bid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update blog'
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()
    return res.json({
        success: response ? true : false,
        getBlogs: response ? response : 'Cannot get blogs'
    })
})

// check xem có dislike -> bỏ dislike
// k có dislike -> có like chưa -> bỏ like / them like

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.body;
    if (!bid) throw new Error('Missing inputs');

    const blog = await Blog.findById(bid);

    // 1. Kiểm tra xem user này trước đó có bấm DISLIKE không
    // Lưu ý: Tên trường trong DB thường là dislikes (số nhiều), check kỹ Schema của ông nhé
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id);

    if (alreadyDisliked) {
        // Nếu đã dislike thì gỡ dislike ra trước khi like
        await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
    }

    // 2. Kiểm tra xem user này trước đó đã LIKE chưa (nhấn like lần nữa để bỏ like)
    const isLiked = blog?.likes?.find(el => el.toString() === _id);

    if (isLiked) {
        // Nếu đã like rồi thì bây giờ bấm lại là BỎ LIKE
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response
        });
    } else {
        // 3. Nếu chưa like thì thêm LIKE vào
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response
        });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.body
    if (!bid) throw new Error('Missing inputs')

    const blog = await Blog.findById(bid)

    // 1. Check xem user này trước đó có LIKE không -> Nếu có thì gỡ LIKE
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
    if (alreadyLiked) {
        await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
    }

    // 2. Check xem user này trước đó đã DISLIKE chưa
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)

    if (isDisliked) {
        // Nếu đã dislike rồi -> Bấm lần nữa là BỎ DISLIKE
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        // 3. Nếu chưa dislike -> Thêm DISLIKE vào
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const excludeFields = '-refreshToken -password -role -createdAt -updatedAt'

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    
    // Nên populate cả likes và dislikes để dữ liệu đồng bộ
    const blog = await Blog.findByIdAndUpdate(bid, {$inc: {numberViews: 1}}, {new: true})
        .populate('likes', excludeFields)
        .populate('dislikes', excludeFields)

    return res.json({
        success: blog ? true : false,
        rs: blog
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params

    const blog = await Blog.findByIdAndUpdate(bid)
    return res.json({
        success: blog ? true : false,
        deletedBlog: blog || 'Something went wrong'
    })
})

const uploadImagesBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if (!req.file) throw new Error('Missing inputs')
    // day 3 link path map cho vao mang cua images
    const response = await Blog.findByIdAndUpdate(bid, {images: req.file.path}, {new: true})

    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'Cannot upload images blog'
    })
})



module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadImagesBlog
}