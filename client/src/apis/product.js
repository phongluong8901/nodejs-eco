import axios from '../axios'

export const apiGetProducts = (params) => axios({
    url: '/product',
    method: 'get',
    params
})

export const apiGetProduct= (pid) => axios({
    url: '/product/' + pid,
    method: 'get',
})

export const apiRatings = (data) => axios({
    url: '/product/ratings',
    method: 'put',
    data
})

export const apiCreateProduct = (data) => axios({
    url: '/product/admin-create', // Đổi từ '/product/' thành '/product/admin-create'
    method: 'post',
    data, // Đây là FormData chứa thumb, images và các trường text
})

export const apiUpdateProduct = (data, pid) => axios({
    url: '/product/admin-update/' + pid, 
    method: 'put',
    data
})

export const apiDeleteProduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'delete',
})

export const apiAddVariant = (data, pid) => axios({
    url: '/product/variants/' + pid,
    method: 'put',
    data
})

