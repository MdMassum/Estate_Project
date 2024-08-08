import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Contact({listing}) {

    const [Landlord, setlandlord] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    
    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    const fetchUser = async() =>{
        try {
            const resp = await fetch(`/api/user/${listing.userRef}`)
            const data = await resp.json();

            if(data.success === false){
                console.log(data.message)
                setLoading(false);
                return;
            }
            setlandlord(data);
            setLoading(false);
          
        } catch (error) {
            setLoading(false);
            console.log(error.message)
        }
    }

    useEffect(()=>{

        fetchUser()
    },[])
  return (
    <>
    {
        Landlord &&
            <div className='mt-4 flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{Landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea onChange={handleChange} type="text" name='message' id='message' value={message} placeholder='Enter Your Message here...' rows='2' className='rounded-lg border p-3' ></textarea>
                <Link to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`} 
                className="bg-slate-700 text-white text-center uppercase rounded-lg hover:opacity-90 p-3 m-1" >
                Send Message
                </Link>
            </div>
    }
    </>
  )
}

export default Contact