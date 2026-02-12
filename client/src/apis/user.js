import axios from '../axios'

export const apiRegister = (data) => axios({
    url: '/user/register/',
    method: 'post',
    data,
    withCredentials: true
})

export const apiLogin = (data) =>axios({
    url: '/user/login',
    method: 'post',
    data
})

export const apiForgotPassword = (data) =>axios({
    url: '/user/forgotpassword',
    method: 'post',
    data
})

export const apiResetPassword = (data) =>axios({
    url: '/user/resetpassword',
    method: 'put',
    data
})

export const apiGetCurrent = (data) =>axios({
    url: '/user/current',
    method: 'get',
})


export const apiGetUsers = (params) =>axios({
    url: '/user/',
    method: 'get',
    params
})

// Hàm cập nhật thông tin user (dành cho Admin)
export const apiUpdateUserByAdmin = (data, uid) => axios({
    url: '/user/' + uid,
    method: 'put',
    data
})

// Hàm xóa user (dành cho Admin)
export const apiDeleteUserByAdmin = (uid) => axios({
    url: '/user/' + uid,
    method: 'delete'
})

// Hàm cập nhật thông tin user (dành cho User)
export const apiUpdateCurrent = (data) => axios({
    url: '/user/current',
    method: 'put',
    data
})

