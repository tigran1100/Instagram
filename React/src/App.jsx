// React
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

// Helpers
import API_services_function from "./_helpers/api_services"

// Pages
import Page_Index from "./pages/index"
import Page_Signin from "./pages/signin"
import Page_Signup from "./pages/signup"

// Css
import "./css/style.css"

const App = () => {

    // Values
    let valid_pathnames = [
        '/',
        '/create',
        '/profile',
        '/login',
        '/signup',
    ]

    let authorized_only_pathnames = [
        '/',
        '/create',
        '/profile'
    ]

    const Track_and_auth_router = () => {
    
        // Redux
        const user_details_redux = useSelector((state) => state.user_details_redux.data)
    
        // Hooks
        let location = useLocation()
        let navigate = useNavigate()
        const API_services = API_services_function()
    
        // States
        const [url_params, set_url_params] = useState({is_valid : false})
        const [auth_params, set_auth_params] = useState({is_checked : false, is_authorized : false, in_auth_only_pathname : false})
    
        // Effects
        useEffect(()=>{
    
            if(valid_pathnames.includes(window.location.pathname)) {
                set_url_params(prev => ({...prev, is_valid : true}))
            }else{
                set_url_params(prev => ({...prev, is_valid : false}))
                navigate('/')
                return
            }
    
            const in_auth_only_pathname = authorized_only_pathnames.includes(window.location.pathname)
    
            if(!auth_params.is_checked){
    
                API_services.Get_token().then(res=>{
                    if(res === true){
                        set_auth_params(prev => ({...prev, is_checked : true, is_authorized : true, in_auth_only_pathname : in_auth_only_pathname}))
                    }else{
                        set_auth_params(prev => ({...prev, is_checked : true, is_authorized : false, in_auth_only_pathname : in_auth_only_pathname}))
                        navigate('/login')
                        return
                    }
                }).catch(err=>{
                    console.log(err)
                })
    
            }else{
                set_auth_params(prev => ({...prev, in_auth_only_pathname : in_auth_only_pathname}))
                if(in_auth_only_pathname && !auth_params.is_authorized){
                    navigate('/login')
                    return
                }
            }
    
        }, [location])
        
        // useEffect(()=>{
        //     console.log("url_params: ", url_params)
        // }, [url_params])
        
        // useEffect(()=>{
        //     console.log("auth_params: ", auth_params)
        // }, [auth_params])
        
        useEffect(()=>{
            // console.log("user_details_redux: ", user_details_redux)
            if(!auth_params.is_authorized && user_details_redux && user_details_redux.username){
                set_auth_params(prev => ({...prev, is_authorized : true}))
            }
        }, [user_details_redux])
    
        const render_conditionally = (value) => {
    
            if(authorized_only_pathnames.includes(window.location.pathname) && !auth_params.is_authorized){
                return <></>
            }
            return value

        }

        return (
            <>
                {
                    (url_params.is_valid && (auth_params.is_checked && ((auth_params.in_auth_only_pathname && auth_params.is_authorized) || !auth_params.in_auth_only_pathname))) ? (
                        <Routes>
                            <Route path="/" element={render_conditionally(<Page_Index />)} />
                            <Route path="/create" element={render_conditionally(<Page_Index />)} />
                            <Route path="/profile" element={render_conditionally(<Page_Index />)} />
                            <Route path="/login" element={render_conditionally(<Page_Signin />)} />
                            <Route path="/signup" element={render_conditionally(<Page_Signup />)} />
                            <Route path="*" element={<>Not Found</>} />
                        </Routes>
                    ) : (
                        <></>
                    )
                }
            </>
        )
    }

    return (
        <>
            <BrowserRouter>
                <Track_and_auth_router />
            </BrowserRouter>
        </>
    )

}



export default App