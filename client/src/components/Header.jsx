import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import {useSelector} from 'react-redux'

function Header() {

    const {currentUser} = useSelector((state)=>state.user);
  return (
    <header className='bg-slate-200 shadow-md w-screen absolute top-0'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Massum</span>
            <span className='text-slate-700'>Estate</span>
            </h1>
            <form className="bg-slate-100 p-3 rounded-lg flex">
                <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <FaSearch className='text-slate-600 ' />
            </form>
            <ul className='flex gap-4 '>
                <NavLink to={'/'}>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </NavLink>
                <NavLink to={'/about'}>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </NavLink>
                <NavLink to={'/profile'}>
                {
                    currentUser ? (<img src={currentUser.avatar} alt='Profile' className='w-7 h-7 rounded-full object-cover' />) : 
                    (<li className='hidden sm:inline text-slate-700 hover:underline'>SignIn</li>)
                }
                </NavLink>
                
            </ul>
        </div>


    </header>
  )
}

export default Header