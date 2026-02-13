import React, { useState, useCallback, useEffect } from 'react'
import { InputForm, Select, MarkdownEditor, Loading, Button } from '../../components'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { validate, getBase64 } from '../../ultils/helpers'
import { toast } from 'react-toastify'
import { apiCreateProduct } from '../../apis'
import { IoTrashBinOutline, IoCloudUploadOutline } from 'react-icons/io5'

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

    const changeValue = useCallback((content) => {
        setPayload(prev => ({ ...prev, description: content }))
    }, [])

    // --- PREVIEW LOGIC ---
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

    const handleRemoveImage = (name) => {
        const files = [...watchImages]
        const newFiles = files.filter(el => el.name !== name)
        setValue('images', newFiles)
        setPreview(prev => ({ ...prev, images: prev.images.filter(el => el.name !== name) }))
    }

    // --- SUBMIT FORM ---
    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title

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
        <div className='w-full flex flex-col gap-4 bg-gray-50 min-h-screen relative'>
            {isLoading && (
                <div className='absolute inset-0 bg-white/60 z-[100] flex items-center justify-center backdrop-blur-sm'>
                    <Loading />
                </div>
            )}
            
            <header className='h-[75px] flex justify-between items-center text-3xl font-extrabold px-4 border-b bg-white uppercase tracking-tight'>
                <span>Create New Product</span>
            </header>

            <div className='p-6'>
                <form 
                    onSubmit={handleSubmit(handleCreateProduct)}
                    className='bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-6'
                >
                    <InputForm 
                        label='Product Name' 
                        register={register} 
                        errors={errors} 
                        id='title' 
                        validate={{ required: 'Product name is required' }} 
                        fullWidth 
                        placeholder='Enter product name...'
                    />

                    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <InputForm label='Price (VND)' register={register} errors={errors} id='price' validate={{ required: 'Required' }} fullWidth type='number' placeholder='0' />
                        <InputForm label='Stock Quantity' register={register} errors={errors} id='quantity' validate={{ required: 'Required' }} fullWidth type='number' placeholder='0' />
                        <InputForm label='Default Color' register={register} errors={errors} id='color' validate={{ required: 'Required' }} fullWidth placeholder='e.g. Black, Space Gray' />
                    </div>

                    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Select label='Category' options={categories?.map(el => ({ code: el._id, value: el.title }))} register={register} id='category' validate={{ required: 'Required' }} errors={errors} fullWidth />
                        <Select label='Brand' options={categories?.find(el => el._id === watch('category'))?.brand?.map(item => ({ code: item, value: item }))} register={register} id='brand' errors={errors} fullWidth />
                    </div>

                    <div className='mt-2'>
                        <MarkdownEditor 
                            name='description' 
                            label='Product Description' 
                            changeValue={changeValue} 
                            value={payload.description} 
                            invalidFields={invalidFields} 
                            setInvalidFields={setInvalidFields} 
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-4'>
                        {/* Thumbnail Section */}
                        <div className='flex flex-col gap-4'>
                            <label className='font-bold text-gray-700 uppercase text-xs tracking-widest' htmlFor='thumb'>Main Thumbnail</label>
                            <div className='relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-main transition-colors flex flex-col items-center justify-center bg-gray-50'>
                                <input type="file" id='thumb' {...register('thumb', { required: 'Required' })} className='absolute inset-0 opacity-0 cursor-pointer' />
                                <IoCloudUploadOutline size={32} className='text-gray-400' />
                                <span className='text-sm text-gray-500 mt-2'>Click or drag to upload thumb</span>
                            </div>
                            {errors['thumb'] && <small className='text-xs text-red-500 font-medium'>{errors['thumb']?.message}</small>}
                            {preview.thumb && (
                                <div className='relative w-full aspect-video rounded-xl overflow-hidden border'>
                                    <img src={preview.thumb} alt="thumb" className='w-full h-full object-cover' />
                                </div>
                            )}
                        </div>

                        {/* Images Gallery Section */}
                        <div className='flex flex-col gap-4'>
                            <label className='font-bold text-gray-700 uppercase text-xs tracking-widest' htmlFor='images'>Product Gallery</label>
                            <div className='relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-main transition-colors flex flex-col items-center justify-center bg-gray-50'>
                                <input type="file" id='images' multiple {...register('images', { required: 'Required' })} className='absolute inset-0 opacity-0 cursor-pointer' />
                                <IoCloudUploadOutline size={32} className='text-gray-400' />
                                <span className='text-sm text-gray-500 mt-2'>Upload multiple product images</span>
                            </div>
                            {errors['images'] && <small className='text-xs text-red-500 font-medium'>{errors['images']?.message}</small>}
                            
                            <div className='grid grid-cols-3 gap-3'>
                                {preview.images.map((el) => (
                                    <div 
                                        key={el.name} 
                                        onMouseEnter={() => setHover(el.name)} 
                                        onMouseLeave={() => setHover(null)}
                                        className='relative aspect-square border rounded-lg overflow-hidden bg-white shadow-sm'
                                    >
                                        <img src={el.path} alt="product" className='w-full h-full object-cover' />
                                        {hover === el.name && (
                                            <div 
                                                className='absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer animate-scale-up-center'
                                                onClick={() => handleRemoveImage(el.name)}
                                            >
                                                <IoTrashBinOutline size={20} color='white' />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end mt-6 pt-6 border-t'>
                        <button 
                            type='submit' 
                            className='px-10 py-4 rounded-xl text-white bg-main font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95'
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProducts