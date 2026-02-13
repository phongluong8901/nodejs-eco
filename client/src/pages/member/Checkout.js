import React, { useState, useEffect } from 'react'
import paymentImg from '../../assets/payment.png'
import { useSelector, useDispatch } from 'react-redux'
import { formatMoney } from '../../ultils/helpers'
import { apiCreateOrder } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const Checkout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { current } = useSelector(state => state.user)
    
    const [isSuccess, setIsSuccess] = useState(false)
    const [address, setAddress] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        if (current?.address) setAddress(current?.address)
    }, [current])

    const totalVND = current?.cart?.reduce((sum, el) => sum + el.product?.price * el.quantity, 0)
    const totalUSD = (totalVND / 25000).toFixed(2)

    const handleSaveOrder = async () => {
        if (!address || address.length < 10) {
            return toast.warn('Vui lòng nhập địa chỉ giao hàng chi tiết!')
        }

        const payload = {
            products: current?.cart,
            total: totalVND,
            address: address,
            status: 'Successed' 
        }

        setIsProcessing(true)
        const response = await apiCreateOrder(payload)
        setIsProcessing(false)

        if (response.success) {
            // 1. Đánh dấu trạng thái thành công để hiện Overlay
            setIsSuccess(true)

            // 2. HIỆN THÔNG BÁO SWAL TRƯỚC
            let timerInterval
            Swal.fire({
                title: 'Thanh toán thành công!',
                html: 'Đơn hàng đã được hệ thống ghi nhận. Quay lại trang chủ sau <b>10</b> giây.',
                timer: 10000,
                timerProgressBar: true,
                icon: 'success',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                    }, 1000)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                // 3. KHI SWAL ĐÓNG (HẾT 10S HOẶC BẤM OK) THÌ MỚI LÀM MỚI USER VÀ CHUYỂN TRANG
                // Việc dispatch ở đây giúp Redux cập nhật đúng lúc giỏ hàng đã trống ở DB
                dispatch(getCurrent()) 
                navigate('/')
            })
        } else {
            // Nếu BE trả về lỗi (ví dụ rs: 'Cart is empty') thì in ra
            toast.error(response.rs || 'Có lỗi xảy ra!')
        }
    }

    return (
        <div className='p-8 grid grid-cols-10 gap-6 h-full max-h-screen overflow-y-auto bg-gray-50'>
            <div className='col-span-4 flex flex-col items-center justify-center bg-white rounded-md'>
                <img 
                    src={paymentImg}
                    alt="payment"
                    className='h-[60%] object-contain'
                />
            </div>

            <div className='col-span-6 flex flex-col gap-6 justify-center items-center bg-white p-6 rounded-md shadow-sm'>
                <h2 className='text-3xl font-bold mb-4 text-main uppercase'>Checkout Your Order</h2>
                
                <div className='w-full flex flex-col gap-3'>
                    <div className='max-h-[300px] overflow-y-auto border'>
                        <table className='table-auto w-full text-sm'>
                            <thead>
                                <tr className='border bg-gray-100'>
                                    <th className='p-2 text-left'>Sản phẩm</th>
                                    <th className='p-2 text-center'>Số lượng</th>
                                    <th className='p-2 text-right'>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {current?.cart?.map(el => (
                                    <tr key={el._id} className='border-b'>
                                        <td className='p-2'>
                                            <span className='line-clamp-1'>{el.product?.title}</span>
                                            <span className='text-xs text-gray-400'>{el.color}</span>
                                        </td>
                                        <td className='p-2 text-center'>{el.quantity}</td>
                                        <td className='p-2 text-right'>{formatMoney(el.product?.price * el.quantity)} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex justify-between items-center mt-4 border-t pt-4'>
                        <span className='font-bold text-xl'>Tổng thanh toán:</span>
                        <div className='text-right'>
                            <div className='text-main font-bold text-2xl'>{formatMoney(totalVND)} VND</div>
                            <div className='text-sm text-gray-500 italic'>~ {totalUSD} USD</div>
                        </div>
                    </div>

                    <div className='mt-4 w-full'>
                        <span className='font-medium text-gray-700'>Địa chỉ nhận hàng:</span>
                        <textarea 
                            rows={3}
                            className='w-full p-2 border mt-2 outline-none focus:border-main rounded-sm text-sm'
                            placeholder='Số nhà, tên đường, phường/xã, quận/huyện...'
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>

                    <div className='mt-8 w-full border-t pt-8'>
                        <button
                            onClick={handleSaveOrder}
                            disabled={isProcessing}
                            className={`w-full py-3 text-white font-semibold uppercase rounded-md transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                        >
                            {isProcessing ? 'Đang xử lý đơn hàng...' : 'Xác nhận đặt hàng'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Hiệu ứng overlay khi thành công giúp chặn user bấm linh tinh trong 10s */}
            {isSuccess && (
                <div className='fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-[1000]'>
                    <div className='bg-white p-10 rounded-lg text-center shadow-xl'>
                        <div className='flex justify-center mb-4'>
                             <div className="animate-bounce bg-green-500 p-2 w-10 h-10 ring-2 ring-white rounded-full flex items-center justify-center text-white">✓</div>
                        </div>
                        <h3 className='text-2xl font-bold text-green-600'>THANH TOÁN THÀNH CÔNG</h3>
                        <p className='text-gray-500 mt-2'>Vui lòng đợi trong giây lát...</p>
                    </div>
                </div>
            )}
        </div>
    ) 
}

export default Checkout