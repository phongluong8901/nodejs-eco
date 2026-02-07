import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // Dùng useNavigate thay vì Navigate
import path from '../../ultils/path'
import Swal from 'sweetalert2'

const FinalRegister = () => {
    const { status } = useParams()
    const navigate = useNavigate() // Khởi tạo hàm điều hướng

    useEffect(() => {
        if (status === 'failed') {
            Swal.fire('Oops!', 'Đăng ký không thành công hoặc liên kết đã hết hạn', 'error')
                .then(() => {
                    navigate(`/${path.LOGIN}`) // Gọi hàm điều hướng ở đây
                })
        }
        
        if (status === 'success') {
            Swal.fire('Congratulations!', 'Đăng ký thành công. Hãy đăng nhập nhé', 'success')
                .then(() => {
                    navigate(`/${path.LOGIN}`)
                })
        }
    }, [status, navigate]) // Thêm dependencies

    return (
        <div className='h-screen w-screen bg-gray-100'>
            {/* Có thể thêm một loading spinner ở đây nếu muốn */}
        </div>
    )
}

export default FinalRegister