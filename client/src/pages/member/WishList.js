import React from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from '../../ultils/helpers'
import { Button } from '../../components'
import withBaseComponent from '../../hocs/withBaseComponent'
import { IoTrashOutline } from 'react-icons/io5'
import { apiUpdateWishlist } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'

const Wishlist = ({ navigate, dispatch }) => {
    const { current } = useSelector(state => state.user)

    const handleRemoveWishlist = async (pid) => {
        const response = await apiUpdateWishlist(pid)
        if (response.success) {
            dispatch(getCurrent())
            toast.success(response.mes)
        } else toast.error(response.mes)
    }

    return (
        <div className='w-full flex flex-col min-h-screen bg-gray-50 relative'>
            <header className='h-[75px] flex justify-between items-center text-3xl font-extrabold px-4 border-b bg-white uppercase tracking-tight'>
                <span>My Wishlist</span>
            </header>

            <div className='p-6 flex-auto'>
                {current?.wishlist?.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                        {current?.wishlist?.map(el => (
                            <div 
                                key={el._id} 
                                className='group bg-white border border-gray-100 flex flex-col gap-3 p-3 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative'
                            >
                                {/* Nút xóa nhanh */}
                                <div 
                                    className='absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-md text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white cursor-pointer'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveWishlist(el._id)
                                    }}
                                >
                                    <IoTrashOutline size={18} />
                                </div>

                                <div 
                                    className='cursor-pointer overflow-hidden rounded-lg'
                                    onClick={() => navigate(`/${el?.category?.toLowerCase()}/${el?._id}/${el?.title}`)}
                                >
                                    <img 
                                        src={el?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} 
                                        alt="thumb" 
                                        className='w-full h-[180px] object-cover group-hover:scale-110 transition-transform duration-500' 
                                    />
                                </div>

                                <div className='flex flex-col gap-1 mt-1'>
                                    <span className='font-bold text-gray-800 line-clamp-1 uppercase text-sm group-hover:text-main transition-colors'>
                                        {el?.title}
                                    </span>
                                    <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>{el?.brand}</span>
                                    <span className='font-extrabold text-main mt-1'>{formatMoney(el?.price)} <span className='text-[10px]'>VND</span></span>
                                </div>

                                <div className='mt-auto pt-2'>
                                    <button
                                        onClick={() => navigate(`/${el?.category?.toLowerCase()}/${el?._id}/${el?.title}`)}
                                        className='w-full py-2 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-main transition-all active:scale-95 shadow-md'
                                    >
                                        View Product
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='w-full flex flex-col items-center justify-center py-32 bg-white rounded-2xl border-2 border-dashed border-gray-200'>
                        <div className='text-6xl mb-4'>❤️</div>
                        <h3 className='text-xl font-bold text-gray-700'>Your Wishlist is Empty</h3>
                        <p className='text-gray-400 mb-6'>Save items you want to buy later here!</p>
                        <Button
                            handleOnClick={() => navigate('/')}
                            style='px-8 py-3 bg-main text-white font-bold uppercase tracking-widest rounded-full shadow-lg hover:shadow-red-200 transition-all active:scale-95'
                        >
                            Start Shopping
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default withBaseComponent(Wishlist)