import React, { useState, memo } from 'react'
import { productInfoTabs } from '../../ultils/constant'
import { Votebar, Comment, Button } from '..' // Bỏ VoteOption vì sẽ dùng thông qua hàm của file cha
import { renderStarFromNumber } from '../../ultils/helpers'

// Nhận thêm prop handleVoteNow từ DetailProduct truyền xuống
const ProductInfomation = ({ totalRatings, totalCount, ratings, handleVoteNow }) => {
    const [activeTab, setActiveTab] = useState(1)

    return (
        <div className='w-full relative'>
            {/* Header Tabs */}
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs.map(el => (
                    <span
                        key={el.id}
                        className={`p-2 px-4 cursor-pointer border pb-[10px] ${activeTab === +el.id ? 'bg-white border-b-white font-semibold' : 'bg-gray-200 text-gray-500'}`}
                        onClick={() => setActiveTab(+el.id)}
                    >
                        {el.name}
                    </span>
                ))}
                <span
                    className={`p-2 px-4 cursor-pointer border pb-[10px] ${activeTab === 5 ? 'bg-white border-b-white font-semibold' : 'bg-gray-200 text-gray-500'}`}
                    onClick={() => setActiveTab(5)}
                >
                    CUSTOMER REVIEWS
                </span>
            </div>

            {/* Content Tab Box */}
            <div className='w-full border p-8 min-h-[200px]'>
                {productInfoTabs.find(el => el.id === activeTab)?.content}

                {activeTab === 5 && (
                    <div className='flex flex-col py-4'>
                        <div className='flex w-full mb-8'>
                            <div className='flex-4 flex flex-col items-center justify-center border-r'>
                                <span className='font-semibold text-3xl'>{`${Math.round(totalRatings * 10) / 10}/5`}</span>
                                <span className='flex items-center gap-1 py-2 text-yellow-500'>
                                    {renderStarFromNumber(totalRatings)?.map((el, index) => (
                                        <span key={index}>{el}</span>
                                    ))}
                                </span>
                                <span className='text-sm text-gray-500'>{`${totalCount || 0} reviewers`}</span>
                            </div>

                            <div className='flex-6 flex flex-col p-4 gap-2'>
                                {Array.from(Array(5).keys()).reverse().map(el => (
                                    <Votebar
                                        key={el}
                                        number={el + 1}
                                        ratingCount={ratings?.filter(i => i.star === el + 1)?.length || 0}
                                        ratingTotal={totalCount || 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Nút bấm này giờ sẽ gọi hàm handleVoteNow của DetailProduct */}
                        <div className='flex flex-col items-center justify-center p-4 text-sm gap-2 border-t border-b'>
                            <span className='italic text-gray-600 font-medium'>Do you want to review this product?</span>
                            <Button handleOnClick={handleVoteNow}>
                                Vote now!
                            </Button>
                        </div>

                        {/* DANH SÁCH CÁC COMMENT */}
                        <div className='flex flex-col gap-4 mt-4'>
                            {ratings?.map(el => (
                                <Comment 
                                    key={el._id} // Thường là _id từ MongoDB
                                    star={el.star}
                                    updatedAt={el.updatedAt}
                                    comment={el.comment}
                                    name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(ProductInfomation)