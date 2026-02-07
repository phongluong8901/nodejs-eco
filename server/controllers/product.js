const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const { post } = require('../routes/product')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

const getProducts = asyncHandler(async (req, res) => {
  const query = {}

  // ===== FILTER =====

  // title
  if (req.query.title) {
    query.title = {
      $regex: req.query.title,
      $options: 'i'
    }
  }

  // price
  if (
    req.query['price[gt]'] ||
    req.query['price[gte]'] ||
    req.query['price[lt]'] ||
    req.query['price[lte]']
  ) {
    query.price = {}

    if (req.query['price[gt]']) query.price.$gt = Number(req.query['price[gt]'])
    if (req.query['price[gte]']) query.price.$gte = Number(req.query['price[gte]'])
    if (req.query['price[lt]']) query.price.$lt = Number(req.query['price[lt]'])
    if (req.query['price[lte]']) query.price.$lte = Number(req.query['price[lte]'])
  }

  // ===== QUERY INIT =====
  let mongoQuery = Product.find(query)

  // ===== SORT =====
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    mongoQuery = mongoQuery.sort(sortBy)
  } else {
    mongoQuery = mongoQuery.sort('-createdAt')
  }

  // ===== FIELD LIMIT =====
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    mongoQuery = mongoQuery.select(fields)
  } else {
    mongoQuery = mongoQuery.select('-__v')
  }

  // ===== PAGINATION =====
  const page = Number(req.query.page) || 1
//   const limit = Number(req.query.limit) || 10
  const limit = Number(process.env.LIMIT_PRODUCTS) || 10
  const skip = (page - 1) * limit

  mongoQuery = mongoQuery.skip(skip).limit(limit)

  // ===== EXECUTE =====
  const products = await mongoQuery
  const counts = await Product.countDocuments(query)

  res.status(200).json({
    success: true,
    counts,
    page,
    limit,
    products
  })
})




const updateProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    return res.status(200).json({
        success: updateProduct ? true : false,
        updatedProduct: updateProduct ? updateProduct : 'Cannot updated product'
    })
})

const deletedProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot deleted product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !pid) throw new Error('Missing inputs')

    const ratingProduct = await Product.findById(pid)
    
    // 1. Kiểm tra xem user này đã đánh giá sản phẩm này chưa
    // Lưu ý: el.postedBy thường là ObjectId nên cần toString() để so sánh với _id
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id.toString())
    console.log(alreadyRating)
    if (alreadyRating) {
        // 2. Nếu ĐÃ ĐÁNH GIÁ -> Cập nhật lại star và comment (Dùng toán tử $)
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating } // Tìm phần tử trùng khớp trong mảng
        }, {
            $set: { 
                "ratings.$.star": star, 
                "ratings.$.comment": comment 
            }
        }, { new: true })

    } else {
        // 3. Nếu CHƯA ĐÁNH GIÁ -> Thêm mới vào mảng ratings
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true })
    }

    // 4. (Nâng cao) Tính tổng điểm trung bình (totalRatings)
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10 // Làm tròn 1 chữ số thập phân

    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
    // console.log(req.file)
    // console.log(req.files)
    const {pid} = req.params
    if (!req.files) throw new Error('Missing inputs')
    // day 3 link path map cho vao mang cua images
    const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})

    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })
})



module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deletedProduct,
    ratings,
    uploadImagesProduct,
}