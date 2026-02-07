import React, { memo } from 'react'
import Slider from 'react-slick';
import { Product } from './'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const CustomSlider = ({ products, activeTab }) => {
    return (
        <>
            {/* Kiểm tra kỹ xem có phải mảng và có phần tử nào không */}
            {Array.isArray(products) && products.length > 0 && (
                <Slider {...settings}>
                    {products.map((el) => (
                        <Product
                            key={el._id} 
                            pid={el.id}
                            productData={el}
                            isNew={activeTab === 1 ? false : true}
                        />
                    ))}
                </Slider>
            )}
        </>
    )
}

export default memo(CustomSlider)