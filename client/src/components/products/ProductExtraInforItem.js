import React, { memo } from 'react'

const ProductExtraInforItem = ({ icon, title, sub }) => {
    return (
        // Sửa items-center và thêm border cho giống video
        <div className='flex items-center p-3 gap-3 border border-gray-300 mb-2 w-full'>
            <span className='p-2 bg-gray-800 rounded-full flex items-center justify-center text-white'>
                {icon}
            </span>
            <div className='flex flex-col text-xs'>
                <span className='font-medium text-gray-700'>{title}</span>
                <span className='text-gray-500'>{sub}</span>
            </div>
        </div>
    )
}

export default memo(ProductExtraInforItem)