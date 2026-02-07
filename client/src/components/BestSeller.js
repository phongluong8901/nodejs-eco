import React, { useEffect, useState } from 'react'
import { apiGetProducts } from '../apis/product'
import {Product, CustomSlider} from './'
import Slider from "react-slick";
import { getNewProducts } from '../store/products/asyncAction';
import { useDispatch, useSelector } from 'react-redux';


const tabs = [
    { id: 1, name: 'best seller' },
    { id: 2, name: 'new arrival' },
    { id: 3, name: 'tablet' },
]

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
    const [products, setProducts] = useState(null)

    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products); // Thêm 's' cho khớp với Store

    const fetchProducts = async () => {
    // Chỉ lấy Best Seller tại đây thôi
    const response = await apiGetProducts({ sort: '-sold' });
    if (response?.success) {
        setBestSellers(response.products);
        setProducts(response.products);
    }
    // Xóa bỏ hoàn toàn dòng liên quan đến response[1] và setNewProducts
}

    useEffect(() => {
        fetchProducts();
        dispatch(getNewProducts())
    }, [])

    useEffect(() => {
        // Sửa logic ở đây để lấy đúng data khi click tab
        if (activedTab === 1) setProducts(bestSellers)
        if (activedTab === 2) setProducts(newProducts)
    }, [activedTab, bestSellers, newProducts])

    return (
        <div>
            <div className='flex text-[20px] gap-8 pb-4 border-b-2 border-main'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold capitalize cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>

            <div className='mt-4 mx-[-10px]'>
                <CustomSlider products={products} activeTab={activedTab}/>

                <div className='w-full flex gap-4 mt-8'>
                    <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/promo-23_2000x_crop_center.png?v=1750842393"
                    alt="banner"
                    className='flex-1 object-container'
                    />

                    <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/promo-24_2000x_crop_center.png?v=1750842410"
                    alt="banner"
                    className='flex-1 object-container'
                    />
                </div>

            </div>
        </div>
    )
}

export default BestSeller