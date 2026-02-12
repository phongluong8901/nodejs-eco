import React, { memo, useState, useEffect } from 'react'
import { InputForm, Button, Select } from '..' 
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { apiUpdateProduct } from '../../apis' 
import { getBase64 } from '../../ultils/helpers'

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    // Thêm setValue để cập nhật file thủ công
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || 0,
            quantity: editProduct?.quantity || 0,
            brand: editProduct?.brand || '',
            category: editProduct?.category || '',
            description: editProduct?.description || '',
        })
        setPreview({
            thumb: editProduct?.thumb || null,
            images: editProduct?.images || []
        })
    }, [editProduct])

    // Xử lý Preview và đưa File vào Hook Form
    const handlePreviewThumb = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file)
            setPreview(prev => ({ ...prev, thumb: base64Thumb }))
            // Đưa file vào trường 'thumb' trong data của hook-form
            setValue('thumb', [file]) 
        }
    }

    const handlePreviewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not supported!')
                continue
            }
            const base64 = await getBase64(file)
            imagesPreview.push(base64)
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
        // Đưa danh sách file vào trường 'images'
        setValue('images', files)
    }

    const handleUpdate = async (data) => {
        console.log('--- FE 1: Dữ liệu thô từ Hook Form ---', data)
        
        const payload = new FormData()
        
        // 1. Append các trường text
        for (let [key, value] of Object.entries(data)) {
            if (key !== 'thumb' && key !== 'images') {
                payload.append(key, value)
            }
        }

        // 2. Append Thumb (Nếu có file mới trong mảng data.thumb)
        if (data.thumb && data.thumb.length > 0) {
            payload.append('thumb', data.thumb[0])
            console.log('--- FE 2: Đã nạp Thumb vào FormData ---', data.thumb[0])
        }

        // 3. Append mảng Images
        if (data.images && data.images.length > 0) {
            console.log('--- FE 3: Kiểm tra mảng Images ---', data.images)
            for (let image of data.images) {
                payload.append('images', image)
            }
        }

        // 4. LOG CUỐI CÙNG KIỂM TRA PAYLOAD (Mở Console F12 để xem)
        console.log('--- FE 4: Kiểm tra Payload thực tế trước khi gửi API ---')
        for (var pair of payload.entries()) {
            console.log(pair[0] + ': ' + pair[1]); 
        }

        const response = await apiUpdateProduct(payload, editProduct._id)
        
        if (response.success) {
            toast.success(response.mes)
            render()
            setEditProduct(null)
        } else {
            toast.error(response.mes)
        }
    }

    return (
        <div className='absolute inset-0 bg-white z-50 flex flex-col animate-slide-right'>
            <div className='h-[75px] flex justify-between items-center text-2xl font-bold px-6 border-b bg-gray-50 uppercase'>
                <span>Update Product: <span className='text-blue-600'>{editProduct?.title}</span></span>
                <button className='px-4 py-2 bg-orange-500 text-white rounded-md text-sm' onClick={() => setEditProduct(null)}>Cancel</button>
            </div>

            <div className='p-6 overflow-y-auto'>
                <form onSubmit={handleSubmit(handleUpdate)} className='max-w-[1000px] mx-auto flex flex-col gap-6'>
                    <InputForm label='Product Name' register={register} errors={errors} id='title' validate={{ required: 'Required' }} fullWidth />
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <InputForm label='Price' register={register} errors={errors} id='price' type='number' validate={{ required: 'Required' }} />
                        <InputForm label='Quantity' register={register} errors={errors} id='quantity' type='number' validate={{ required: 'Required' }} />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>Description</label>
                        <textarea rows="4" {...register('description', { required: 'Required' })} className='border border-gray-300 rounded-md p-3' />
                    </div>

                    <div className='grid grid-cols-2 gap-8'>
                        {/* Thumbnail */}
                        <div className='flex flex-col gap-2'>
                            <span className='font-semibold'>Thumbnail (Chính)</span>
                            <label htmlFor="thumb" className='w-[200px] h-[200px] border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden'>
                                {preview.thumb ? <img src={preview.thumb} className='w-full h-full object-cover' alt="thumb" /> : <span>Chọn ảnh</span>}
                            </label>
                            <input 
                                type="file" 
                                id="thumb" 
                                hidden 
                                onChange={(e) => handlePreviewThumb(e.target.files[0])} 
                            />
                        </div>

                        {/* Images */}
                        <div className='flex flex-col gap-2'>
                            <span className='font-semibold'>Images (Chi tiết)</span>
                            <label htmlFor="images" className='w-full min-h-[200px] border-2 border-dashed flex flex-wrap gap-2 p-2 cursor-pointer'>
                                {preview.images?.map((el, idx) => <img key={idx} src={el} className='w-[80px] h-[80px] object-cover' alt="preview" />)}
                                <span className='flex items-center justify-center w-[80px] h-[80px] bg-gray-100 text-xs text-center'>Thêm ảnh</span>
                            </label>
                            <input 
                                type="file" 
                                id="images" 
                                multiple 
                                hidden 
                                onChange={(e) => handlePreviewImages(e.target.files)} 
                            />
                        </div>
                    </div>

                    <button type='submit' className='w-full py-4 bg-sky-700 text-white font-bold rounded-md uppercase mt-5 hover:bg-sky-800 transition-all'>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}

export default memo(UpdateProduct)