import React, {useEffect, useState} from 'react'
import {Sidebar, Banner, BestSeller, DealDaily, FeatureProducts, Product, CustomSlider } from '../../components'
import Slider from 'react-slick'
import { useSelector } from 'react-redux'
import { getNewProducts } from '../../store/products/asyncAction'


const Home = () => {
    const {newProducts} = useSelector(state => state.products)
    const {categories} = useSelector(state => state.app)
    const {isLoggedIn, current} =useSelector(state => state.user)

    console.log({isLoggedIn, current})

    return (
        
        <>
            <div className='w-main flex'>
            <div className='flex flex-col gap-5 w-[25%] flex-auto'>
                <Sidebar />
                <DealDaily />
            </div>
            <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto'>
                <Banner />
                <BestSeller />
            </div>

            
        </div>

        <div className='my-8'>
            <FeatureProducts />
        </div>

        <div className='my-8'>
            <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>New Arrivals</h3>
            <div className='w-full mt-4 mx-[-10px]'>
                <CustomSlider 
                products={newProducts}
                />
            </div>
        </div>

        <div className='my-8 w-full'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase'>
            Hot Collection
        </h3>
        <div className='flex flex-wrap gap-4 mt-4'>
            {categories?.filter(el => el.brand.length > 0).map(el => (
                <div key={el._id} className='w-[396px] flex-auto'>
                    {/* Sửa boder -> border và thêm padding/shadow cho đẹp */}
                    <div className='border p-4 flex gap-4 min-h-[190px]'>
                        <img 
                            src={el?.image}
                            alt={el.title}
                            className='w-[144px] h-[129px] object-cover'
                        />
                        <div className='flex-1 text-gray-700'>
                            <h4 className='font-semibold uppercase text-sm mb-2'>{el.title}</h4>
                            <ul className='text-xs space-y-1'>
                                {el?.brand?.map(item => (
                                    <li 
                                        key={item} 
                                        className='hover:text-main cursor-pointer flex items-center gap-1 text-gray-500'
                                    >
                                        <span>›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>

        </>
    )
}

export default Home