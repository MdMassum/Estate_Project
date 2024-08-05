import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'

function Profile() {

  const {currentUser} = useSelector((state)=>state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})

  console.log(filePerc);
  console.log(file);
  console.log(formData)

  const fileRef = useRef();

  const handleFileUpload=(file)=>{

    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name; // so that filename is unique
    const storageRef = ref(storage,fileName);

    const uploadTask = uploadBytesResumable(storageRef, file); // used for showing file uploaded percentage

    uploadTask.on('state_changed', (snapshot) =>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      (error)=>{
        setFileUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then   // used for uploading photo in firebase
        ((downloadUrl)=>{
          setFormData({...formData, avatar:downloadUrl})
        })
      }
    );
  }
  useEffect(() => {
    setFileUploadError(false);
    if(file){
      handleFileUpload(file);
    }
  }, [file])
  
  return (
    <div className="w-screen">
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>

          <input type='file' ref={fileRef} onChange={(e)=>setFile(e.target.files[0])} className='hidden' accept='image/*' />
          <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' />

          <p className='self-center text-sm'>
            {
              fileUploadError ? (<span className='text-red-700'>Error Image Upload ( Image must be less than 2 mb )</span>)
              : filePerc > 0 && filePerc < 100 ?(
                <span className='text-slate-700'> {`Uploading ${filePerc}%..`}</span>
              ) : filePerc === 100 ? (
                <span className='text-green-700 '>Image Uploaded Successfully</span>
              ) : ("")
            }
          </p>

          <input type="text"  placeholder='Username' id='username' className='border rounded-lg p-3'/>
          <input type="text"  placeholder='email' id='email' className='border rounded-lg p-3'/>
          <input type="text"  placeholder='password' id='password' className='border rounded-lg p-3'/>

          <button className='uppercase bg-slate-700 text-white rounded-lg p-3 
          hover:opacity-90 disabled:opacity-90 '>Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700'>Delete Account</span>
        <span className='text-red-700'>Sign Out</span>
      </div>
    </div>
    </div>
  )
}

export default Profile