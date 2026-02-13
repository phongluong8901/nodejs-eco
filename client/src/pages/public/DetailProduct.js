import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetProduct, apiGetProducts, apiRatings, apiUpdateCart } from '../../apis'
import {
    Breadcrumb,
    Button,
    SelectQuantity,
    ProductExtraInforItem,
    ProductInfomation,
    CustomSlider,
    VoteOption
} from '../../components'
import Slider from 'react-slick'
import { formartMoney, renderStarFromNumber } from '../../ultils/helpers'
import { productExtraInformation } from '../../ultils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/app/appSlice'
import { getCurrent } from '../../store/user/asyncActions'
import Swal from 'sweetalert2'
import path from '../../ultils/path'
import { toast } from 'react-toastify'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
}

const DetailProduct = () => {
    const { pid, title, category } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoggedIn, current } = useSelector(state => state.user)

    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [currentImage, setCurrentImage] = useState(null)
    const [isZoom, setIsZoom] = useState(false)
    const zoomRef = useRef()

    const [currentVariant, setCurrentVariant] = useState(null)
    const [currentData, setCurrentData] = useState({
        title: '',
        price: '',
        thumb: '',
        images: [],
        color: ''
    })

    const fetchProductData = useCallback(async () => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.productData)
            setCurrentImage(response.productData?.thumb)
            setCurrentData({
                title: response.productData?.title,
                price: response.productData?.price,
                thumb: response.productData?.thumb,
                images: response.productData?.images,
                color: response.productData?.color
            })
            const responseRelated = await apiGetProducts({ category: response.productData?.category })
            if (responseRelated.success) setRelatedProducts(responseRelated.products)
        }
    }, [pid])

    useEffect(() => {
        if (pid) fetchProductData()
        window.scrollTo(0, 0)
    }, [pid, fetchProductData])

    useEffect(() => {
        if (currentVariant) {
            const selected = product?.variants?.find(el => el.sku === currentVariant)
            if (selected) {
                setCurrentData({
                    title: selected.title,
                    price: selected.price,
                    thumb: selected.thumb,
                    images: selected.images,
                    color: selected.color
                })
                setCurrentImage(selected.thumb)
            }
        } else {
            setCurrentData({
                title: product?.title,
                price: product?.price,
                thumb: product?.thumb,
                images: product?.images,
                color: product?.color
            })
            setCurrentImage(product?.thumb)
        }
    }, [currentVariant, product])

    // --- LOGIC ADD TO CART ---
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            return Swal.fire({
                title: 'Almost there!',
                text: 'Please login to add products to your cart',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) navigate(`/${path.LOGIN}`)
            })
        }

        const response = await apiUpdateCart({
            pid,
            quantity,
            color: currentData.color
        })

        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent()) // Update lại giỏ hàng để Sidebar Cart nhảy số ngay
        } else {
            toast.error(response.mes)
        }
    }

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !score) {
            Swal.fire('Oops!', 'Please select stars and write your review.', 'warning')
            return
        }
        const response = await apiRatings({ star: score, comment, pid })
        if (response.success) {
            Swal.fire('Success!', 'Thank you for your review!', 'success').then(() => {
                fetchProductData()
                dispatch(showModal({ isShowModal: false, modalChildren: null }))
            })
        }
    }

    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Almost there!',
                text: 'Please login to vote',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) navigate(`/${path.LOGIN}`)
            })
        } else {
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <VoteOption nameProduct={product?.title} handleSubmitVoteOption={handleSubmitVoteOption} />
            }))
        }
    }

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.pageX - left - window.scrollX) / width) * 100
        const y = ((e.pageY - top - window.scrollY) / height) * 100
        if (zoomRef.current) zoomRef.current.style.backgroundPosition = `${x}% ${y}%`
    }

    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 flex items-center justify-center mb-8'>
                <div className='w-main'>
                    <h3 className='font-bold uppercase'>{currentData.title || title}</h3>
                    <Breadcrumb title={currentData.title || title} category={category} />
                </div>
            </div>

            <div className='w-main mx-auto flex gap-4'>
                <div className='w-2/5 flex flex-col gap-4'>
                    <div className='relative'>
                        <div 
                            className='w-full h-[458px] border flex items-center justify-center bg-white overflow-hidden cursor-crosshair'
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsZoom(true)}
                            onMouseLeave={() => setIsZoom(false)}
                        >
                            <img src={currentImage} alt="product" className='w-full h-full object-contain' />
                        </div>
                        {isZoom && (
                            <div 
                                ref={zoomRef}
                                className='absolute top-0 left-[105%] w-[120%] h-full border bg-white shadow-xl z-50'
                                style={{
                                    backgroundImage: `url(${currentImage})`,
                                    backgroundSize: '250%',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            />
                        )}
                    </div>
                    <div className='w-full'>
                        <Slider {...settings}>
                            {currentData.images?.map((el, index) => (
                                <div key={index} className='px-1'>
                                    <img 
                                        onClick={() => setCurrentImage(el)}
                                        src={el} alt="sub" 
                                        className={`h-[143px] w-full border object-contain cursor-pointer bg-white ${currentImage === el ? 'border-main' : ''}`} 
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className='w-2/5 pl-8 pr-4 flex flex-col gap-4'>
                    <h2 className='text-[30px] font-semibold text-main'>
                        {`${formartMoney(currentData.price || 0)} VND`}
                    </h2>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center text-yellow-500'>
                            {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </div>
                        <span className='text-sm text-gray-400 italic'>{`(Sold: ${product?.sold || 0})`}</span>
                    </div>

                    <div className='my-4 flex flex-col gap-3'>
                        <span className='font-bold uppercase text-sm'>Color</span>
                        <div className='flex flex-wrap gap-2 items-center'>
                            <div 
                                onClick={() => setCurrentVariant(null)}
                                className={`flex items-center gap-2 p-2 border cursor-pointer ${!currentVariant ? 'border-main' : 'border-gray-200'}`}
                            >
                                <img src={product?.thumb} alt="thumb" className='w-8 h-8 object-cover rounded-sm' />
                                <span className='text-xs uppercase'>{product?.color}</span>
                            </div>
                            {product?.variants?.map(el => (
                                <div 
                                    key={el.sku}
                                    onClick={() => setCurrentVariant(el.sku)}
                                    className={`flex items-center gap-2 p-2 border cursor-pointer ${currentVariant === el.sku ? 'border-main' : 'border-gray-200'}`}
                                >
                                    <img src={el.thumb} alt="variant" className='w-8 h-8 object-cover rounded-sm' />
                                    <span className='text-xs uppercase'>{el.color}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='text-sm text-gray-500'>
                        {Array.isArray(product?.description) ? (
                            <ul className='list-square pl-4'>
                                {product?.description?.map((el, index) => (
                                    <li className='leading-6' key={index}>{el}</li>
                                ))}
                            </ul>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
                        )}
                    </div>

                    <div className='flex flex-col gap-8 mt-4'>
                        <SelectQuantity 
                            quantity={quantity}
                            handleQuantity={(num) => setQuantity(num)}
                            handleChangeQuantity={(flag) => {
                                if (flag === 'minus' && quantity > 1) setQuantity(prev => prev - 1)
                                if (flag === 'plus') setQuantity(prev => prev + 1)
                            }}
                        />
                        <Button handleOnClick={handleAddToCart} fw>ADD TO CART</Button>
                    </div>
                </div>

                <div className='w-1/5 flex flex-col gap-3'>
                    {productExtraInformation.map(el => (
                        <ProductExtraInforItem key={el.id} title={el.title} sub={el.sub} icon={el.icon} />
                    ))}
                </div>
            </div>
            
            <div className='w-main mx-auto mt-8'>
                <ProductInfomation 
                    totalRatings={product?.totalRatings} 
                    ratings={product?.ratings} 
                    nameProduct={product?.title}
                    pid={product?._id}
                    rerender={fetchProductData}
                />
            </div>

            <div className='w-main mx-auto mb-10'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase'>Other Customers also buy</h3>
                <CustomSlider products={relatedProducts} normal={true} />
            </div>
        </div>
    )
}

export default DetailProduct