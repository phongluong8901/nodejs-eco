const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create new category blog'
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.select('title _id')
    return res.json({
        success: response ? true : false,
        blogCategories: response ? response : 'Cannot get categories'
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const response = await BlogCategory.findByIdAndUpdate(pcid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Cannot update category blog'
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const response = await BlogCategory.find().findByIdAndDelete(pcid)
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Cannot delete category blog'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}