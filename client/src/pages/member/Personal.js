import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, InputForm } from '../../components'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { apiUpdateCurrent } from '../../apis/user'
import { getCurrent } from '../../store/user/asyncActions'
import Swal from 'sweetalert2'
import clsx from 'clsx'
import avatarDefault from '../../assets/Avatar.jpg'

const Personal = () => {
    const { register, formState: { errors, isDirty }, handleSubmit, reset, watch } = useForm()
    const dispatch = useDispatch()
    const { current } = useSelector(state => state.user)
    
    const [preview, setPreview] = useState({
        name: '',
        path: ''
    })

    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
        })
    }, [current, reset])

    const avatarFile = watch('avatar')

    useEffect(() => {
        if (avatarFile && avatarFile.length > 0 && typeof avatarFile !== 'string') {
            const previewUrl = URL.createObjectURL(avatarFile[0])
            setPreview({ name: 'avatar', path: previewUrl })
            return () => URL.revokeObjectURL(previewUrl)
        }
    }, [avatarFile])

    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        for (let i of Object.entries(data)) {
            if (i[0] !== 'avatar') formData.append(i[0], i[1])
        }
        if (data.avatar && data.avatar.length > 0 && typeof data.avatar !== 'string') {
            formData.append('avatar', data.avatar[0])
        }

        try {
            const response = await apiUpdateCurrent(formData);
            if (response.success) {
                Swal.fire('Success!', 'Profile updated successfully.', 'success');
                dispatch(getCurrent());
                setPreview({ name: '', path: '' });
            } else {
                Swal.fire('Failed!', response.msg || 'Something went wrong', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Could not connect to server', 'error');
        }
    }

    return (
        <div className='w-full flex flex-col min-h-screen bg-gray-50 relative'>
            <header className='h-[75px] flex justify-between items-center text-3xl font-extrabold px-4 border-b bg-white uppercase tracking-tight'>
                <span>Personal Information</span>
            </header>

            <div className='p-8 flex flex-col items-center justify-center'>
                <form 
                    onSubmit={handleSubmit(handleUpdateInfor)}
                    className='w-full max-w-[700px] flex flex-col gap-6 p-8 bg-white shadow-md rounded-xl border border-gray-100'
                >
                    {/* Avatar Section - Tối ưu lại cho đẹp */}
                    <div className='flex flex-col items-center gap-4 mb-4'>
                        <div className='relative'>
                            <img 
                                src={preview.path || current?.avatar || avatarDefault} 
                                alt="avatar" 
                                className='w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg' 
                            />
                            <label 
                                htmlFor="avatar" 
                                className='absolute bottom-0 right-0 p-2 bg-main text-white rounded-full cursor-pointer hover:scale-110 transition shadow-md'
                                title="Change avatar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                                <input type="file" id="avatar" hidden {...register('avatar')} />
                            </label>
                        </div>
                        <div className='text-center'>
                            <h2 className='text-xl font-bold'>{`${current?.lastname} ${current?.firstname}`}</h2>
                            <p className='text-sm text-gray-500 italic'>Member Since: {moment(current?.createdAt).format('MMMM YYYY')}</p>
                        </div>
                    </div>

                    <hr className='border-gray-100' />

                    {/* Names */}
                    <div className='grid grid-cols-2 gap-6'>
                        <InputForm label='Firstname' register={register} errors={errors} id='firstname' validate={{ required: 'Required' }} fullWidth />
                        <InputForm label='Lastname' register={register} errors={errors} id='lastname' validate={{ required: 'Required' }} fullWidth />
                    </div>

                    {/* Contact */}
                    <InputForm label='Email Address' register={register} errors={errors} id='email' validate={{ required: 'Required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} fullWidth />
                    <InputForm label='Phone Number' register={register} errors={errors} id='mobile' validate={{ required: 'Required', pattern: { value: /^[0-9]{9,11}$/, message: "Invalid phone number" } }} fullWidth />

                    {/* Status & Role Section - Styling lại cho gọn */}
                    <div className='flex items-center gap-6 py-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm font-semibold text-gray-600'>Status:</span>
                            <span className={clsx(
                                'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                                current?.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                            )}>
                                {current?.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm font-semibold text-gray-600'>Role:</span>
                            <span className='px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest'>
                                {+current?.role === 1945 ? 'Admin' : 'User'}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end mt-4 pt-4 border-t border-gray-100'>
                        {(isDirty || preview.path) ? (
                            <button 
                                type='submit'
                                className='px-8 py-3 bg-main text-white font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition shadow-lg'
                            >
                                Update Profile
                            </button>
                        ) : (
                            <span className='text-sm text-gray-400 italic'>* No changes detected</span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Personal