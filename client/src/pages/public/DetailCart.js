import React from 'react'
import { useSelector } from 'react-redux'
import { Breadcrumb, Button } from '../../components'
import OrderItem from '../../components/products/OrderItem' // Đảm bảo bạn đã tạo file này
import { formatMoney } from '../../ultils/helpers'
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import path from '../../ultils/path'

const DetailCart = () => {
    const { current, isLoggedIn } = useSelector(state => state.user)
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = () => {
        if (!isLoggedIn) return navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({ redirect: location.pathname }).toString()
        })
        navigate(`/${path.CHECKOUT}`)
    }

    return (
        <div className='w-full'>
            <div className='h-[75px] flex items-center justify-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase text-2xl'>My Cart</h3>
                    {/* Breadcrumb giúp người dùng quay lại Home dễ dàng */}
                    {/* <Breadcrumb category='My Cart' /> */}
                </div>
            </div>
            
            <div className='flex flex-col border w-main mx-auto my-8'>
                {/* Header bảng giỏ hàng */}
                <div className='w-full bg-gray-200 font-bold py-3 grid grid-cols-10'>
                    <span className='col-span-6 pl-4'>Products</span>
                    <span className='col-span-1 text-center'>Quantity</span>
                    <span className='col-span-3 text-right pr-4'>Price</span>
                </div>

                {/* Danh sách các sản phẩm */}
                {!current?.cart?.length && (
                    <div className='text-center py-10 italic text-gray-500'>
                        Your shopping cart is empty.
                    </div>
                )}

                {current?.cart?.map(el => (
                    <OrderItem 
                        key={el._id} 
                        el={el} 
                        // Component này sẽ tự xử lý logic tăng giảm thông qua apiUpdateCart
                        defaultQuantity={el.quantity}
                    />
                ))}
            </div>

            {/* Phần tổng kết và nút bấm */}
            <div className='w-main mx-auto flex flex-col items-end gap-3 mb-12'>
                <span className='flex items-center gap-8 text-xl font-bold'>
                    <span>Subtotal:</span>
                    <span className='text-main'>
                        {formatMoney(current?.cart?.reduce((sum, el) => sum + Number(el.product?.price) * el.quantity, 0))} VND
                    </span>
                </span>
                <span className='italic text-sm text-gray-500'>Shipping, taxes, and discounts calculated at checkout.</span>
                
                <div className='flex gap-4'>
                    <button 
                        onClick={() => navigate(`/${path.HOME}`)}
                        className='px-4 py-2 bg-gray-800 text-white uppercase font-semibold hover:bg-gray-700'
                    >
                        Continue Shopping
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className='px-4 py-2 bg-main text-white uppercase font-semibold hover:bg-red-600'
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetailCart