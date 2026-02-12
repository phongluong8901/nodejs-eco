import React, { memo, useRef, useEffect, useState } from 'react'
import logo from '../../assets/logo.png' // Thay đường dẫn logo của bạn
import { voteOptions } from '../../ultils/constant' // Mảng [{id:1, text:'Terrible'}, ...]
import { AiFillStar } from 'react-icons/ai'
import { Button } from '..'

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
    const modalRef = useRef()
    const [chosenScore, setChosenScore] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => {
        modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [])

    return (
        <div 
            ref={modalRef} 
            className='bg-white w-[700px] p-4 flex flex-col gap-4 items-center justify-center'
        >
            <img src={logo} alt="logo" className='w-[300px] my-8 object-contain' />
            <h2 className='text-center text-medium text-lg'>{`Voting product: ${nameProduct}`}</h2>
            
            <textarea 
                className='form-textarea w-full border rounded-md p-2 placeholder:italic placeholder:text-xs outline-none'
                placeholder='How do you feel about this product? Let us know!'
                value={comment}
                onChange={e => setComment(e.target.value)}
            ></textarea>

            <div className='w-full flex flex-col gap-4'>
                <p className='text-sm text-gray-500'>How many stars do you give this product?</p>
                <div className='flex justify-between items-center gap-4 italic text-xs'>
                    {voteOptions.map(el => (
                        <div 
                            key={el.id} 
                            className='w-[100px] bg-gray-100 rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 transition-all'
                            onClick={() => setChosenScore(el.id)}
                        >
                            <AiFillStar color={chosenScore >= el.id ? 'orange' : 'gray'} size={20} />
                            <span>{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button 
                handleOnClick={() => handleSubmitVoteOption({ comment, score: chosenScore })}
                fw
            >
                Submit
            </Button>
        </div>
    )
}

export default memo(VoteOption)