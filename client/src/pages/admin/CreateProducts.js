import React, { useState, useCallback, useEffect } from 'react'
import { InputForm, Select, MarkdownEditor, Loading } from '../../components'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { validate, getBase64 } from '../../ultils/helpers'
import { toast } from 'react-toastify'
import { apiCreateProduct } from '../../apis'
import { IoTrashBinOutline } from 'react-icons/io5'

const CreateProducts = () => {
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch, setValue } = useForm()
    
    const [payload, setPayload] = useState({ description: '' })
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    const [hover, setHover] = useState(null)
    const [invalidFields, setInvalidFields] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Đồng bộ nội dung từ MarkdownEditor vào state payload
    const changeValue = useCallback((content) => {
        setPayload(prev => ({ ...prev, description: content }))
    }, [])

    // --- XỬ LÝ PREVIEW ẢNH ---
    const watchThumb = watch('thumb')
    const watchImages = watch('images')

    useEffect(() => {
        const handlePreviewThumb = async () => {
            if (watchThumb && watchThumb.length > 0) {
                const base64 = await getBase64(watchThumb[0])
                setPreview(prev => ({ ...prev, thumb: base64 }))
            }
        }
        handlePreviewThumb()
    }, [watchThumb])

    useEffect(() => {
        const handlePreviewImages = async () => {
            if (watchImages && watchImages.length > 0) {
                const previews = []
                for (let file of watchImages) {
                    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                        toast.warning('File type not supported!')
                        return
                    }
                    const base64 = await getBase64(file)
                    previews.push({ name: file.name, path: base64 })
                }
                setPreview(prev => ({ ...prev, images: previews }))
            }
        }
        handlePreviewImages()
    }, [watchImages])

    // Hàm xóa ảnh preview và đồng bộ lại FileList
    const handleRemoveImage = (name) => {
        const files = [...watchImages]
        const newFiles = files.filter(el => el.name !== name)
        setValue('images', newFiles) // Cập nhật lại giá trị trong hook-form
        setPreview(prev => ({ ...prev, images: prev.images.filter(el => el.name !== name) }))
    }

    // --- SUBMIT FORM ---
    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title

            // Làm sạch description: bỏ thẻ HTML và &nbsp;
            const cleanDescription = payload.description
                ?.replace(/<[^>]*>/g, '')
                ?.replace(/&nbsp;/g, ' ')
                ?.trim();

            const finalPayload = { 
                ...data, 
                ...payload, 
                description: cleanDescription 
            }

            const formData = new FormData()
            for (let [key, value] of Object.entries(finalPayload)) {
                if (key === 'thumb') {
                    if (value && value.length > 0) formData.append('thumb', value[0])
                } else if (key === 'images') {
                    if (value && value.length > 0) {
                        for (let image of value) formData.append('images', image)
                    }
                } else {
                    formData.append(key, value)
                }
            }

            setIsLoading(true)
            const response = await apiCreateProduct(formData)
            setIsLoading(false)

            if (response.success) {
                toast.success(response.mes || 'Product created successfully!')
                reset()
                setPayload({ description: '' })
                setPreview({ thumb: null, images: [] })
            } else {
                toast.error(response.mes || 'Something went wrong!')
            }
        }
    }

    return (
        <div className='w-full relative'>
            {isLoading && <div className='absolute inset-0 bg-white opacity-50 z-50 flex items-center justify-center'><Loading /></div>}
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b uppercase'>
                <span>Create product</span>
            </h1>

            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputForm label='Name product' register={register} errors={errors} id='title' validate={{ required: 'Required' }} fullWidth />
                    <div className='w-full grid grid-cols-3 gap-4 my-6'>
                        <InputForm label='Price' register={register} errors={errors} id='price' validate={{ required: 'Required' }} fullWidth type='number' />
                        <InputForm label='Quantity' register={register} errors={errors} id='quantity' validate={{ required: 'Required' }} fullWidth type='number' />
                        <InputForm label='Color' register={register} errors={errors} id='color' validate={{ required: 'Required' }} fullWidth />
                    </div>

                    <div className='w-full grid grid-cols-2 gap-4 my-6'>
                        <Select label='Category' options={categories?.map(el => ({ code: el._id, value: el.title }))} register={register} id='category' validate={{ required: 'Required' }} errors={errors} fullWidth />
                        <Select label='Brand' options={categories?.find(el => el._id === watch('category'))?.brand?.map(item => ({ code: item, value: item }))} register={register} id='brand' errors={errors} fullWidth />
                    </div>

                    <MarkdownEditor 
                        name='description' 
                        label='Description' 
                        changeValue={changeValue} 
                        value={payload.description} 
                        invalidFields={invalidFields} 
                        setInvalidFields={setInvalidFields} 
                    />

                    {/* Thumbnail Upload */}
                    <div className='flex flex-col gap-2 mt-8 mb-4'>
                        <label className='font-semibold' htmlFor='thumb'>Upload Thumb</label>
                        <input type="file" id='thumb' {...register('thumb', { required: 'Required' })} />
                        {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
                    </div>
                    {preview.thumb && (
                        <div className='my-4'>
                            <img src={preview.thumb} alt="thumb" className='w-[200px] object-contain border' />
                        </div>
                    )}

                    {/* Images Upload */}
                    <div className='flex flex-col gap-2 mb-6'>
                        <label className='font-semibold' htmlFor='images'>Upload Images Product</label>
                        <input type="file" id='images' multiple {...register('images', { required: 'Required' })} />
                        {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
                    </div>
                    {preview.images.length > 0 && (
                        <div className='my-4 flex flex-wrap gap-4'>
                            {preview.images.map((el) => (
                                <div 
                                    key={el.name} 
                                    onMouseEnter={() => setHover(el.name)} 
                                    onMouseLeave={() => setHover(null)}
                                    className='relative w-[150px] h-[150px] border rounded-md overflow-hidden'
                                >
                                    <img src={el.path} alt="product" className='w-full h-full object-cover' />
                                    {hover === el.name && (
                                        <div 
                                            className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer animate-scale-up-center'
                                            onClick={() => handleRemoveImage(el.name)}
                                        >
                                            <IoTrashBinOutline size={24} color='white' />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button type='submit' className='mt-8 px-8 py-3 rounded-md text-white bg-main font-semibold'>
                        Create New Product
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateProducts