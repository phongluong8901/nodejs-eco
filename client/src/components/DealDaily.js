import React, { useState, useEffect, memo, useRef } from 'react'
import icons from '../ultils/icons'
import { apiGetProducts } from '../apis/product'
import { renderStarFromNumber, formatMoney } from '../ultils/helpers'
import { AiOutlineMenu } from 'react-icons/ai' // Import trực tiếp cho chắc chắn
import { Countdown } from './' 
import { useNavigate } from 'react-router-dom'

const { AiFillStar } = icons // Chỉ lấy icon chắc chắn đã có

const DealDaily = () => {
    const [dealDaily, setDealdaily] = useState(null)
    const [seconds, setSeconds] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const timerRef = useRef()
    const navigate = useNavigate()

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 1, page: Math.floor(Math.random() * 10), totalRatings: 5 })
        if (response?.success && response.products.length > 0) {
            setDealdaily(response.products[0])
            const now = new Date()
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)
            const remaining = Math.floor((endOfDay - now) / 1000)
            setSeconds(remaining > 0 ? remaining : 0)
        }
    }

    useEffect(() => {
        fetchDealDaily()
    }, [expireTime])

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev > 0) return prev - 1
                else {
                    setExpireTime(curr => !curr)
                    return 0
                }
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [dealDaily])

    const handleClickProduct = () => {
        if (dealDaily) {
            navigate(`/${dealDaily?.category?.toLowerCase()}/${dealDaily?._id}/${dealDaily?.title}`)
        }
    }

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return (
        <div className='w-full border flex-auto p-5 bg-white shadow-sm'>
            <div className='flex items-center justify-between w-full mb-4'>
                <span className='flex-1 flex justify-start'>
                    <AiFillStar size={20} color='#DD1111' />
                </span>
                <span className='flex-8 font-extrabold text-[20px] text-center text-gray-700 uppercase'>DEAL DAILY</span>
                <span className='flex-1'></span>
            </div>

            <div 
                className='w-full flex flex-col items-center pt-8 gap-3 cursor-pointer'
                onClick={handleClickProduct}
            >
                <img
                    src={dealDaily?.thumb || "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"}
                    alt={dealDaily?.title}
                    className='w-full h-[274px] object-contain hover:scale-105 transition-transform'
                />
                <span className="line-clamp-1 text-center mt-2 font-semibold text-lg hover:text-main">
                    {dealDaily?.title}
                </span>
                <span className='flex h-4'>
                    {renderStarFromNumber(dealDaily?.totalRatings, 20)?.map((star, index) => (
                        <span key={index}>{star}</span>
                    ))}
                </span>
                <span className='font-bold text-main'>{`${formatMoney(dealDaily?.price || 0)} VND`}</span>
            </div>

            <div className='mt-8'>
                <div className='flex justify-center gap-2 items-center mb-6'>
                    {/* KIỂM TRA: Nếu trang vẫn trắng, hãy thử comment 3 dòng Countdown này lại */}
                    <Countdown unit={'Hours'} number={h} />
                    <Countdown unit={'Minutes'} number={m} />
                    <Countdown unit={'Seconds'} number={s} />
                </div>

                <button
                    type='button'
                    onClick={handleClickProduct}
                    className='flex items-center justify-center w-full bg-main hover:bg-gray-900 text-white font-bold py-3 gap-2 transition-all rounded-sm uppercase tracking-wider'
                >
                    <AiOutlineMenu size={20} />
                    <span>View Product</span>
                </button>
            </div> 
        </div>
    )
}

export default memo(DealDaily)