import React from 'react'
import withBaseComponent from '../../hocs/withBaseComponent'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../ultils/helpers'
import { Button } from '../../components'
import path from '../../ultils/path'
import { AiOutlineDelete } from 'react-icons/ai'
import { apiRemoveCart } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'

const MyCart = ({ navigate, dispatch }) => {
    const { current } = useSelector(state => state.user)

    const handleRemoveCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) {
            dispatch(getCurrent())
        } else {
            toast.error(response.mes)
        }
    }

    return (
        <div className='w-full p-4 flex flex-col'>
            <header className='text-3xl font-semibold py-4 border-b border-main'>
                My Cart
            </header>
            
            <div className='flex flex-col gap-4 mt-6'>
                {current?.cart?.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                        {current?.cart?.map(el => (
                            <div key={el._id} className='flex justify-between items-center bg-gray-100 p-4 rounded-md'>
                                <div className='flex gap-4'>
                                    <img src={el.product?.thumb} alt="thumb" className='w-16 h-16 object-cover rounded-md' />
                                    <div className='flex flex-col'>
                                        <span className='font-bold text-main'>{el.product?.title}</span>
                                        <span className='text-sm text-gray-500'>{el.color}</span>
                                        <span className='text-sm italic'>{`Quantity: ${el.quantity}`}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end gap-2'>
                                    <span className='font-bold text-lg'>{formatMoney(el.product?.price * el.quantity)} VND</span>
                                    <span 
                                        onClick={() => handleRemoveCart(el.product?._id, el.color)}
                                        className='p-2 rounded-full hover:bg-red-100 cursor-pointer text-red-600 transition-all'
                                        title='Remove from cart'
                                    >
                                        <AiOutlineDelete size={20} />
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        <div className='flex flex-col items-end gap-3 mt-6 border-t pt-4'>
                            <div className='flex gap-4 text-xl'>
                                <span>Total Subtotal:</span>
                                <span className='font-bold text-main'>
                                    {formatMoney(current?.cart?.reduce((sum, el) => sum + el.product?.price * el.quantity, 0))} VND
                                </span>
                            </div>
                            <div className='flex gap-3'>
                                <Button 
                                    handleOnClick={() => navigate(`/${path.DETAIL_CART}`)}
                                    style='px-6 py-2 bg-gray-800 text-white font-semibold rounded-md'
                                >
                                    View Full Cart
                                </Button>
                                <Button 
                                    handleOnClick={() => navigate(`/${path.CHECKOUT}`)}
                                    style='px-6 py-2 bg-main text-white font-semibold rounded-md'
                                >
                                    Go to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-10 gap-4'>
                        <p className='italic text-gray-500'>Your cart is currently empty.</p>
                        <Button 
                            handleOnClick={() => navigate(`/${path.HOME}`)}
                            style='px-6 py-2 bg-main text-white font-semibold rounded-md'
                        >
                            Shopping Now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default withBaseComponent(MyCart)