const userRouter = require('./user')
const {notFound, errHandler} = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)


    // Neu k tim thay api nao o tren: app.use -> notfound
    app.use(notFound)
    // hung cac loi o tren
    app.use(errHandler)
}

module.exports = initRoutes