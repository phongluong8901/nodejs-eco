import React, { useEffect, useState } from 'react'
import { apiGetProduct, apiUpdateCart } from '../../apis' // Import thêm apiUpdateCart
import { renderStarFromNumber, formartMoney } from '../../ultils/helpers'
import { Button, SelectQuantity } from '../../components'
import { useDispatch, useSelector } from 'react-redux' // Import hooks
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions' // Để load lại giỏ hàng
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom'
import path from '../../ultils/path'
import Swal from 'sweetalert2'

const QuickView = ({ pid }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { current } = useSelector(state => state.user) // Kiểm tra user hiện tại
    
    const [product, setProduct] = useState(null)
    const [currentImage, setCurrentImage] = useState('')
    const [quantity, setQuantity] = useState(1)

    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.productData)
            setCurrentImage(response.productData?.thumb)
        }
    }

    useEffect(() => {
        if (pid) fetchProductData()
    }, [pid])

    // --- HÀM XỬ LÝ ADD TO CART ---
    const handleAddToCart = async () => {
        // 1. Kiểm tra đăng nhập
        if (!current) {
            return Swal.fire({
                title: 'Almost there...',
                text: 'Please login to add products to your cart',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Login'
            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        }

        // 2. Gọi API thêm vào giỏ
        const response = await apiUpdateCart({ 
            pid: product?._id, 
            quantity, 
            color: product?.color // Lấy màu mặc định của product hoặc state color nếu bạn có chọn màu
        })

        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent()) // 3. Cập nhật lại giỏ hàng để Sidebar Cart nhảy số
        } else {
            toast.error(response.mes)
        }
    }

    if (!product) return (
        <div className='bg-white p-10 flex items-center justify-center min-w-[300px] rounded-md'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-main'></div>
            <span className='ml-3'>Loading...</span>
        </div>
    )

    return (
        <div onClick={e => e.stopPropagation()} className='bg-white w-[1000px] grid grid-cols-10 gap-6 p-8 relative max-h-[90vh] overflow-y-auto rounded-md shadow-2xl'>
            
            {/* ... (Phần hiển thị ảnh giữ nguyên) ... */}
            <div className='col-span-4 flex flex-col gap-4'>
                <img src={currentImage} alt="product" className='w-full h-[400px] object-contain border shadow-sm' />
                <div className='flex items-center gap-2 overflow-x-auto pb-2'>
                    {product?.images?.map((el, index) => (
                        <img 
                            key={index} 
                            src={el} 
                            alt="sub" 
                            onClick={() => setCurrentImage(el)}
                            className={`w-24 h-24 border object-contain cursor-pointer hover:border-main ${currentImage === el ? 'border-main' : ''}`} 
                        />
                    ))}
                </div>
            </div>

            <div className='col-span-6 flex flex-col gap-4'>
                <h3 className='text-2xl font-bold uppercase text-gray-800'>{product?.title}</h3>
                {/* ... (Phần sao và giá giữ nguyên) ... */}
                <div className='flex items-center gap-2'>
                    <span className='flex text-yellow-500'>
                        {renderStarFromNumber(product?.totalRatings)?.map((el, i) => <span key={i}>{el}</span>)}
                    </span>
                    <span className='text-sm italic text-gray-500'>(Sold: {product?.sold} items)</span>
                </div>

                <h2 className='text-2xl font-semibold text-main'>
                    {`${formartMoney(product?.price)} VND`}
                </h2>

                <div className='text-sm text-gray-600'>
                    {Array.isArray(product?.description) ? (
                        <ul className='list-disc pl-5'>
                            {product?.description?.map((el, index) => (
                                <li key={index} className='mb-1'>{el}</li>
                            ))}
                        </ul>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
                    )}
                </div>

                <div className='flex flex-col gap-4 mt-4 border-t pt-4'>
                    <div className='flex items-center gap-4'>
                        <span className='font-semibold'>Quantity:</span>
                        <SelectQuantity 
                            quantity={quantity}
                            handleQuantity={(num) => setQuantity(num)}
                            handleChangeQuantity={(flag) => {
                                if (flag === 'minus' && quantity > 1) setQuantity(prev => prev - 1)
                                if (flag === 'plus') setQuantity(prev => prev + 1)
                            }}
                        />
                    </div>
                    {/* Gán hàm handleAddToCart vào nút */}
                    <Button handleOnClick={handleAddToCart} fw>ADD TO CART</Button>
                </div>
            </div>
        </div>
    )
}

export default QuickView