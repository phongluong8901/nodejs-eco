import React, { useRef, useEffect, memo } from 'react'
import { AiFillStar } from 'react-icons/ai'

const Votebar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef()

    useEffect(() => {
        // Tính phần trăm số lượng vote của sao này so với tổng số đánh giá
        // Thêm điều kiện ratingTotal > 0 để tránh lỗi NaN (chia cho 0)
        const percent = ratingTotal > 0 ? Math.round((ratingCount * 100) / ratingTotal) : 0
        
        // Cập nhật style cho thanh đỏ (progress bar)
        // Vì class inset-0 của Tailwind set left:0, right:0, top:0, bottom:0
        // Ta chỉ cần chỉnh right để thanh màu đỏ co lại hoặc giãn ra từ bên trái
        if (percentRef.current) {
            percentRef.current.style.cssText = `right: ${100 - percent}%`
        }
    }, [ratingCount, ratingTotal])

    return (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            {/* Cột hiển thị số sao: 1, 2, 3, 4, 5 */}
            <div className='flex w-[10%] items-center gap-1 text-sm font-semibold'>
                <span>{number}</span>
                <AiFillStar color='orange' size={18} />
            </div>

            {/* Cột hiển thị thanh Progress Bar */}
            <div className='w-[75%]'>
                <div className='w-full h-[6px] relative bg-gray-200 rounded-full overflow-hidden'>
                    {/* Thanh màu đỏ biểu thị phần trăm */}
                    <div 
                        ref={percentRef} 
                        className='absolute inset-0 bg-red-500 transition-all duration-500'
                    ></div>
                </div>
            </div>

            {/* Cột hiển thị số lượng reviewer của mức sao đó */}
            <div className='w-[15%] flex justify-end text-xs text-gray-400'>
                {`${ratingCount || 0} reviewers`}
            </div>
        </div>
    )
}

// Dùng memo để tối ưu performance, chỉ render lại khi props thay đổi
export default memo(Votebar)