//neu k tim thay api
const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not Found!`)
    res.status(404) //status not found
    next(error) // mang error di toi ham tiep
}

const errHandler = (error, req, res, next) => {
    // neu 404 vao -> k phai 200 -> 404
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        sucess:false,
        mes: error?.message
    })
}

module.exports = {
    notFound,
    errHandler
}
