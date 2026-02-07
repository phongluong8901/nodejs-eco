import React, { useState, useCallback } from 'react'
import { InputField, Button } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import { login } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../ultils/helpers' 


const Login = () => {   
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [invalidFields, setInvalidFields] = useState([])

    const [isRegister, setIsRegister] = useState(false)
    const [payload, setPayload] = useState({
        email: '',
        password: '', 
        firstname: '',
        lastname: '',
        mobile:'',
    })

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '', 
            firstname: '',
            lastname: '',
            mobile:'',
        })
    }

    const [email, setEmail] = useState('')
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({email})
        // console.log(response)
        if (response.success) {
            toast.success(response.mes)
        } else {
            toast.info(response.mes, {theme: 'colored'})
        }
    }
    //SUBMIT
    // console.log(validate(payload))

    const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;

    // QUAN TRỌNG: Reset lỗi cũ và truyền đủ 2 tham số
    setInvalidFields([]);
    const invalids = isRegister 
        ? validate(payload, setInvalidFields) 
        : validate(data, setInvalidFields);

    // Chỉ gọi API khi không có lỗi (invalids === 0)
    if (invalids === 0) {
        if (isRegister) {
            const response = await apiRegister(payload);
            if (response.success) {
                Swal.fire("Congratulations", response?.mes, 'success').then(() => {
                    setIsRegister(false);
                    resetPayload();
                });
            } else {
                Swal.fire("Oops!", response?.mes, 'error');
            }
        } else {
            const rs = await apiLogin(data);
            if (rs.success) {
                dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }));
                navigate(`/${path.HOME}`);
            } else {
                Swal.fire("Oops!", rs?.mes, 'error');
            }
        }
    }
}, [payload, isRegister, dispatch, navigate]);

    return (
        <div className='w-screen h-screen relative'>
            {isForgotPassword && <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
                <div className='flex flex-col gap-4'>
                    <label htmlFor='email'>Enter your emal!</label>
                    <input 
                    type="text"
                    id="email"
                    className='w-[800px] pb-2 p-4 border-b outline-none placeholder:text-sm'
                    placeholder='Example@gmail.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />

                    <div className='flex items-center justify-end mt-4 w-full gap-4'>
                        <Button 
                        name='Submit'
                        handleOnClick={handleForgotPassword}
                        />
                        <Button 
                        name='Back'
                        handleOnClick={() => setIsForgotPassword(false)}
                        style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
                        />
                    </div>
                </div>
                
            </div>}
            <img 
                src="https://www.shutterstock.com/image-vector/shopping-trolley-cart-like-shop-600nw-2598963413.jpg"
                alt="background"
                className='w-full h-full object-cover'
            />

            <div className='absolute inset-0 flex items-center justify-center'>
                <div className='p-8 bg-white rounded-md min-w-[500px] flex flex-col gap-4 shadow-lg'>
                    <h1 className='text-[28px] font-semibold text-main mb-4'>{isRegister ? 'Register' : 'Login'}</h1>
                    
                    {/* Cần truyền đúng value tương ứng với nameKey */}
                    {isRegister && 
                    <div className='flex gap-2'>
                        <InputField 
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            // invalidFields={invalidFields}
                            // setInvalidFields={setInvalidFields}
                        />
                        <InputField s
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            // invalidFields={invalidFields}
                            // setInvalidFields={setInvalidFields}
                        />
                    </div>
                    }
                    <InputField 
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    {isRegister && <InputField 
                            value={payload.mobile}
                            setValue={setPayload}
                            nameKey='mobile'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />}
                    <InputField 
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                    />

                    <Button 
                    name={isRegister ? 'Register' : 'Login'}
                    handleOnClick={handleSubmit}
                    fw 
                    />

                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span 
                        onClick={() => setIsForgotPassword(true)}
                        className='text-blue-500 hover:underline cursor-pointer'>Forgot your account?</span>}
                        
                        {!isRegister && <span 
                        onClick={() => setIsRegister(true)}
                        className='text-blue-500 hover:underline cursor-pointer'>Create account!</span>}

                        {isRegister && <span 
                        onClick={() => setIsRegister(false)}
                        className='text-blue-500 hover:underline cursor-pointer w-full text-center'>Go to Login</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login