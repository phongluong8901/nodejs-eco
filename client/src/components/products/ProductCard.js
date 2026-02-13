import React from 'react'
import { renderStarFromNumber, formartMoney } from '../../ultils/helpers'
import { useDispatch } from 'react-redux'
import { showModal } from '../../store/app/appSlice'
import { QuickView, SelectOption } from '../../components' 
import icons from '../../ultils/icons'

const { AiFillEye } = icons 

// Thêm _id vào props nhận vào để tránh lỗi undefined từ dữ liệu MongoDB
const ProductCard = ({ price, totalRatings, title, image, pid, _id, category }) => {
    const dispatch = useDispatch()

    // Hàm xử lý mở QuickView
    const handleQuickView = (e) => {
        e.stopPropagation() 
        e.preventDefault() 
        
        // productId sẽ ưu tiên lấy pid, nếu không có thì lấy _id
        const productId = pid || _id

        if (!productId) {
            console.error("Lỗi: Không tìm thấy ID sản phẩm để mở QuickView")
            return
        }
        
        dispatch(showModal({
            isShowModal: true,
            modalChildren: <QuickView 
                pid={productId} 
                category={category} 
            />
        }))
    }

    return (
        <div className='w-1/3 flex-auto px-[10px] mb-[20px]'>
            <div className='flex w-full border group relative cursor-pointer bg-white overflow-hidden hover:shadow-md transition-all duration-300'>
                
                {/* LỚP PHỦ OVERLAY */}
                <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10'>
                    <span onClick={handleQuickView}>
                        <SelectOption icon={<AiFillEye size={20} />} />
                    </span>
                </div>

                {/* PHẦN ẢNH */}
                <div className='w-[120px] h-[120px] flex-none'>
                    <img 
                        src={image || "https://via.placeholder.com/120"} 
                        alt={title} 
                        className='w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105' 
                    />
                </div>

                {/* PHẦN THÔNG TIN */}
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full text-xs pr-2'>
                    <span className="line-clamp-1 capitalize text-sm font-semibold">
                        {title?.toLowerCase()}
                    </span>
                    
                    <span className='flex h-4 text-yellow-500'>
                        {renderStarFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                    </span>

                    <span className='text-main font-medium'>
                        {price ? `${formartMoney(price)} VND` : '0 VND'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard