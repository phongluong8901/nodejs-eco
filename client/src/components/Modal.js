// src/components/Modal.js
import React from 'react'
import { useDispatch } from 'react-redux'
import { showModal } from '../store/app/appSlice'

const Modal = ({ children }) => {
    const dispatch = useDispatch()
    return (
        <div 
            // Sửa lỗi typo: modalChildren (có chữ l)
            onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))} 
            className='fixed inset-0 bg-overlay z-[1000] flex items-center justify-center'
        >
            <div onClick={e => e.stopPropagation()} className='bg-white'>
                {children}
            </div>
        </div>
    )
}

export default Modal