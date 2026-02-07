import React, {useState, useEffect} from 'react'
import {ProductCard} from './'
import {apiGetProducts} from '../apis'

const FeatureProducts = () => {
    const [products, setProducts] = useState(null)

    const fetchProducts = async () => {
        const response = await apiGetProducts({limit: 9, totalRatings: 5})
        // console.log(response)
        if(response.success) setProducts(response.products)
    }
    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className='w-full'>
            <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>Feature Products</h3>
            <div className='flex flex-wrap mt=[15px]'>
                {products?.map(el => (
                    <ProductCard 
                    key={el.id} 
                    image={el.thumb}
                    title={el.title}
                    totalRatings={el.totalRatings}
                    price={el.price}
                    />
                ))}
            </div>

            <div className='flex justify-between'>
                <img 
                src="https://digital-world-2.myshopify.com/cdn/shop/files/Blue_And_Yellow_Modern_Electronic_Sale_Instagram_Post_580_x_655_px_1_600x.png?v=1750860746"
                alt=""
                className='w-[49%] object-contain'
                />
                <div className='flex flex-col justify-between w-[24%]'>
                    <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/Orange_Colorful_Juicer_Photo_Instagram_Post_280_x_338_px_1_400x.png?v=1750860819"
                    alt=""

                    />
                    <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/Red_and_Yellow_Classic_Neutrals_Cooking_Set_Product_Summer_Instagram_Post_280_x_338_px_1_cd2b3108-c6f2-4ee5-9597-8a501c61f0d6_400x.png?v=1750861662"
                    alt=""

                    />
                </div>
                <img 
                src="https://digital-world-2.myshopify.com/cdn/shop/files/Blue_Yellow_Simple_Mega_Sale_Electronic_Instagram_Post_280_x_655_px_1_400x.png?v=1750862046"
                alt=""
                className='w-[24%] object-contain'
                />
            </div>
        </div>
    )
}

export default FeatureProducts