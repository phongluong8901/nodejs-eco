import React from 'react'
import avatar from '../assets/Avatar.jpg'
import moment from 'moment'
// Thêm dòng import này để fix lỗi renderStarFromNumber is not defined
import { renderStarFromNumber } from '../ultils/helpers'

const Comment = ({ image = avatar, name = 'Anonymous', updateAt, comment, star }) => {
    return (
        <div className='flex gap-4 border-b py-4'>
            <div className='flex-none'>
                <img 
                    src={image}
                    alt="avatar"
                    className='w-[40px] h-[40px] object-cover rounded-full'
                />
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold'>{name}</h3>
                    {/* Format lại thời gian cho đẹp, ví dụ: "2 minutes ago" */}
                    <span className='text-xs italic text-gray-500'>{moment(updateAt).fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 mt-2 py-2 px-4 bg-gray-100 rounded-md'>
                    <div className='flex items-center gap-2'>
                        <span className='font-semibold'>Vote:</span>
                        <span className='flex items-center text-yellow-500'>
                            {/* FIX: Đổi totalRatings thành star */}
                            {renderStarFromNumber(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </div>
                    <div className='flex gap-2'>
                        <span className='font-semibold'>Comment:</span>
                        <span className='text-gray-800 italic'>
                            {/* FIX: Hiển thị đúng biến comment truyền vào */}
                            {comment}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment