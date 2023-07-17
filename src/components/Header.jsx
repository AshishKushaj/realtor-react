import React from 'react';
import { useLocation,  useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate=useNavigate();
  const location = useLocation();

  function onRoute(route) {
    return route === location.pathname;
  }

  return (
    <div className='sticky top-0 z-50 bg-white border-b shadow-sm'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt='logo' className='h-5 cursor-pointer' onClick={()=> navigate("/")} />
        </div>

        <div>
          <ul className='flex space-x-10'>

            <li  onClick={()=>navigate("/")} 
              className={`cursor-pointer py-3 text-sm font-semibold text-black  border-b-[3px] ${onRoute("/") ? 'border-b-red-500  text-black' : 'border-b-transparent text-gray-400'}`}>Home</li>

            <li onClick={()=>navigate("/offers")} 
              className={`cursor-pointer py-3 text-sm font-semibold text-black border-b-[3px]  ${onRoute("/offers") ? 'border-b-red-500 text-black ' : 'border-b-transparent text-gray-400'}`}>Offers</li>

            <li onClick={()=>navigate("/sign-in")} 
              className={`cursor-pointer py-3 text-sm font-semibold text-black border-b-[3px]  ${onRoute("/sign-in") ? 'border-b-red-500 text-black' : 'border-b-transparent text-gray-400'}`}>Sign In</li>

          </ul>
        </div>
      </header>
    </div>
  );
}
