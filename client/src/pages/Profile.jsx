import React, { useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { deleteFailure, deleteStart, deleteSuccess, signOutFailure, signOutStart, signOutSuccess, updateProfileFailure, updateProfileStart, updateProfileSuccess } from '../redux/user/userSlice';
import {Link} from 'react-router-dom'

function Profile() {

  // useStates
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([])
  const [showListingError, setShowListingError] = useState(false)
  
  const {currentUser, loading, error} = useSelector((state)=>state.user);
  const dispatch = useDispatch()

  const fileRef = useRef();

  const handleFileUpload=(file)=>{

    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name; // so that filename is unique
    const storageRef = ref(storage,fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) =>{
      // below 2 line used for showing file uploaded percentage
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

  // delete user account 
  const handleDelete = async() =>{
    try {
      dispatch(deleteStart())
      const resp = await fetch(`/api/user/delete-account/${currentUser._id}`,{
        method: "DELETE",
        headers:{"Content-Type": "application/json"},
      })
      if(resp.success === false){
        dispatch(deleteFailure(resp.message));
        return;
      }

      dispatch(deleteSuccess())

    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }

  // signOut -->
  const handleSignOut=async()=>{
    try {
      dispatch(signOutStart())
      const resp = await fetch(`/api/auth/sign-out`,{
        method: "POST",
        headers:{"Content-Type": "application/json"},
      })
      if(resp.success === false){
        dispatch(signOutFailure(resp.message))
        return;
      }

      dispatch(signOutSuccess());

    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
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

  // show listing of user
  const getUserListing = async()=>{
    try {
      setShowListingError(false);
      const resp = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await resp.json();

      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);

    } catch (error) {
      setShowListingError(true)
    }
  }

  // Delete a listing -->

  const handleListingDelete = async(id)=>{
    try {
      const data = await fetch(`api/listing/delete/${id}`,{
        method: "DELETE",
        headers:{"Content-Type": "application/json"},
      })
      const resp = data.json();
      if(resp.success === false){
        alert(resp.message);
      }

      setUserListings((prev)=> prev.filter((listing)=>listing._id !== id))
    } catch (error) {
      alert(error.message);
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
      <h1 className='text-3xl text-center font-semibold my-2'>Profile</h1>
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
          hover:opacity-90 disabled:opacity-90 '>{loading ? "Updating..." : "Update"}</button>
          
          <Link to={'/create-listing'} className='uppercase bg-green-700 text-white text-center rounded-lg p-3 
          hover:opacity-95' >Create listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
        {error ? <p className='text-red-700 mt-5 text-sm'>{error}</p> 
        : ""}
        {updateSuccess ? <p className='text-green-700 mt-5 text-sm'>User is Updated Successfully</p> 
        : ""}
        <button onClick={getUserListing} className='text-green-700 w-full mt-3 rounded-lg'>Show Listing</button>
  
        {showListingError ? <p className='text-red-700 mt-5 text-sm'>Error showing Listings !!</p> 
        : ""}
        {
          userListings && userListings.length>0 &&
          <div>
            <h1 className='text-2xl font-semibold text-center my-7'> Your Listings</h1>
            {
                userListings.map((listing)=>(
                <div key={listing._id} className="m-2 border rounded-lg flex items-center justify-between p-2">

                  <Link to={`/listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} className='h-20 w-20 object-contain ' alt="Cover Image" />
                  </Link>
                  <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold hover:underline truncate'>
                    <p>{listing.name}</p>
                  </Link>

                  <div className='flex flex-col items-center'>
                    <button onClick={()=>handleListingDelete(listing._id)} className='uppercase text-red-700  text-xs p-2 mb-1.5'>Delete</button>
                    <Link to={`/update-listing/${listing._id}`} >
                        <button className='uppercase text-green-700  text-xs px-4 mt-1.5'>Edit</button>
                    </Link>
                  </div>

                </div>
            ))}
          </div>
        }
    </div>
    </div>
  )
}

export default Profile