import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem';

function Search() {

    const [sideBarData, setSideBarData] = useState({
        searchKey:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })
    const [listings, setListings] = useState();
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    const handleChange=(e)=>{
        if(e.target.id === 'searchKey'){
            setSideBarData({
                ...sideBarData,
                [e.target.id]:e.target.value
            })
        }
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSideBarData({
                ...sideBarData,
                type:e.target.id
            })
        }
        if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished'){
            setSideBarData({
                ...sideBarData,
                [e.target.id]:e.target.checked || e.target.checked === 'true'?true:false
            })
        }
        if(e.target.id === 'sort_order'){

            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({
                ...sideBarData,
                sort,
                order
            })
        }
    }
    const handleSubmit=(e)=>{
        e.preventDefault()

        //first get the url from browser then update that url
        const urlParams = new URLSearchParams();
        urlParams.set('searchKey',sideBarData.searchKey);   // setting query on the url
        urlParams.set('type',sideBarData.type);
        urlParams.set('parking',sideBarData.parking);
        urlParams.set('furnished',sideBarData.furnished);
        urlParams.set('offer',sideBarData.offer);
        urlParams.set('sort',sideBarData.sort);
        urlParams.set('order',sideBarData.order);

        const searchQuery = urlParams.toString()
        navigate(`/search/?${searchQuery}`)
    }

    const fetchListings = async()=>{
        try {
            setLoading(true);
            const urlParams = new URLSearchParams(location.search);
            const searchQuery = urlParams.toString()

            const resp = await fetch(`/api/listing/getAllListing/?${searchQuery}`)
            const data = await resp.json();

            if(data.length > 5){
                setShowMore(true);
            }
            else{
                setShowMore(false)
            }
            setListings(data);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error.message);
        }
    }
    const fetchMoreListing = async() =>{
        const len = listings.length;
        const startIndex = len;

        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex)
        const searchQuery = urlParams.toString()

        const resp = await fetch(`/api/listing/getAllListing/?${searchQuery}`)
        const data = await resp.json();

        if(data.length < 6){
            setShowMore(false);
        }
        setListings([...listings,...data]);
    }
    useEffect(()=>{

        const urlParams = new URLSearchParams(location.search);
            const searchKeyFromUrl = urlParams.get('searchKey');   // getting query from url
            const typeFromUrl = urlParams.get('type');
            const parkingFromUrl = urlParams.get('parking');
            const furnishedFromUrl = urlParams.get('furnished');
            const offerFromUrl = urlParams.get('offer');
            const sortFromUrl = urlParams.get('sort');
            const orderFromUrl = urlParams.get('order');
            
            if(searchKeyFromUrl ||
                typeFromUrl ||
                parkingFromUrl ||
                furnishedFromUrl ||
                offerFromUrl ||
                sortFromUrl ||
                orderFromUrl
            ){
                setSideBarData({
                    searchKey:searchKeyFromUrl || '',
                    type: typeFromUrl || 'all',
                    parking: parkingFromUrl === 'true' ? true : false,
                    furnished: furnishedFromUrl === 'true' ? true : false,
                    offer: offerFromUrl === 'true' ? true : false,
                    sort: sortFromUrl || 'created_at',
                    order: orderFromUrl || 'desc',
                })
            }

        fetchListings() 

    },[location.search])
  return (
    <div className="w-screen">
    <div className='flex flex-col md:flex-row '>
        <div className="p-8 md:border-r-2 md:min-h-screen md:w-[360px]">
            <form onSubmit={handleSubmit}
             className='flex flex-col gap-8'>
                <div className="flex flex-col gap-2">
                    <label className='font-semibold text-xl'>Search Word: </label>
                    <input type="text" id='searchKey' placeholder='Search..' className='border p-3 w-full rounded-lg'
                    value={sideBarData.searchKey} 
                    onChange={handleChange}
                    />
                </div>
                <div className="flex gap-5 flex-wrap items-center">
                    <label className='font-semibold'>Type: </label>
                    <div className="flex gap-1">
                        <input type="checkbox" id='all' className='w-5'
                            checked={sideBarData.type === 'all'}
                            onChange={handleChange}
                        />
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-1">
                        <input type="checkbox" id='rent' className='w-5'
                            checked={sideBarData.type === 'rent'}
                            onChange={handleChange}
                        />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-1">
                        <input type="checkbox" id='sale' className='w-5'
                            checked={sideBarData.type === 'sale'}
                            onChange={handleChange}
                        />
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-1">
                        <input type="checkbox" id='offer' className='w-5'
                            checked={sideBarData.offer}
                            onChange={handleChange}
                        />
                        <span>offer</span>
                    </div>
                </div>
                <div className="flex gap-5 flex-wrap items-center">
                    <label className='font-semibold'>Amneties: </label>
                    <div className="flex gap-1">
                        <input type="checkbox" id='parking' className='w-5'
                            checked={sideBarData.parking}
                            onChange={handleChange}
                        />
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-1">
                        <input type="checkbox" id='furnished' className='w-5'
                            checked={sideBarData.furnished}
                            onChange={handleChange}
                        />
                        <span>Furnished</span>
                    </div>
                   
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold">Sort By</label>
                    <select 
                        id="sort_order" 
                        className=' rounded-lg border p-3'
                        onChange={handleChange}
                        defaultValue='created_at_desc'
                    >
                        <option value="createdAt_desc">Latest</option>
                        <option value="createdAt_asc">Oldest</option>
                        <option value="regularPrice_asc">Price Low To High</option>
                        <option value="regularPrice_desc">Price High To Low</option>
                    </select>
                </div>
                <button className='bg-slate-700 rounded-lg p-3 uppercase text-white hover:opacity-90'>Search</button>
            </form>
        </div>  
        
        <div className="flex-1 p-7">
            <h1 className='text-3xl font-semibold border-b p-3 mb-3 text-slate-700 dark:text-gray-300 '>Listing results:</h1>
            <div className="flex flex-wrap sm:gap-10 sm:mx-6 ">
            {!loading && !listings &&
                <p className='text-xl text-slate-700 m-auto'> No Listing Found !!</p>}
            {loading &&
                <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
            }
            {
                !loading && listings && listings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                ))
            }
            {
                showMore && 
                <button
                onClick={fetchMoreListing}
                className='text-green-700 hover:underline p-3 text-center w-full outline-none bg-white border-none dark:bg-transparent'>
                    Show More
                </button>
            }
            </div>
        </div>
    </div>
    </div>
  )
}

export default Search