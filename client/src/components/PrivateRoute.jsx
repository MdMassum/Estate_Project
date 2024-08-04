import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoute() {

    // if current user exist we show profile section i.e outlet else navigate to signIn page
    // here Navigate is component not navigate
    
    const {currentUser} = useSelector((state)=>state.user);

  return  currentUser ? <Outlet /> : <Navigate to={'/sign-in'} />
}

export default PrivateRoute