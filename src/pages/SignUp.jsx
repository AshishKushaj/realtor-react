import React, { useState } from 'react'
import { PiEyeClosedBold ,PiEyeBold} from "react-icons/pi";
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword ,updateProfile } from "firebase/auth";
import {db} from '../firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



export default function SignUn() {

  const[formData, setFormData]= useState({
    name:'',
    email:'',
    password:''
  })

  const [showPass, setShowPass]=useState(false);
  const navigate= useNavigate();

  const f='w-full px-4 py-2 text-xl rounded text-gray-700 bg-white transition ease-in-out border-gray-300 mb-6';

  const {name,email,password}=formData;
  function onChange(e){
    setFormData({
      ...formData,[e.target.id]:e.target.value
    })
  }

  async function onSubmit(e){
    e.preventDefault()

    try {
      const auth= getAuth()
      const userCredential= await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      updateProfile(auth.currentUser,{
        displayName:name
      })

      const user= userCredential.user
      
      const formDataCopy = {...formData}
      delete formDataCopy.password
      
      formDataCopy.timeStamp= serverTimestamp();

      await setDoc(doc( db , "users", user.uid), formDataCopy);

      toast.success("Created new account!!")
      navigate("/");

    } catch (error) {
      toast.error("Something is wrong")
    }
  }


  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>

      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>

        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6 ' >
          <img  className='w-full rounded-2xl '
             src='https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' alt="img" />
           
        </div>

        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 ' >

            <form onSubmit={onSubmit} > 

            <input 
                type='text'  
                id='name' 
                value={name}
                onChange={onChange}
                placeholder='Full Name' 
                className= {`${f}`}
              />

              <input 
                type='email'  
                id='email' 
                value={email}
                onChange={onChange}
                placeholder='Email address' 
                className= {`${f}`}
              />

              <div className='relative'>
                <input 
                  type={showPass?"text":"password"} 
                  id='password' 
                  value={password}
                  onChange={onChange}
                  placeholder='Password' 
                  className= {`${f}`}
                />

                {showPass? 
                  <PiEyeClosedBold
                    className='absolute right-3 top-4 text-xl cursor-pointer'
                    onClick={()=> setShowPass(
                      prevState=>!prevState
                    )}
                  />
                   :<PiEyeBold
                    className='absolute right-3 top-4 text-xl cursor-pointer'
                    onClick={()=> setShowPass(
                      prevState=>!prevState
                    )}
                  />}

              </div>

              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>

                <p className='mb-6'>Have an account? 
                  <Link to='/sign-in' 
                    className='text-red-500 ml-2 hover:text-red-700'
                    >Sign In</Link>
                </p>

                <Link to='/forgot-password'
                  className='text-blue-500 hover:text-blue-800 mb-6'
                >Forgot Password?</Link>
              </div>

              <button 
              
              type="submit"
              className='bg-blue-500 w-full rounded px-7 py-3 text-white  uppercase font-medium text-sm shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-900 transition duration-200 ease-in-out'        

            >Sign Up</button>  

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
