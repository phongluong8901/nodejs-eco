import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputForm from './InputForm' 
import Button from '../buttons/Button' 
import { getBase64 } from '../../ultils/helpers'
import { toast } from 'react-toastify'
import { apiAddVariant } from '../../apis'

const CustomizeVarriants = ({ customizeVarriant, setCustomizeVarriant, render }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const [preview, setPreview] = useState({ thumb: null, images: [] })

    useEffect(() => {
        reset({
            title: customizeVarriant?.title,
            color: customizeVarriant?.color,
            price: customizeVarriant?.price,
        })
    }, [customizeVarriant])

    const handlePreviewThumb = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file)
            setPreview(prev => ({ ...prev, thumb: base64Thumb }))
            setValue('thumb', file)
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
        setValue('images', files)
    }

    // Hàm xử lý logic gửi dữ liệu
    const handleAddVariant = async (data) => {
        if (data.color.toLowerCase() === customizeVarriant.color.toLowerCase()) {
            return toast.warning('Biến thể màu sắc phải khác màu gốc!')
        }

        const formData = new FormData()
        for (let [key, value] of Object.entries(data)) {
            if (key !== 'thumb' && key !== 'images') {
                formData.append(key, value)
            }
        }
        if (data.thumb) formData.append('thumb', data.thumb)
        if (data.images) {
            for (let image of data.images) formData.append('images', image)
        }

        const response = await apiAddVariant(formData, customizeVarriant._id)
        if (response.success) {
            toast.success(response.mes)
            reset()
            setPreview({ thumb: null, images: [] })
            setCustomizeVarriant(null)
            render()
        } else {
            toast.error(response.mes)
        }
    }

    return (
        <div className='w-full flex flex-col animate-slide-right bg-white min-h-screen'>
            <div className='h-[75px] flex justify-between items-center text-2xl font-bold px-6 border-b bg-gray-50 uppercase'>
                <span>Add Variant: <span className='text-blue-600'>{customizeVarriant?.title}</span></span>
                <button 
                    className='px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600'
                    onClick={() => setCustomizeVarriant(null)}
                >
                    Cancel
                </button>
            </div>

            {/* Bỏ onSubmit ở thẻ form vì Button type=button không kích hoạt nó */}
            <form className='p-6 flex flex-col gap-6 max-w-[1000px] mx-auto w-full'>
                <div className='grid grid-cols-2 gap-4'>
                    <InputForm label='Original Name' register={register} errors={errors} id='title' fullWidth validate={{ required: 'Required' }} />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <InputForm label='Variant Color' register={register} errors={errors} id='color' validate={{ required: 'Required' }} placeholder='Example: White, Silver, Gold...' />
                    <InputForm label='Variant Price (VND)' register={register} errors={errors} id='price' type='number' validate={{ required: 'Required' }} />
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='font-semibold'>Variant Thumbnail</span>
                    <label htmlFor="thumb" className='w-[150px] h-[150px] border-2 border-dashed flex items-center justify-center cursor-pointer'>
                        {preview.thumb ? <img src={preview.thumb} className='w-full h-full object-cover' alt="thumb" /> : <span>Chọn ảnh</span>}
                    </label>
                    <input type="file" id="thumb" hidden onChange={e => handlePreviewThumb(e.target.files[0])} />
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='font-semibold'>Variant Images</span>
                    <label htmlFor="images" className='w-full min-h-[120px] border-2 border-dashed flex flex-wrap gap-2 p-2 cursor-pointer'>
                        {preview.images?.map((el, idx) => <img key={idx} src={el} className='w-[80px] h-[80px] object-cover' alt="preview" />)}
                        <span className='flex items-center justify-center w-[80px] h-[80px] bg-gray-100 text-xs text-center'>Thêm ảnh</span>
                    </label>
                    <input type="file" id="images" multiple hidden onChange={e => handlePreviewImages(e.target.files)} />
                </div>

                <div className='mt-6'>
                    {/* GIẢI PHÁP: Gọi trực tiếp handleSubmit qua handleOnClick */}
                    <Button 
                        handleOnClick={handleSubmit(handleAddVariant)} 
                        fw
                    >
                        Create Variant
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default memo(CustomizeVarriants)