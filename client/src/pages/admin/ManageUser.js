import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUserByAdmin, apiDeleteUserByAdmin } from '../../apis/user'
import moment from 'moment'
import { InputField, Pagination, InputForm, Select } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clsx from 'clsx'

const roles = [
    { code: '1945', value: 'Admin' },
    { code: '1979', value: 'User' }
]

const blockStatus = [
    { code: true, value: 'Blocked' },
    { code: false, value: 'Active' }
]

const ManageUser = () => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm()
    const [users, setUsers] = useState(null)
    const [queries, setQueries] = useState({ q: "" })
    const [counts, setCounts] = useState(0)
    const [params] = useSearchParams()
    const [editElm, setEditElm] = useState(null)
    const [update, setUpdate] = useState(false)

    // LOG 1: Theo dõi toàn bộ lỗi của form (Email, Phone, Firstname...)
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log('--- FORM ERRORS ---', errors)
        }
    }, [errors])

    const queriesDebounce = useDebounce(queries.q, 800)

    const fetchUsers = async (searchParams) => {
        const response = await apiGetUsers(searchParams)
        if (response.success) {
            setUsers(response.users)
            setCounts(response.counts)
        }
    }

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])

    useEffect(() => {
        if (editElm) {
            // LOG 2: Xem dữ liệu gốc từ Database trước khi đưa vào form
            console.log('--- DỮ LIỆU USER ĐƯỢC CHỌN ---', editElm)
            reset({
                email: editElm.email,
                firstname: editElm.firstname,
                lastname: editElm.lastname,
                role: editElm.role,
                mobile: editElm.mobile, // Kiểm tra xem ở đây có phải là undefined hoặc null không
                isBlocked: editElm.isBlocked
            })
        }
    }, [editElm, reset])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        if (!searchParams.limit) searchParams.limit = 10
        if (queriesDebounce) searchParams.q = queriesDebounce
        fetchUsers(searchParams)
    }, [queriesDebounce, params, update])

    const handleUpdate = async (data) => {
        // LOG 3: Xem dữ liệu bạn chuẩn bị gửi lên Server
        console.log('--- DỮ LIỆU SẼ UPDATE ---', data)
        const response = await apiUpdateUserByAdmin(data, editElm._id)
        if (response.success) {
            setEditElm(null)
            render()
            toast.success(response.mes)
        } else toast.error(response.mes)
    }

    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Vẫn xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Gọi API xóa
                const response = await apiDeleteUserByAdmin(uid)
                
                if (response.success) {
                    render() // Hàm để load lại danh sách user
                    toast.success(response.mes)
                } else {
                    toast.error(response.mes)
                }
            }
        })
    }

    const pageSize = +params.get('limit') || 10
    const currentPage = +params.get('page') || 1

    return (
        <div className='w-full bg-white'>
            <header className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b uppercase'>
                <span>Manage users</span>
            </header>
            <div className='p-4'>
                <div className='flex justify-end py-4'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[400px]'
                        placeholder='Search by email or name...'
                    />
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className='flex justify-start mb-4'>
                        {editElm && <button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700'>Update Changes</button>}
                    </div>
                    
                    <table className='table-auto mb-6 w-full text-left border-collapse'>
                        <thead className='font-bold bg-sky-700 text-[13px] text-white'>
                            <tr className='border border-gray-500'>
                                <th className='px-4 py-3 text-center'>#</th>
                                <th className='px-4 py-3'>Email</th>
                                <th className='px-4 py-3'>Firstname</th>
                                <th className='px-4 py-3'>Lastname</th>
                                <th className='px-4 py-3'>Role</th>
                                <th className='px-4 py-3'>Phone</th>
                                <th className='px-4 py-3'>Status</th>
                                <th className='px-4 py-3'>Created At</th>
                                <th className='px-4 py-3 text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((el, idx) => (
                                <tr key={el._id} className={clsx('border border-gray-300', editElm?._id === el._id && 'bg-gray-100')}>
                                    <td className='py-3 px-4 text-center'>{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className='py-3 px-4'>
                                        {editElm?._id === el._id 
                                        ? <InputForm register={register} fullWidth errors={errors} id={'email'} validate={{required: 'Require', pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email"}}} /> 
                                        : <span>{el.email}</span>}
                                    </td>
                                    <td className='py-3 px-4'>
                                        {editElm?._id === el._id 
                                        ? <InputForm register={register} fullWidth errors={errors} id={'firstname'} validate={{required: 'Require'}} /> 
                                        : <span>{el.firstname}</span>}
                                    </td>
                                    <td className='py-3 px-4'>
                                        {editElm?._id === el._id 
                                        ? <InputForm register={register} fullWidth errors={errors} id={'lastname'} validate={{required: 'Require'}} /> 
                                        : <span>{el.lastname}</span>}
                                    </td>
                                    <td className='py-3 px-4'>
                                        {editElm?._id === el._id 
                                        ? <Select register={register} fullWidth errors={errors} id={'role'} options={roles} validate={{required: 'Require'}} /> 
                                        : <span>{roles.find(r => +r.code === +el.role)?.value}</span>}
                                    </td>
                                    <td className='py-3 px-4'>
                                        {editElm?._id === el._id 
                                        ? <InputForm 
                                            register={register} 
                                            fullWidth 
                                            errors={errors} 
                                            id={'mobile'} 
                                            validate={{
                                                required: 'Require', 
                                                pattern: {
                                                    // Thử nới lỏng: Cho phép có số 0 ở đầu hoặc không, từ 9-11 chữ số
                                                    value: /^[0-9]{9,11}$/, 
                                                    message: "Invalid phone"
                                                }
                                            }} 
                                          /> 
                                        : <span>{el.mobile}</span>}
                                    </td>
                                    <td className='py-3 px-4'>
                                        {editElm?._id === el._id 
                                        ? <Select register={register} fullWidth errors={errors} id={'isBlocked'} options={blockStatus} validate={{required: 'Require'}} /> 
                                        : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                                    </td>
                                    <td className='py-3 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='py-3 px-4 text-center'>
                                        {editElm?._id === el._id 
                                        ? <span onClick={() => setEditElm(null)} className='px-2 text-orange-600 cursor-pointer'>Back</span>
                                        : <span onClick={() => setEditElm(el)} className='px-2 text-blue-600 cursor-pointer'>Edit</span>}
                                        <span onClick={() => handleDeleteUser(el._id)} className='px-2 text-red-600 cursor-pointer'>Delete</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
                <div className='w-full flex justify-end mt-4'>
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    )
}

export default ManageUser