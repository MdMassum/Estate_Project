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

  // fetching offer listings
  const fetchOfferListing=async()=>{
    try {
       
      const resp = await fetch('/api/listing/getAllListing?offer=true&limit=4');
      const data = await resp.json();

      setOfferListing(data);
      fetchRentListing() // fetching rent listings

    } catch (error) {
      console.log(error)
    }
  }

  // fetching rent listings
  const fetchRentListing=async()=>{
    try {
       
      const resp = await fetch('/api/listing/getAllListing?type=rent&limit=4');
      const data = await resp.json();

      setRentListing(data);
      fetchSaleListing() // fetching Sale listings

    } catch (error) {
      console.log(error)
    }
  }

  // fetching sale listings
  const fetchSaleListing=async()=>{
    try {
       
      const resp = await fetch('/api/listing/getAllListing?type=sale&limit=4');
      const data = await resp.json();

      setSaleListing(data);

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{

    fetchOfferListing();
  },[])

  return (
    <div>
      {/* top page */}
      <div className="flex flex-col gap-6 p-28 px-3 mx-auto max-w-6xl">
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next 
          <span className='text-slate-500'> perfect</span>
          <br />
          place with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Massum Estate is the best place to find your next perfect place to live
            <br />
            We have a wide range of properties to choose from.
          </div>
          <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to={'/search'}>Explore Now..</Link>
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
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListing && offerListing.length>0 && (
              <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-600 mx-2'>Recent Offers</h2>
                  <Link to={'/search?offer=true'} className='mx-2 text-xs sm:text-sm text-blue-800 font-bold hover:underline'>Show More Offers..</Link>
                </div>
                <div className="flex gap-4 flex-wrap">
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
                  <h2 className='text-2xl font-semibold text-slate-600 mx-2'>Recent places for rent</h2>
                  <Link to={'/search?type=rent'} className='mx-2 text-xs sm:text-sm text-blue-800 font-bold hover:underline'>Show More places for rent..</Link>
                </div>
                <div className="flex gap-4 flex-wrap">
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
                  <h2 className='text-2xl font-semibold text-slate-600 mx-2'>Recent places for sale</h2>
                  <Link to={'/search?type=sale'} className='mx-2 text-xs sm:text-sm text-blue-800 font-bold hover:underline'>Show More places for sale..</Link>
                </div>
                <div className="flex gap-4 flex-wrap">
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