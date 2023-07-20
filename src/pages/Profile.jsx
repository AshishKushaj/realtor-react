import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Profile() {

  const auth=getAuth()
  const [formData,setFormData]= useState({
    name: auth.currentUser.displayName,
    email:auth.currentUser.email
  });

  const navigate= useNavigate()
  const {name,email}=formData

  function onLogout(){
    auth.signOut()
    navigate('/')
  }

  return (
    <div>
      <section className='max-w-6xl mx-auto flex flex-col items-center justify-center '>

        <h1 className='text-center text-3xl font-semibold mt-6'>My Profile</h1>

        <div className='w-full md:w-[50%] mt-6 px-3'> 
          <form>

            {/* name */}

            <input type='text' id='name' value={name} disabled className='w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ' />

            {/* email */}

            <input type='email' id='email' value={email} disabled className='w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ' />

            <div className='flex justify-between text-sm sm:text-lg mb-6'>
              <p className='flex item-center'>
                Do you want to change your name?
                <span className=' text-red-600 hover:text-red-900 transition ease-in-out duration-200 ml-1 cursor-pointer '>
                  Edit
                </span>
              </p>

              <p onClick={onLogout} className='text-blue-500 hover:text-blue-800 cursor-pointer transition ease-in-out duration-200 '>Sign Out</p>
              
            </div>

          </form>
        </div>

      </section>
    </div>
  )
}
