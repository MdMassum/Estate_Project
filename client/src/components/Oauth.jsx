import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Oauth() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async() =>{
      try {

        const provider = new GoogleAuthProvider()
        const auth = getAuth(app)

        const result = await signInWithPopup(auth,provider)
        // console.log(result) // google will send the data in json format
        // console.log("username",result.user.displayName)
        // console.log("email",result.user.email)
        // console.log("photo",result.user.photoURL)
         
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}api/auth/google`,{
          method: "POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({
            username:result.user.displayName,
            email:result.user.email,
            photo:result.user.photoURL
          })
        })
        const data = await res.json();
        dispatch(signInSuccess(data));
        navigate('/');

      } catch (error) {
        console.log("Could not sign in with google", error);
      }
  }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-500 text-white rounded-lg p-3 hover:opacity-90 uppercase'>Continue With Google</button>
  )
}

export default Oauth