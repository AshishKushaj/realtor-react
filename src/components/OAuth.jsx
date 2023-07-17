import React from 'react'

import {FcGoogle} from 'react-icons/fc'

export default function OAuth() {
  return (
    <button className=' flex justify-center w-full
        items-center bg-red-500 px-7 py-3 
        font-semibold text-white text-sm hover:bg-red-700
        active:bg-red-900 hover:shadow-lg active:shadow-lg

        transition duration-150 ease-in-out rounded
        '>

        <FcGoogle className='text-2xl bg-white rounded-full
        mr-2'/>
        CONTINUE WITH GOOGLE
    </button>
  )
}
