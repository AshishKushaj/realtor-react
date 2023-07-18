import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';



export default function ForgotPassword() {

  const[formData, setFormData]= useState({
    email:'',
  })


  const f='w-full px-4 py-2 text-xl rounded text-gray-700 bg-white transition ease-in-out border-gray-300 mb-6';

  const {email}=formData;

  function onChange(e){
    setFormData({
      ...formData,[e.target.id]:e.target.value
    })
  }

  async function onSubmit(e){
    e.preventDefault()

    try {
        const auth= getAuth()
        await sendPasswordResetEmail(auth,email)
        toast.success("Email was sent!!")
    } catch (error) {
      toast.error("Could not find email!")
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>

      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>

        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6 ' >
          <img  className='w-full rounded-2xl '
             src='https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' alt="img" />
           
        </div>

        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 ' >
            <form onSubmit={onSubmit} > 

              <input 
                type='email'  
                id='email' 
                value={email}
                onChange={onChange}
                placeholder='Email address' 
                className= {`${f}`}
              />

              

              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>

                <p className='mb-6'>Don't have an account? 
                  <Link to='/sign-up' 
                    className='text-red-500 ml-2 hover:text-red-700'
                    >Register</Link>
                </p>

                <Link to='/sign-in'
                  className='text-blue-500 hover:text-blue-800 mb-6'
                >Sign In</Link>
              </div>

              <button 
              
              type="submit"
              className='bg-blue-500 w-full rounded px-7 py-3 text-white  uppercase font-medium text-sm shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-900 transition duration-200 ease-in-out'        

            > SEND RESET MAIL</button>  

            <div className='flex my-5 items-center
              before:border-t before:border-gray-400
              before:flex-1
              after:border-t after:border-gray-400
              after:flex-1
            '>
                <p className='font-semibold text-center mx-4' >OR</p>
            </div> 

            <OAuth/>  

          </form>  

               

        </div>
      </div>

    </section>
  )
}
