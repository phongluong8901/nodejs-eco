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
            reset({
                email: editElm.email,
                firstname: editElm.firstname,
                lastname: editElm.lastname,
                role: editElm.role,
                mobile: editElm.mobile,
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
        const response = await apiUpdateUserByAdmin(data, editElm._id)
        if (response.success) {
            setEditElm(null)
            render()
            toast.success(response.mes)
        } else toast.error(response.mes)
    }

    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ee3131',
            cancelButtonColor: '#272727',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUserByAdmin(uid)
                if (response.success) {
                    render()
                    toast.success(response.mes)
                } else toast.error(response.mes)
            }
        })
    }

    const pageSize = +params.get('limit') || 10
    const currentPage = +params.get('page') || 1

    return (
        /* Thêm relative ở đây để cố định phạm vi giao diện không tràn qua Sidebar */
        <div className='w-full flex flex-col gap-4 bg-gray-50 min-h-screen relative'>
            <header className='h-[75px] sticky top-0 z-20 flex justify-between items-center text-3xl font-extrabold px-4 border-b bg-white uppercase tracking-tight'>
                <span>Manage Users</span>
            </header>

            <div className='p-4 flex flex-col gap-4'>
                <div className='flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                    <div className='flex items-center gap-4'>
                         {editElm && (
                            <button 
                                onClick={handleSubmit(handleUpdate)}
                                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all'
                            >
                                Save Changes
                            </button>
                        )}
                        {!editElm && <span className='text-sm text-gray-500 italic'>Select "Edit" to modify user information</span>}
                    </div>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[400px]'
                        placeholder='Search by email or name...'
                    />
                </div>

                <div className='overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white'>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <table className='table-auto w-full text-left border-collapse'>
                            <thead className='font-bold bg-gray-900 text-[12px] text-white uppercase tracking-wider'>
                                <tr>
                                    <th className='px-6 py-4 text-center'>#</th>
                                    <th className='px-6 py-4'>Email</th>
                                    <th className='px-6 py-4'>Firstname</th>
                                    <th className='px-6 py-4'>Lastname</th>
                                    <th className='px-6 py-4'>Role</th>
                                    <th className='px-6 py-4'>Phone</th>
                                    <th className='px-6 py-4 text-center'>Status</th>
                                    <th className='px-6 py-4 text-center'>Created At</th>
                                    <th className='px-6 py-4 text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm text-gray-700'>
                                {users?.map((el, idx) => (
                                    <tr key={el._id} className={clsx('border-b hover:bg-gray-50 transition-all', editElm?._id === el._id && 'bg-blue-50/50')}>
                                        <td className='py-4 px-6 text-center font-medium'>
                                            {(currentPage - 1) * pageSize + idx + 1}
                                        </td>
                                        <td className='py-4 px-6'>
                                            {editElm?._id === el._id 
                                            ? <InputForm register={register} fullWidth errors={errors} id={'email'} validate={{required: 'Require', pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email"}}} /> 
                                            : <span className='font-semibold text-gray-800'>{el.email}</span>}
                                        </td>
                                        <td className='py-4 px-6 font-medium'>
                                            {editElm?._id === el._id 
                                            ? <InputForm register={register} fullWidth errors={errors} id={'firstname'} validate={{required: 'Require'}} /> 
                                            : <span>{el.firstname}</span>}
                                        </td>
                                        <td className='py-4 px-6 font-medium'>
                                            {editElm?._id === el._id 
                                            ? <InputForm register={register} fullWidth errors={errors} id={'lastname'} validate={{required: 'Require'}} /> 
                                            : <span>{el.lastname}</span>}
                                        </td>
                                        <td className='py-4 px-6'>
                                            {editElm?._id === el._id 
                                            ? <Select register={register} fullWidth errors={errors} id={'role'} options={roles} validate={{required: 'Require'}} /> 
                                            : <span className='bg-gray-100 px-2 py-1 rounded text-xs font-semibold uppercase'>{roles.find(r => +r.code === +el.role)?.value}</span>}
                                        </td>
                                        <td className='py-4 px-6'>
                                            {editElm?._id === el._id 
                                            ? <InputForm register={register} fullWidth errors={errors} id={'mobile'} validate={{required: 'Require', pattern: {value: /^[0-9]{9,11}$/, message: "Invalid phone"}}} /> 
                                            : <span>{el.mobile}</span>}
                                        </td>
                                        <td className='py-4 px-6 text-center'>
                                            {editElm?._id === el._id 
                                            ? <Select register={register} fullWidth errors={errors} id={'isBlocked'} options={blockStatus} validate={{required: 'Require'}} /> 
                                            : <span className={clsx('px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest', el.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600')}>
                                                {el.isBlocked ? 'Blocked' : 'Active'}
                                              </span>}
                                        </td>
                                        <td className='py-4 px-6 text-center text-gray-400 italic text-xs'>
                                            {moment(el.createdAt).format('MMM DD, YYYY')}
                                        </td>
                                        <td className='py-4 px-6 text-center'>
                                            <div className='flex justify-center gap-3'>
                                                {editElm?._id === el._id 
                                                ? <button type="button" onClick={() => setEditElm(null)} className='p-2 px-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm font-semibold text-xs uppercase'>Cancel</button>
                                                : <button type="button" onClick={() => setEditElm(el)} className='p-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm font-semibold text-xs uppercase'>Edit</button>}
                                                
                                                <button type="button" onClick={() => handleDeleteUser(el._id)} className='p-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm font-semibold text-xs uppercase'>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </form>
                </div>

                <div className='w-full flex justify-end mt-4'>
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    )
}

export default ManageUser