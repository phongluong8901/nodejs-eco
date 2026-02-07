import React, {useState} from 'react'
import {formartMoney} from '../ultils/helpers'
import label from '../assets/label.png'
import { renderStarFromNumber } from '../ultils/helpers'
import {SelectOption} from './'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const {AiFillEye,
    AiOutlineMenu,
    BsFillSuitHeartFill} = icons

const Product = ({productData}) => {
    const [isShowOption, setIsShowOption] = useState(false)
    return (
        <div className='w-full text-base px-[10px]'>

                
            <Link className='w-full border p-[15px] flex flex-col items-center'
            to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
            onMouseEnter={e => {
                e.stopPropagation()
                setIsShowOption(true)
            }}
            onMouseLeave={e => {
                e.stopPropagation()
                setIsShowOption(false)
            }}
            >
                <div className='w-full relative'>
                    {isShowOption && 
                    <div className='absolute bottom-0 flex left-0 right-0 justify-center gap-2 animate-slide-top'>
                        
                        <SelectOption icon={<AiFillEye />} />
                        <SelectOption icon={<AiOutlineMenu />} />
                        <SelectOption icon={<BsFillSuitHeartFill />} />
                    </div>
                    }
                    <img 
                    src={productData?.images[0] || "https://cajasgraf.com.ar/productos/details.php?set_lang=en"} 
                    alt="" 
                    className='w-full h-[274px] object-cover'/>
                    <span className='font-bold top-0 left-0 w-[70px] h-[25px] absolute z-10 text-[10px]'>New</span>
                    <img src={label} alt="" className='absolute top-0 left-[-16px] w-[70px] h-[25px] object-cover' />
                </div>

                <div className='flex flex-col gap-2 mt-[15px] items-start ga-1 w-full'>
                    <span class="line-clamp-1">{productData?.title}</span>
                    <span className='flex'>{renderStarFromNumber(productData.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formartMoney(productData?.price)} VND`}</span>
                </div>
            </Link>

        </div>

    )
}

export default Product