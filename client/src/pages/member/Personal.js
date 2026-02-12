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
        for (let i of Object.entries(data)) formData.append(i[0], i[1])
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
        <div className='w-full relative p-4 flex flex-col gap-6 bg-white min-h-screen'>
            <header className='text-3xl font-semibold py-4 border-b border-blue-300'>
                <span className='tracking-tight'>Personal Information</span>
            </header>

            <form className='w-full md:w-4/5 lg:w-3/5 mx-auto flex flex-col gap-5 py-8 px-6 shadow-2xl border rounded-md bg-gray-50'>
                {/* Names */}
                <div className='flex gap-4'>
                    <InputForm label='Firstname' register={register} errors={errors} id='firstname' validate={{ required: 'Required' }} fullWidth />
                    <InputForm label='Lastname' register={register} errors={errors} id='lastname' validate={{ required: 'Required' }} fullWidth />
                </div>

                {/* Contact */}
                <InputForm label='Email Address' register={register} errors={errors} id='email' validate={{ required: 'Required' }} />
                <InputForm label='Phone Number' register={register} errors={errors} id='mobile' validate={{ required: 'Required' }} />

                {/* Status & Role Section */}
                <div className='grid grid-cols-2 gap-4 mt-2'>
                    <div className='flex flex-col gap-2'>
                        <span className='font-bold text-gray-700 text-sm italic'>Account Status:</span>
                        <span className={clsx(
                            'px-4 py-2 border rounded-md text-sm font-medium',
                            current?.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        )}>
                            {current?.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='font-bold text-gray-700 text-sm italic'>Role:</span>
                        <span className='px-4 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 font-medium'>
                            {+current?.role === 1945 ? 'Admin' : 'User'}
                        </span>
                    </div>
                </div>

                {/* Created Date */}
                <div className='flex flex-col gap-2'>
                    <span className='font-bold text-gray-700 text-sm italic'>Member Since:</span>
                    <span className='px-4 py-2 bg-gray-100 border rounded-md text-sm text-gray-600'>
                        {moment(current?.createdAt).format('DD/MM/YYYY')} ({moment(current?.createdAt).fromNow()})
                    </span>
                </div>

                {/* Avatar Section */}
                <div className='flex flex-col gap-2'>
                    <span className='font-bold text-gray-700'>Profile Picture:</span>
                    <div className='flex items-center gap-4'>
                        <img 
                            src={preview.path || current?.avatar || avatarDefault} 
                            alt="avatar" 
                            className='w-24 h-24 object-cover rounded-full border-2 border-main shadow-md' 
                        />
                        <label htmlFor="avatar" className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-sm'>
                            Change Photo
                            <input type="file" id="avatar" hidden {...register('avatar')} />
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className='w-full flex justify-end mt-6'>
                    {(isDirty || preview.path) ? (
                        <Button handleOnClick={handleSubmit(handleUpdateInfor)} fw>
                            Update Information
                        </Button>
                    ) : (
                        <span className='text-xs text-gray-400 italic'>* No changes detected</span>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Personal