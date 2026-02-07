const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const data = require('../../data/data2.json')
const slugify = require('slugify') // THÊM DÒNG NÀY
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory')

const fn = async (product) => {
    // 1. Làm sạch Category (Bỏ số trong ngoặc)
    let categoryName = Array.isArray(product?.category) ? product?.category[1] : product?.category;
    const cleanCategory = categoryName?.replace(/\s\(\d+\)$/, '').trim() || 'Default';

    // 2. Xử lý giá (Regex lấy số)
    const rawPrice = product?.price?.toString().match(/\d/g)?.join('') || "0";
    
    // 3. Xử lý Brand (Nếu không có lấy tên của bạn hoặc 'Others')
    const brandName = product?.brand || 'Tên Của Bạn'; // Thay 'Tên Của Bạn' vào đây

    await Product.create({
        title: product?.name,
        slug: slugify(product?.name || '', { lower: true }) + '-' + Math.round(Math.random() * 1000),
        description: product?.description,
        brand: brandName,
        price: Math.round(Number(rawPrice) / 100),
        category: cleanCategory, // Đã được cắt bỏ (9)
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(el => el.label === 'Color')?.variants[0] || 'Black',
        thumb: product?.thumb,
        totalRatings: Math.round(Math.random()*5)
    });
}

const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    // Kiểm tra xem data có tồn tại không
    if (!data || data.length === 0) return res.status(400).json('Data file is empty');

    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Insert Data Done!')
})

const fn2 = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image
    })
}


const insertCategory = asyncHandler(async (req, res) => {
    const promises = []
    for (let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Insert Data Done!')
})

module.exports = {
    insertProduct,
    insertCategory
}