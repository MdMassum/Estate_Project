import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { updateProfileFailure, updateProfileStart, updateProfileSuccess } from '../redux/user/userSlice';

function Profile() {

  // useStates
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const [updateSuccess,setUpdateSuccess] = useState(false);
  
  const {currentUser, loading, error} = useSelector((state)=>state.user);
  const dispatch = useDispatch()

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

  // for input change -->
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  // update entered value
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateProfileStart());

      const resp = await fetch(`/api/user/update/me/${currentUser._id}`,{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });
      const data = await resp.json();

      if(data.success === false){
        setUpdateSuccess(false);
        dispatch(updateProfileFailure(data.message))
        return;
      }
      setUpdateSuccess(true);
      dispatch(updateProfileSuccess(data));

    } catch (err) {
      setUpdateSuccess(false);
      dispatch(updateProfileFailure(err.message));
    }
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
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

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

          <input onChange={handleChange} defaultValue={currentUser.username} type="text"  placeholder='Username' id='username' className='border rounded-lg p-3'/>

          <input onChange={handleChange} defaultValue={currentUser.email} type="text"  placeholder='email' id='email' className='border rounded-lg p-3'/>

          <input onChange={handleChange} defaultValue={""} type="password"  placeholder='update password' id='password' className='border rounded-lg p-3'/>

          <button disabled={loading} className='uppercase bg-slate-700 text-white rounded-lg p-3 
          hover:opacity-90 disabled:opacity-90 '>{loading ? "Loading..." : "Update"}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700'>Delete Account</span>
        <span className='text-red-700'>Sign Out</span>
      </div>
        {error ? <p className='text-red-700 mt-2 text-sm'>{error}</p> 
        : ""}
        {updateSuccess ? <p className='text-green-700 mt-2 text-sm'>User is Updated Successfully</p> 
        : ""}
    </div>
    </div>
  )
}

export default Profile