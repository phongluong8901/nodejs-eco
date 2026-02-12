// src/components/Modal.js
import React from 'react'
import { useDispatch } from 'react-redux'
import { showModal } from '../store/app/appSlice'

const Modal = ({ children }) => {
    const dispatch = useDispatch()
    return (
        <div 
            onClick={() => dispatch(showModal({ isShowModal: false, modalChidren: null }))} 
            // Đổi absolute thành fixed, thêm z-[999]
            className='fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center'
        >
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal