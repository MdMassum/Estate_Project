import React from 'react'
import { useSelector } from 'react-redux'

function Profile() {
  const {currentUser} = useSelector((state)=>state.user);
  return (
    <div className="w-screen">
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
          <img src={currentUser.avatar} alt="Profile" className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' />

          <input type="text"  placeholder='Username' id='username' className='border rounded-lg p-3'/>
          <input type="text"  placeholder='email' id='email' className='border rounded-lg p-3'/>
          <input type="text"  placeholder='password' id='password' className='border rounded-lg p-3'/>

          <button className='uppercase bg-slate-700 text-white rounded-lg p-3 
          hover:opacity-90 disabled:opacity-90 '>Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700'>Delete Account ?</span>
        <span className='text-red-700'>Sign Out</span>
      </div>
    </div>
    </div>
  )
}

export default Profile