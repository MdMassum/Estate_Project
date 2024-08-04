import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

function SignIn() {

  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state)=>state.user)


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange=(e)=>{
    
    setFormData({...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();

    try {
      dispatch(signInStart());
      const resp = await fetch('/api/auth/signin',{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });
      const data = await resp.json();

      if(data.success === false){
        dispatch(signInFailure(data.message))
        return;
      }
      
      dispatch(signInSuccess(data))
      navigate('/')

    } catch (err) {
      dispatch(signInFailure(err.message))
    }

  }
  return (
    <div className="w-screen">
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input onChange={handleChange} type="text" placeholder='Email' className="border p-3 rounded-lg" id='email' />
          <input onChange={handleChange} type="text" placeholder='Password' className="border p-3 rounded-lg" id='password' />

          <button disabled={loading} className='bg-slate-700 text-white  p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "loading.." : "Sign In"}</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don&apos;t Have an Account ?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </div>
  )
}

export default SignIn