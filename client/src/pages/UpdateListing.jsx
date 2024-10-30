import {getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState} from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:"",
        description:"",
        address:"",
        regularPrice:50,
        discountPrice:0,
        bedrooms:0,
        bathrooms:0,
        furnished:false,
        parking:false,
        type:"rent",
        offer:false,
        userRef:""
    })
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {currentUser} = useSelector((state)=>state.user)
    const navigate = useNavigate()
    const params = useParams() // for getting params

    // for uploading multiple images
    const handleUploadImage = () =>{
        if(files.length + formData.imageUrls.length === 0){
            setImageUploadError("Please select image")
        }
        else if(files.length > 0 && files.length + formData.imageUrls.length < 7){  //take file length only upto 6

            setUploading(true);
            setImageUploadError(false)

            const promises = [] // since we have to upload multiple files
            for(let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls)=>{
                setFormData({...formData,imageUrls:formData.imageUrls.concat(urls),}) //if we add again then keep previous and add new files
                setUploading(false);
                setImageUploadError(false)
            }).catch((err)=>{
                setUploading(false);
                setImageUploadError("Image Upload Failed (2 mb max per image)")
            })
        }
        else{
            setUploading(false);
            setImageUploadError("You can only upload 6 images per listing")
        }
    }
    const storeImage = async(file)=>{
        
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', (snapshot) =>{
                // below 2 line used for showing file uploaded percentage
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
                  console.log(`upload is ${progress}% done`)
                },
                (error)=>{
                  reject(error)
                },
                ()=>{
                  getDownloadURL(uploadTask.snapshot.ref).then   // used for uploading photo in firebase
                  ((downloadUrl)=>{
                    resolve(downloadUrl)
                  })
                }
            );
        })
    }

    // remove uploaded image -->
    const handleRemoveImage=(idx)=>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i!== idx),}
        )
    }

    // handle on change
    const handleOnChange=(e)=>{

        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }
    }

    // for submitting the page
    const handleSubmit = async(e)=>{
        e.preventDefault();

        try {
            if(formData.imageUrls.length < 1) return setError("You must upload atleast one image !!")
            if(+formData.regularPrice < formData.discountPrice) return setError("Discounted Price must be less than Regular Price !!")
            setLoading(true);
            setError(false);

            const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}api/listing/update/${formData._id}`,{
                method: "PUT",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            const data = await resp.json();

            if(data.success === false){
                setError(data.message)
            }
            setLoading(false);
            navigate(`/listing/${data._id}`)

        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }

    // get listing previous details
    const ListingDetails = async()=>{

        const listingId = params.listingId;  // since we use listingId in app.jsx in router
        const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}api/listing/getListing/${listingId}`,{
            method: "GET",
            headers:{"Content-Type": "application/json"}
        })
        const data = await resp.json();
        setFormData(data);

    }
    useEffect(() => {
        ListingDetails();
    }, [])
    
  return (
    <div className="w-screen">
        <div className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Update Listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
            <input
                type='text'
                placeholder='Name'
                className='border p-3 rounded-lg'
                id='name'
                maxLength='62'
                minLength='10'
                required
                value={formData.name}
                onChange={handleOnChange}
            />
            <textarea
                type='text'
                placeholder='Description'
                className='border p-3 rounded-lg'
                id='description'
                required
                value={formData.description}
                onChange={handleOnChange}
            />
            <input
                type='text'
                placeholder='Address'
                className='border p-3 rounded-lg'
                id='address'
                required
                value={formData.address}
                onChange={handleOnChange}
            />
            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                <input type='checkbox' id='sale' className='w-5' onChange={handleOnChange} checked={formData.type === "sale"} />
                <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                <input type='checkbox' id='rent' className='w-5' onChange={handleOnChange} checked={formData.type === "rent"} />
                <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                <input type='checkbox' id='parking' className='w-5' onChange={handleOnChange} checked={formData.parking}/>
                <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                <input type='checkbox' id='furnished' className='w-5' onChange={handleOnChange} checked={formData.furnished} />
                <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                <input type='checkbox' id='offer' className='w-5' onChange={handleOnChange} checked={formData.offer}/>
                <span>Offer</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    value={formData.bedrooms}
                    onChange={handleOnChange}
                />
                <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    value={formData.bathrooms}
                    onChange={handleOnChange}
                />
                <p>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='100000'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    value={formData.regularPrice}
                    onChange={handleOnChange}
                />
                <div className='flex flex-col items-center'>
                    <p>Regular price</p>
                    {formData.type === 'rent' && <span className='text-xs'>(₹ / month)</span>}
                </div>
                </div>
                { // if form
                formData.offer && 
                    <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        id='discountPrice'
                        min='0'
                        max='100000'
                        required
                        className='p-3 border border-gray-300 rounded-lg'
                        value={formData.discountPrice}
                        onChange={handleOnChange}
                    />
                    <div className='flex flex-col items-center'>
                        <p>Discounted price</p>
                        {formData.type === 'rent' && <span className='text-xs'>(₹ / month)</span>}
                    </div>
                    </div>
                }
            </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            </p>
            <div className="flex gap-4">
                <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />

                <button onClick={handleUploadImage} disabled={uploading} type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-60'>
                    {uploading ? "Uploading..." : "Upload"}</button>
            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0  && formData.imageUrls.map((url,idx)=>(
                    <div key={url} className="flex justify-between p-3 border items-center">

                        <img src={url}  className='w-20 h-20 object-contain rounded-lg' alt='Listing images' />
                        <button onClick={()=>handleRemoveImage(idx)} type='button' className='text-red-700 p-3 rounded-lg uppercase hover:opacity-70'>Delete</button>

                    </div>
                    
                ))
            }
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-60' disabled={loading || uploading} >{loading ? "Updating..." : "Update Listing"}</button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        </form>
        </div>
    </div>
  );    
}