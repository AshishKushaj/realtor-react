import React, { useState } from 'react'
import { PiEyeClosedBold ,PiEyeBold} from "react-icons/pi";
import { Link,  useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';



export default function SignIn() {

  const[formData, setFormData]= useState({
    email:'',
    password:''
  })

  const [showPass, setShowPass]=useState(false);
  const navigation=useNavigate()

  const f='w-full px-4 py-2 text-xl rounded text-gray-700 bg-white transition ease-in-out border-gray-300 mb-6';

  const {email,password}=formData;

  function onChange(e){
    setFormData({
      ...formData,[e.target.id]:e.target.value
    })
  }

  async function onSubmit(e){

    e.preventDefault()

    try {
    const auth= getAuth()
    const userCredential= await signInWithEmailAndPassword(auth,email,password)

    if(userCredential){
      navigation("/");
    }
    } catch (error) {
      toast.error("Incorrect email or password!")
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

                <p className='mb-6'>Don't have an account? 
                  <Link to='/sign-up' 
                    className='text-red-500 ml-2 hover:text-red-700'
                    >Register</Link>
                </p>

                <Link to='/forgot-password'
                  className='text-blue-500 hover:text-blue-800 mb-6'
                >Forgot Password?</Link>
              </div>

              <button 
              
              type="submit"
              className='bg-blue-500 w-full rounded px-7 py-3 text-white  uppercase font-medium text-sm shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-900 transition duration-200 ease-in-out'        

            >Sign In</button>  

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
