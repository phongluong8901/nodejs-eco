import React, { useState, useEffect, memo } from 'react'
import icons from '../ultils/icons'
import { apiGetProducts } from '../apis/product'
import { renderStarFromNumber, formartMoney } from '../ultils/helpers'
import { AiOutlineMenu } from 'react-icons/ai'
import { Countdown } from './'

const { AiFillStar } = icons
let idInterval // Khai báo ngoài để quản lý tốt hơn

const DealDaily = () => {
    const [dealDaily, setDealdaily] = useState(null)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 1, page: (Math.random()*10), totalRatings: 5 })
        if (response?.success) {
            setDealdaily(response.products[0])
            
            // Tính toán thời gian còn lại trong ngày
            const today = new Date()
            const secondsInDay = 24 * 60 * 60
            const secondsPassed = (today.getHours() * 3600) + (today.getMinutes() * 60) + today.getSeconds()
            const remainingSeconds = secondsInDay - secondsPassed

            const h = Math.floor(remainingSeconds / 3600)
            const m = Math.floor((remainingSeconds % 3600) / 60)
            const s = Math.floor(remainingSeconds % 60)

            setHour(h)
            setMinute(m)
            setSecond(s)
        }
    }

    // Lần đầu fetch data
    useEffect(() => {
        fetchDealDaily()
    }, [])

    // Khi hết thời gian thì fetch lại deal mới
    useEffect(() => {
        if (expireTime) {
            fetchDealDaily()
            setExpireTime(false)
        }
    }, [expireTime])

    // Logic đếm ngược
    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) {
                setSecond(prev => prev - 1)
            } else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59) // Sửa thành 59 vì 60 là 1 phút rồi
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(true)
                    }
                }
            }
        }, 1000)

        return () => {
            clearInterval(idInterval)
        }
    }, [second, minute, hour]) // Thêm các biến này để interval cập nhật giá trị mới nhất

    return (
        <div className='w-full border flex-auto p-5'>
            {/* Header và Nội dung ảnh/giá (giữ nguyên như code của bạn) */}
            <div className='flex items-center justify-between w-full mb-4'>
                <span className='flex-1 flex justify-start'>
                    <AiFillStar size={20} color='#DD1111' />
                </span>
                <span className='flex-8 font-semibold text-[20px] text-center text-gray-600'>DEAL DAILY</span>
                <span className='flex-1'></span>
            </div>

            <div className='w-full flex flex-col items-center pt-8 gap-2'>
                <img
                    src={dealDaily?.thumb || "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"}
                    alt={dealDaily?.title}
                    className='w-full object-contain'
                />
                <span className="line-clamp-1 text-center mt-2 font-semibold">{dealDaily?.title}</span>
                <span className='flex h-4'>
                    {renderStarFromNumber(dealDaily?.totalRatings, 20)?.map((star, index) => (
                        <span key={index}>{star}</span>
                    ))}
                </span>
                <span className='font-medium'>{`${formartMoney(dealDaily?.price || 0)} VND`}</span>
            </div>

            {/* Phần Countdown */}
            <div className='px-4 mt-8'>
                <div className='flex justify-center gap-2 items-center mb-4'>
                    <Countdown unit={'Hours'} number={hour} />
                    <Countdown unit={'Minutes'} number={minute} />
                    <Countdown unit={'Seconds'} number={second} />
                </div>

                <button
                    type='button'
                    className='flex items-center justify-center w-full bg-main hover:bg-black text-white font-medium py-2 mt-4 gap-2 transition-all'
                >
                    <AiOutlineMenu />
                    <span>OPTIONS</span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily)