import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Oauth from '../components/Oauth.jsx';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange=(e)=>{
    
    setFormData({...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    
    try {
      setloading(true);
      const resp = await fetch('/api/auth/signup',{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });
      const data = await resp.json();
      console.log(data);

      if(data.success === false){
        setError(data.message)
        setloading(false);
        return;
      }
      else{
        setloading(false)
        setError(null)
        navigate('/sign-in')
      }

    } catch (error) {
      setloading(false);
      setError(error.message)
    }
  }

  const handleToggle=()=>{
    setShowPassword(!showPassword)
  }
  return (
    <div className="w-screen ">
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-10 sm:my-5">Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input onChange={handleChange} required type="text" placeholder='UserName' className="border p-3 rounded-lg" id='username' />

          <input onChange={handleChange} required type="email" placeholder='Email' className="border p-3 rounded-lg" id='email' />
    
          <div className="flex gap-1 items-center border rounded-lg p-2">
              <input onChange={handleChange} required type={showPassword ? "text":"password"} placeholder='Password' className="outline-none flex-1 p-2 rounded-lg" id='password'/>
              <div className='cursor-pointer p-2' onClick={handleToggle}>
                {showPassword ?
                 <FaEyeSlash className="text-gray-700 dark:text-gray-300 bg-transparent w-6 h-6"/> 
                 :<FaEye className="text-gray-700 dark:text-gray-300 bg-transparent w-6 h-6" />
                 }
              </div>
          </div>

          <button disabled={loading} className='bg-slate-700 text-white  p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-10 sm:mt-0'>{loading ? "loading.." : "Sign Up"}</button>

          <Oauth/>
      </form>
      <div className="flex flex-col gap-2 sm:gap-0 mt-5 mb-12 p-2 sm:mb-0 sm:p-0">
        <div className="flex gap-3">
          <p>Have an Account ?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-700'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </div>
    </div>
  )
}

export default SignUp