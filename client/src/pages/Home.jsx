import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from '../components/ListingItem';

function Home() {

  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [loading,setLoading] = useState(false);

  // fetching offer listings
  const fetchOfferListing=async()=>{
    try {
      setLoading(true);
       
      const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}api/listing/getAllListing?offer=true&limit=3`);
      const data = await resp.json();

      setOfferListing(data);
      fetchRentListing() // fetching rent listings

    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  // fetching rent listings
  const fetchRentListing=async()=>{
    try {
       
      const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}api/listing/getAllListing?type=rent&limit=3`);
      const data = await resp.json();

      setRentListing(data);
      fetchSaleListing() // fetching Sale listings

    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  // fetching sale listings
  const fetchSaleListing=async()=>{
    try {
       
      const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}api/listing/getAllListing?type=sale&limit=3`);
      const data = await resp.json();

      setSaleListing(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  useEffect(()=>{

    fetchOfferListing();
  },[])

  if(loading){
    return(
      <div className='flex justify-center items-center h-screen'>LOADING...</div>
    )
  }

  return (
    <div>
      {/* top page */}
      <div className="flex flex-col gap-6 p-28 px-3 mx-auto max-w-6xl">
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl dark:text-slate-400'>Find your next 
          <span className='text-slate-500 dark:text-slate-200'> perfect</span>
          <br />
          place with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm dark:text-gray-300">
            HomeConnect is the best place to find your next perfect place to live
            <br />
            We have a wide range of properties to choose from.
          </div>
          <Link className='text-xs sm:text-sm text-blue-800 dark:text-blue-500 font-bold hover:underline mb-3' to={'/search'}>Explore Now..</Link>
      </div>

      {/* web slider */}
      <div className="w-screen">
      <Swiper navigation>
        {
          offerListing && offerListing.length > 0 &&
          offerListing.map((listing)=>(
            <SwiperSlide key={listing._id}>
               <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:'cover'}} className="h-[400px]"></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      </div>
      {/* listing on rent sale & offer */}
      <div className="max-w-6xl mx-auto p-1 flex flex-col gap-6 my-10">
        {
          offerListing && offerListing.length>0 && (
              <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-400 mx-2'>Recent Offers</h2>
                  <Link to={'/search?offer=true'} className='mx-2 text-xs sm:text-sm text-blue-800 font-bold hover:underline dark:text-blue-400'>Show More Offers..</Link>
                </div>
                <div className="flex gap-1 flex-wrap">
                {
                offerListing && offerListing.length>0 && (
                  offerListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                )}
                </div>
              </div>
            )
        }
        {
          rentListing && rentListing.length>0 && (
              <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-400 mx-2'>Recent places for rent</h2>
                  <Link to={'/search?type=rent'} className='mx-2 text-xs sm:text-sm text-blue-800 font-bold hover:underline dark:text-blue-400'>Show More places for rent..</Link>
                </div>
                <div className="flex gap-1 flex-wrap">
                {
                rentListing && rentListing.length>0 && (
                  rentListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                )}
                </div>
              </div>
            )
        }
        {
          saleListing && saleListing.length>0 && (
              <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-600 dark:text-slate-400 mx-2'>Recent places for sale</h2>
                  <Link to={'/search?type=sale'} className='mx-2 text-xs sm:text-sm text-blue-800 font-bold hover:underline dark:text-blue-400'>Show More places for sale..</Link>
                </div>
                <div className="flex gap-1 flex-wrap">
                {
                saleListing && saleListing.length>0 && (
                  saleListing.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                )}
                </div>
              </div>
            )
        }
      </div>
    </div>
  )
}

export default Home