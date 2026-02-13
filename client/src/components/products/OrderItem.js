import React, { useEffect, useState } from 'react'
import { formatMoney } from '../../ultils/helpers'
import SelectQuantity from '../search/SelectQuantity'
import { apiRemoveCart, apiUpdateCart } from '../../apis/user'
import { getCurrent } from '../../store/user/asyncActions'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { AiOutlineDelete } from 'react-icons/ai'

const OrderItem = ({ el, defaultQuantity = 1, color, title, thumb, price, pid }) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(() => defaultQuantity)

    const handleQuantity = (val) => {
        if (!Number(val) || Number(val) < 1) setQuantity(1)
        else setQuantity(val)
    }

    const handleChangeQuantity = (type) => {
        if (type === 'minus' && quantity <= 1) return
        if (type === 'minus') setQuantity(prev => +prev - 1)
        if (type === 'plus') setQuantity(prev => +prev + 1)
    }

    // Mỗi khi số lượng thay đổi, cập nhật ngay vào DB
    useEffect(() => {
        if (quantity !== defaultQuantity) {
            handleUpdateQuantity(el.product?._id, quantity, el.color)
        }
    }, [quantity])

    const handleUpdateQuantity = async (pid, quantity, color) => {
        const response = await apiUpdateCart({ pid, quantity, color })
        if (response.success) dispatch(getCurrent())
    }

    const handleRemoveCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) dispatch(getCurrent())
        else toast.error(response.mes)
    }

    return (
        <div className='w-full mx-auto border-b py-3 grid grid-cols-10 items-center'>
            <span className='col-span-6 w-full'>
                <div className='flex gap-4 px-4'>
                    <img src={el.product?.thumb} alt="thumb" className='w-28 h-28 object-cover border' />
                    <div className='flex flex-col gap-1'>
                        <span className='text-main font-semibold'>{el.product?.title}</span>
                        <span className='text-xs text-gray-500'>Color: {el.color}</span>
                        <span 
                            onClick={() => handleRemoveCart(el.product?._id, el.color)}
                            className='flex items-center gap-1 text-[12px] text-red-500 cursor-pointer hover:underline mt-2'
                        >
                            <AiOutlineDelete /> Remove
                        </span>
                    </div>
                </div>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div className='flex items-center justify-center'>
                    <SelectQuantity 
                        quantity={quantity} 
                        handleQuantity={handleQuantity} 
                        handleChangeQuantity={handleChangeQuantity} 
                    />
                </div>
            </span>
            <span className='col-span-3 w-full text-right pr-4 font-semibold text-lg'>
                {formatMoney(el.product?.price * quantity)} VND
            </span>
        </div>
    )
}

export default OrderItem