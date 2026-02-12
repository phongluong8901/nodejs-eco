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

const createProductByAdmin = asyncHandler(async (req, res) => {
    // 1. Kiểm tra dữ liệu đầu vào cơ bản
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')

    // 2. Tách các trường dữ liệu từ body
    const { title, price, description, brand, category, color, quantity } = req.body
    
    // 3. Xử lý file ảnh từ uploader.fields (nếu có)
    const thumb = req.files?.thumb?.[0]?.path
    const images = req.files?.images?.map(el => el.path)

    // 4. Validate bắt buộc cho Admin
    if (!(title && price && description && category)) {
        throw new Error('Title, Price, Description, and Category are mandatory.')
    }

    // 5. Xây dựng Object data sạch
    const data = {
        ...req.body, // Lấy toàn bộ body (bao gồm color, quantity...)
        slug: slugify(title)
    }

    // Gán ảnh nếu có upload
    if (thumb) data.thumb = thumb
    if (images) data.images = images

    // Gán ID Admin tạo sản phẩm (Lấy từ VerifyAccessToken)
    data.createdBy = req.user._id

    // 6. Tạo sản phẩm
    const newProduct = await Product.create(data)

    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Admin created product successfully' : 'Cannot create product',
        product: newProduct
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    // Thêm .populate để lấy firstname, lastname của người đánh giá
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar' // Chỉ lấy các trường cần thiết
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

const getProducts = asyncHandler(async (req, res) => {
    // 1. Tạo bản sao của query
    const queries = { ...req.query }

    // 2. Tách các trường đặc biệt
    const excludeFields = ['sort', 'page', 'fields', 'limit']
    excludeFields.forEach(el => delete queries[el])

    // 3. Format các toán tử gte, lte, gt, lt thành $gte, $lte...
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, m => `$${m}`)
    let formattedQueries = JSON.parse(queryString)

    // 4. XỬ LÝ LỖI KEY BỊ SAI (Cấu trúc lồng nhau cho price)
    for (let key in formattedQueries) {
        if (key.includes('$')) {
            const [mainKey, operator] = key.replace(']', '').split('[')
            if (operator) {
                if (!formattedQueries[mainKey]) formattedQueries[mainKey] = {}
                formattedQueries[mainKey][operator] = formattedQueries[key]
                delete formattedQueries[key]
            }
        }
    }

    // 5. ÉP KIỂU NUMBER CHO PRICE
    if (formattedQueries.price) {
        for (let key in formattedQueries.price) {
            formattedQueries.price[key] = Number(formattedQueries.price[key])
        }
    }

    // 6. Filtering cho các trường String & Xử lý biến 'q' từ Frontend
    // Lọc theo từng trường riêng lẻ nếu có
    if (queries?.title) formattedQueries.title = { $regex: queries.title, $options: 'i' }
    if (queries?.category) formattedQueries.category = { $regex: queries.category, $options: 'i' }
    if (queries?.brand) formattedQueries.brand = { $regex: queries.brand, $options: 'i' }
    
    // --- PHẦN CẬP NHẬT: Xử lý tìm kiếm tổng hợp 'q' ---
    if (queries?.q) {
        delete formattedQueries.q // Xóa q cũ để không bị đưa vào filter mặc định
        formattedQueries.$or = [
            { title: { $regex: queries.q, $options: 'i' } },
            { category: { $regex: queries.q, $options: 'i' } },
            { brand: { $regex: queries.q, $options: 'i' } }
        ]
    }
    // -----------------------------------------------

    if (queries?.color) {
        const colors = queries.color.split(',')
        formattedQueries.color = { $in: colors.map(el => new RegExp(el, 'i')) }
    }

    // LOG KIỂM TRA
    console.log('--- FINAL MONGODB QUERY ---', JSON.stringify(formattedQueries, null, 2))

    // 7. KHỞI TẠO TRUY VẤN
    let mongoQuery = Product.find(formattedQueries)

    // 8. SẮP XẾP (SORT)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        mongoQuery = mongoQuery.sort(sortBy)
    } else {
        mongoQuery = mongoQuery.sort('-createdAt')
    }

    // 9. GIỚI HẠN TRƯỜNG (FIELDS)
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        mongoQuery = mongoQuery.select(fields)
    } else {
        mongoQuery = mongoQuery.select('-__v')
    }

    // 10. PHÂN TRANG (PAGINATION)
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
    const skip = (page - 1) * limit
    mongoQuery = mongoQuery.skip(skip).limit(limit)

    // 11. THỰC THI
    try {
        const products = await mongoQuery
        const counts = await Product.countDocuments(formattedQueries)

        return res.status(200).json({
            success: true,
            counts,
            products,
            page,
            limit
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    
    // 1. Kiểm tra đầu vào
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');

    // 2. Tự động cập nhật slug nếu người dùng đổi tên (title)
    if (req.body.title) req.body.slug = slugify(req.body.title);

    // 3. Thực hiện cập nhật
    // Dùng biến tên khác (ví dụ: response) để tránh trùng tên với hàm
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });

    return res.status(200).json({
        success: updatedProduct ? true : false,
        // Trả về 'mes' để Frontend dễ dùng toast
        mes: updatedProduct ? 'Product updated successfully.' : 'Cannot update product.',
        // Trả về dữ liệu đã update để FE cập nhật UI nếu cần
        updatedProduct: updatedProduct
    });
});

