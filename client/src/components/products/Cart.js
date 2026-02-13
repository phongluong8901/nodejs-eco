import React, { useCallback } from 'react'
import { AiOutlineClose, AiOutlineDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { showCart } from '../../store/app/appSlice'
import { formatMoney } from '../../ultils/helpers'
import { apiRemoveCart, apiUpdateCart } from '../../apis/user'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'
import SelectQuantity from '../search/SelectQuantity'
import { Link, useNavigate } from 'react-router-dom' // Thêm useNavigate
import path from '../../ultils/path'

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate() // Khởi tạo điều hướng
    const { current } = useSelector(state => state.user)

    const handleRemoveCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) dispatch(getCurrent())
        else toast.error(response.mes)
    }

    const handleUpdateQuantity = async (pid, quantity, color) => {
        if (quantity < 1) return
        const response = await apiUpdateCart({ pid, quantity, color })
        if (response.success) dispatch(getCurrent())
        else toast.error(response.mes)
    }

    // Hàm xử lý chuyển trang khi nhấn Checkout
    const handleGoToCart = () => {
        dispatch(showCart()) // 1. Đóng sidebar
        navigate(`/${path.MY_CART}`) // 2. Nhảy thẳng tới /my-cart
    }

    return (
        <div onClick={() => dispatch(showCart())} className='fixed inset-0 bg-overlay z-50 flex justify-end'>
            <div onClick={e => e.stopPropagation()} className='w-[400px] bg-black text-white p-8 grid grid-rows-10 h-screen'>
                <header className='row-span-1 border-b border-gray-500 flex justify-between items-center font-bold text-2xl uppercase'>
                    <span>Your Cart</span>
                    <span onClick={() => dispatch(showCart())} className='cursor-pointer p-2 hover:text-red-500'><AiOutlineClose size={24} /></span>
                </header>

                <section className='row-span-7 flex flex-col gap-4 overflow-y-auto py-4 no-scrollbar'>
                    {current?.cart?.map(el => (
                        <div key={el._id} className='flex justify-between items-center gap-4'>
                            <div className='flex gap-4'>
                                <img src={el.product?.thumb} alt="thumb" className='w-16 h-16 object-cover border border-gray-700' />
                                <div className='flex flex-col gap-1'>
                                    <span className='text-sm font-semibold text-main'>{el.product?.title}</span>
                                    <span className='text-[10px] text-gray-400'>{el.color}</span>
                                    
                                    <div className='flex items-center border border-gray-200 w-fit mt-1'>
                                        <SelectQuantity 
                                            dark 
                                            quantity={el.quantity}
                                            handleQuantity={(val) => handleUpdateQuantity(el.product?._id, val, el.color)}
                                            handleChangeQuantity={(type) => {
                                                if (type === 'minus' && el.quantity === 1) return
                                                handleUpdateQuantity(el.product?._id, type === 'minus' ? el.quantity - 1 : el.quantity + 1, el.color)
                                            }}
                                        />
                                    </div>
                                    <span className='text-sm mt-1'>{formatMoney(el.product?.price)} VND</span>
                                </div>
                            </div>
                            <span onClick={() => handleRemoveCart(el.product?._id, el.color)} className='hover:text-red-500 cursor-pointer p-2'>
                                <AiOutlineDelete size={20} />
                            </span>
                        </div>
                    ))}
                </section>

                <div className='row-span-2 flex flex-col justify-between pt-4 border-t border-gray-500'>
                    <div className='flex items-center justify-between font-bold'>
                        <span>Subtotal:</span>
                        <span>{formatMoney(current?.cart?.reduce((sum, el) => sum + Number(el.product?.price) * el.quantity, 0))} VND</span>
                    </div>
                    {/* Nút bấm chuyển trang */}
                    <button 
                        onClick={handleGoToCart}
                        className='w-full bg-main py-3 rounded-md uppercase font-semibold mt-4 text-white hover:bg-gray-800 transition-all'
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart