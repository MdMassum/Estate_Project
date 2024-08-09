import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-[345px] sm:w-[349px] m-3'>
        <Link to={`/listing/${listing._id}`}>
            
            <img src={listing.imageUrls[0]} alt="Cover Page" 
            className='h-[230px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'/>

            <div className="p-3 flex flex-col">
                <p className='font-semibold text-slate-700 text-lg truncate mb-2 '>{listing.name}</p>
                <div className="flex gap-1 items-center">
                    <MdLocationOn className='text-lg text-green-700'/>
                    <p className='text-gray-600 text-sm truncate'>{listing.address}</p>
                </div>
                <div className="">
                    <p className='text-gray-600 text-sm line-clamp-2 p-1'>{listing.description}</p>

                    <p className='text-green-700 font-semibold mt-2'>₹{listing.offer ? (+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')  : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' ? ' / month' : " /-"}</p>

                    <div className="flex gap-3 text-gray-600 mt-1">
                        <div className="font-bold text-xs">
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        <div className="font-bold text-xs">
                            {listing.bathrooms > 1 ? `${listing.bathrooms} beds` : `${listing.bathrooms} bed`}
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </Link>
    </div>
  )
}

export default ListingItem