const updateProductByAdmin = asyncHandler(async (req, res) => {
    const { pid } = req.params;

    console.log('--- 1. CHECK PID ---', pid);
    console.log('--- 2. CHECK REQ.BODY ---', req.body);
    console.log('--- 3. CHECK REQ.FILES ---', req.files);

    // Kiểm tra đầu vào
    if (Object.keys(req.body).length === 0 && !req.files) throw new Error('Missing inputs');

    const data = { ...req.body };

    // Dọn dẹp dữ liệu rác từ FE (nếu FE gửi thumb/images dạng string URL cũ)
    // Chúng ta chỉ muốn nhận FILE từ req.files, không muốn nhận STRING từ req.body
    if (data.thumb) delete data.thumb;
    if (data.images) delete data.images;

    // 2. Ép kiểu dữ liệu số để tránh lỗi Validation của Mongoose
    if (data.price) data.price = Number(data.price);
    if (data.quantity) data.quantity = Number(data.quantity);

    // 3. Cập nhật Slug nếu Admin đổi tên
    if (data.title) data.slug = slugify(data.title);

    // 4. Xử lý Ảnh Thumbnail (Chỉ lấy link từ Cloudinary nếu có file mới)
    if (req.files && req.files.thumb) {
        data.thumb = req.files.thumb[0].path;
        console.log('--- 4. NEW THUMB LINK ---', data.thumb);
    }

    // 5. Xử lý mảng Ảnh chi tiết (Chỉ lấy link từ Cloudinary nếu có file mới)
    if (req.files && req.files.images) {
        data.images = req.files.images.map(el => el.path);
        console.log('--- 5. NEW IMAGES ARRAY ---', data.images);
    }

    console.log('--- 6. DATA BEFORE SAVE TO MONGO ---', data);

    // 6. Cập nhật Database
    const updatedProduct = await Product.findByIdAndUpdate(pid, data, { new: true, runValidators: true });

    console.log('--- 7. MONGO RESPONSE ---', updatedProduct ? 'Success' : 'Fail');

    return res.status(200).json({
        success: updatedProduct ? true : false,
        mes: updatedProduct ? 'Update product successfully' : 'Cannot update product',
        updatedProduct: updatedProduct
    });
});

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
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id.toString())

    if (alreadyRating) {
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        })
    } else {
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true })
    }

    // Tính tổng điểm trung bình
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10

    await updatedProduct.save()

    // Trả về response (Đổi status -> success cho giống các hàm khác)
    return res.status(200).json({
        success: true, // Đồng bộ với FE
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

const addVariant = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { title, price, color } = req.body;
    
    const thumb = req.files?.thumb?.[0]?.path;
    const images = req.files?.images?.map(el => el.path);

    if (!(title && price && color)) throw new Error('Missing inputs');

    // Đổi 'varriants' thành 'variants' cho đúng với Model
    const response = await Product.findByIdAndUpdate(pid, {
        $push: {
            variants: { // <--- SỬA Ở ĐÂY (Bỏ 1 chữ r)
                title,
                price,
                color,
                thumb,
                images,
                sku: Math.random().toString(36).substring(7).toUpperCase()
            }
        }
    }, { new: true });

    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Added variant successfully' : 'Cannot add variant',
        updatedProduct: response
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deletedProduct,
    ratings,
    uploadImagesProduct,
    createProductByAdmin,
    updateProductByAdmin,
    addVariant
}