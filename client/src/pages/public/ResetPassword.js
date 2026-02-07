import React, {useState} from 'react'
import { Button } from '../../components'
import { apiResetPassword } from '../../apis/user'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const {token} = useParams()

    const handleResetPassword = async () => {
        // console.log({password, token});
        const response = await apiResetPassword({password, token})
        // console.log(response)
        if (response.success) {
            toast.success(response.mes, {theme: 'colored'})
        } else toast.info(response.mes, {theme: 'colored'})
    }
    return (
        <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
            <div className='flex flex-col gap-4'>
                <label htmlFor='email'>Enter your emal!</label>
                <input 
                type="text"
                id="password"
                className='w-[800px] pb-2 p-4 border-b outline-none placeholder:text-sm'
                placeholder='Type here'
                value={password}
                onChange={e => setPassword(e.target.value)}
                />

                <div className='flex items-center justify-end mt-4 w-full gap-4'>
                    <Button 
                    name='Submit'
                    handleOnClick={handleResetPassword}
                    />

                </div>
            </div>
        </div>
    )
}

export default ResetPassword