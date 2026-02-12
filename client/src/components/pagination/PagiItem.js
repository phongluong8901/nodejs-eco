import React from 'react'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'

const PagiItem = ({ children }) => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    const handlePagination = () => {
        // 1. Kiểm tra nếu children không phải là số (ví dụ dấu "...") thì bỏ qua
        if (!Number(children)) return 
        
        // 2. Lấy tất cả các params hiện tại trên URL (như q, sort, filter...)
        const queries = Object.fromEntries([...params])
        
        // 3. Cập nhật hoặc thêm mới param page
        queries.page = children
        
        // 4. Điều hướng sang URL mới
        navigate({
            pathname: location.pathname, 
            search: createSearchParams(queries).toString()
        })

        // 5. THÊM MỚI: Cuộn lên đầu trang/đầu bảng khi chuyển trang
        // Điều này giúp người dùng không phải kéo chuột lên lại khi bảng load dữ liệu mới
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    // Xác định trang hiện tại để active class
    const currentPage = +params.get('page') || 1

    return (
        <button
            type='button'
            className={`w-10 h-10 flex items-center justify-center border text-sm rounded-md transition-all
            ${+children === currentPage ? 'bg-blue-600 text-white font-bold' : 'bg-white hover:bg-gray-100'}
            ${!Number(children) ? 'cursor-default border-none' : 'cursor-pointer'}`}
            onClick={handlePagination}
            disabled={!Number(children) || +children === currentPage} // Disable nếu là trang hiện tại
        >
            {children}
        </button>
    )
}

export default PagiItem