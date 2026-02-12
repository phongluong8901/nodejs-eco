import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Lấy dữ liệu từ localStorage (lưu ý: 'persist' chứ không phải 'presist')
    let localStorageData = window.localStorage.getItem('persist:shop/user')
    
    if (localStorageData && typeof localStorageData === 'string') {
        localStorageData = JSON.parse(localStorageData)
        
        // Redux-persist thường lưu token dưới dạng chuỗi đã stringify lần nữa
        const accessToken = JSON.parse(localStorageData?.token)
        
        if (accessToken) {
            // Cách gán headers hiện đại và an toàn cho Axios
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
            }
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Trả về thẳng data để bên ngoài không cần .data nữa
    return response.data;
}, function (error) {
    // Trả về lỗi từ server hoặc lỗi mặc định nếu không có kết nối
    return error.response?.data || error.message;
});

export default instance