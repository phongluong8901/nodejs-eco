import React, { useState } from 'react'
import { formartMoney } from '../../ultils/helpers'
import label from '../../assets/label.png'
import { renderStarFromNumber } from '../../ultils/helpers'
import { SelectOption, QuickView } from '..' 
import icons from '../../ultils/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/app/appSlice' 
import Swal from 'sweetalert2' 
import path from '../../ultils/path' 
import { apiUpdateCart, apiUpdateWishlist } from '../../apis' // Thêm apiUpdateWishlist
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'

const { AiFillEye, BsCartCheck, BsFillSuitHeartFill } = icons

const Product = ({ productData }) => {
    const [isShowOption, setIsShowOption] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { current } = useSelector(state => state.user)

    const handleClickOptions = async (e, flag) => {
        e.stopPropagation() 
        e.preventDefault()    

        if (flag === 'CART') {
            if (!current) {
                return Swal.fire({
                    title: 'Almost...',
                    text: 'Please login to add products to your cart',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login',
                    confirmButtonColor: '#ee3131'
                }).then((result) => {
                    if (result.isConfirmed) navigate(`/${path.LOGIN}`)
                })
            }

            const response = await apiUpdateCart({
                pid: productData?._id,
                color: productData?.color || 'Black',
                quantity: 1
            })

            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            } else {
                toast.error(response.mes)
            }
        }

        if (flag === 'WISHLIST') {
            // Check login trước khi cho thêm vào wishlist
            if (!current) {
                return Swal.fire({
                    title: 'Almost...',
                    text: 'Please login to use wishlist',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login',
                    confirmButtonColor: '#ee3131'
                }).then((result) => {
                    if (result.isConfirmed) navigate(`/${path.LOGIN}`)
                })
            }
            
            // Gọi API Update Wishlist
            const response = await apiUpdateWishlist(productData?._id)
            if (response.success) {
                dispatch(getCurrent()) // Refresh lại user để update mảng wishlist mới nhất
                toast.success(response.mes)
            } else {
                toast.error(response.mes)
            }
        }

        if (flag === 'QUICK_VIEW') {
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <QuickView 
                    pid={productData?._id} 
                    category={productData?.category} 
                />
            }))
        }
    }

    return (
        <div className='w-full text-base px-[10px]'>
            <Link 
                className='w-full border p-[15px] flex flex-col items-center'
                to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`}
                onMouseEnter={() => setIsShowOption(true)}
                onMouseLeave={() => setIsShowOption(false)}
            >
                <div className='w-full relative'>
                    {isShowOption && 
                        <div className='absolute bottom-[-10px] flex left-0 right-0 justify-center gap-2 animate-slide-top'>
                            <span onClick={(e) => handleClickOptions(e, 'CART')}>
                                <SelectOption icon={<BsCartCheck />} />
                            </span>

                            <span onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}>
                                <SelectOption icon={<AiFillEye />} />
                            </span>
                            
                            <span onClick={(e) => handleClickOptions(e, 'WISHLIST')}>
                                <SelectOption 
                                    icon={<BsFillSuitHeartFill color={current?.wishlist?.some(i => i._id === productData?._id) ? 'red' : 'gray'} />} 
                                />
                            </span>
                        </div>
                    }
                    <img 
                        src={productData?.thumb || productData?.images[0] || "https://via.placeholder.com/274"} 
                        alt={productData?.title} 
                        className='w-full h-[274px] object-cover'
                    />
                    <img src={label} alt="" className='absolute top-0 left-[-16px] w-[70px] h-[25px] object-cover' />
                    <span className='font-bold top-0 left-0 w-[70px] h-[25px] absolute z-10 text-[10px] text-white pl-2 pt-1 uppercase'>New</span>
                </div>

                <div className='flex flex-col gap-2 mt-[15px] items-start w-full'>
                    <span className="line-clamp-1">{productData?.title}</span>
                    <span className='flex text-yellow-500'>
                        {renderStarFromNumber(productData.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                    </span>
                    <span className='font-semibold'>{`${formartMoney(productData?.price)} VND`}</span>
                </div>
            </Link>
        </div>
    )
}

export default Product