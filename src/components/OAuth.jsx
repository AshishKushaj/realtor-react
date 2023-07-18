import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { toast } from 'react-toastify'
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';


export default function OAuth() {


  const navigation= useNavigate();

  async function onGoogleClick(){
    try {
      const auth= getAuth();
      const provider= new GoogleAuthProvider();

      const result= await signInWithPopup(auth, provider);

      const user=result.user

      // check if user already present or not
      const docRef= doc(db,"users",user.uid);
      const docSnap= await getDoc(docRef)
      if(!docSnap){
        await setDoc(docRef,{
          name:user.displayName,
          email:user.email,
          timeStamp: serverTimestamp()
        })
      }
      navigation("/")

    } catch (error) {
      toast.error("OPPS!!")
      console.log(error);
    }
  }

  return (
    <button type='button' onClick={onGoogleClick} className=' flex justify-center w-full
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
