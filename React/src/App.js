import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';

// Pages
import Index from './Pages/index.js';
import Login from './Pages/login.js';
import Signup from './Pages/signup.js';
import Test from './Pages/test.js';

const App = () => {

  const [user_details, set_user_details] = useState({

    'is_login_details_checked' : false,
    'is_logged_in' : null,
    'username' : null,
    'last_username_changed' : null,
    'pp' : null

  })

  useEffect(()=>{

    return () => {

    }

  }, [])


  return (
    <>
      <BrowserRouter>
        <Track_router user_details={user_details} set_user_details={set_user_details} />
        <Routes>

          <Route path="/" element={<Index user_details={user_details} set_user_details={set_user_details} in_page='feed' />} />
          <Route path="/messenger" element={<Index user_details={user_details} set_user_details={set_user_details} in_page='messenger' />} />
          <Route path="/create" element={<Index user_details={user_details} set_user_details={set_user_details} in_page='create' />} />
          <Route path="/profile" element={<Index user_details={user_details} set_user_details={set_user_details} in_page='profile' />} />

          <Route path="/login" element={<Login set_user_details={set_user_details} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<Test />} />

        </Routes>
      </BrowserRouter>
    </>
  );
  
}


const Track_router = ({user_details, set_user_details}) => {

  let location = useLocation();
  let navigate = useNavigate()

  // Redirection non logged-in users
  useEffect(()=>{

    if(location.pathname !== '/login' && location.pathname !== '/signup'){

      if(user_details.is_login_details_checked === false && user_details.is_logged_in !== true){
        navigate('/login')
      }

    }
    
  }, [location])


  // Setting user login details
  useEffect(()=>{

    set_auth_status()

  }, [null])


  useEffect(()=>{

    let valid_pathnames = [
      '/login',
      '/signup',
      '/',
      '/profile',
    ]

    if(user_details.is_login_details_checked){
      if(user_details.is_logged_in){
        if(!valid_pathnames.includes(window.location.pathname)){
          navigate('/')
        }
      }
    }

    // console.log(user_details)

  }, [user_details])

  


  const set_auth_status = () => {

    axios.defaults.withCredentials = true
    axios.get(`${process.env['REACT_APP_SYSTEM_API']}get_login_details.php`).then(res => {
      res = res.data

      // console.log(res)
      
      if(res.username !== null){
        set_user_details((prev) => ({ ...prev, 'is_login_details_checked' : true, 'is_logged_in' : true, 'username': res.username, 'last_username_changed' : res.last_username_changed }));
        navigate('/')
      }else{
        navigate('/login')
      }

    }).catch(err => {

      console.warn(err);

    })
  }
}










export default App;