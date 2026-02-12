import React, { useEffect } from 'react'
import { Banner, BestSeller, DealDaily, FeatureProducts, CustomSlider } from '../../components'
import { useSelector, useDispatch } from 'react-redux'
import { getNewProducts } from '../../store/products/asyncAction'
import { Sidebar } from '../../components'

const Home = () => {
    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)

    useEffect(() => {
        dispatch(getNewProducts())
    }, [dispatch])

    return (
        <div className='w-full'>
            {/* PHẦN 1: SIDEBAR & BANNER - Căn giữa bằng w-main mx-auto */}
            <div className='w-main mx-auto flex gap-6 mt-6'>
                <div className='flex flex-col gap-5 w-[25%] flex-auto'>
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className='flex flex-col gap-5 w-[75%] flex-auto'>
                    <Banner />
                    <BestSeller />
                </div>
            </div>

            {/* PHẦN 2: FEATURE PRODUCTS */}
            <div className='w-main mx-auto my-8'>
                <FeatureProducts />
            </div>

            {/* PHẦN 3: NEW ARRIVALS (SLIDER) */}
            <div className='w-main mx-auto my-8'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase mb-4'>
                    New Arrivals
                </h3>
                <CustomSlider products={newProducts} />
            </div>

            {/* PHẦN 4: HOT COLLECTION */}
            <div className='w-main mx-auto my-8'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase'>
                    Hot Collection
                </h3>
                <div className='flex flex-wrap gap-4 mt-4'>
                    {categories?.filter(el => el.brand?.length > 0).map(el => (
                        <div key={el._id} className='w-[calc(33.33%-11px)] min-w-[300px]'>
                            <div className='border p-4 flex gap-4 min-h-[190px] shadow-sm hover:shadow-md transition-all duration-300'>
                                <img 
                                    src={el?.image}
                                    alt={el.title}
                                    className='w-[144px] h-[129px] object-contain'
                                />
                                <div className='flex-1 text-gray-700'>
                                    <h4 className='font-semibold uppercase text-sm mb-2'>{el.title}</h4>
                                    <ul className='text-xs space-y-2 text-gray-500'>
                                        {el?.brand?.map(item => (
                                            <li 
                                                key={item} 
                                                className='hover:text-main cursor-pointer flex items-center gap-1'
                                            >
                                                <span className='text-[10px]'>›</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Khoảng đệm cuối trang trước khi tới Footer */}
            <div className='w-full h-[60px]'></div>
        </div>
    )
}

export default Home