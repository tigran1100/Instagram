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

    return (
        <>
            <BrowserRouter>
                <Track_and_auth_router />
            </BrowserRouter>
        </>
    )

}

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
    
    useEffect(()=>{
        console.log("url_params: ", url_params)
    }, [url_params])
    
    useEffect(()=>{
        console.log("auth_params: ", auth_params)
    }, [auth_params])
    
    useEffect(()=>{
        console.log("user_details_redux: ", user_details_redux)
    }, [user_details_redux])

    return (
        <>
            {
                (url_params.is_valid && (auth_params.is_checked && ((auth_params.in_auth_only_pathname && auth_params.is_authorized) || !auth_params.in_auth_only_pathname))) ? (
                    <Routes>
                        <Route path="/" element={render_page("/")} />
                        <Route path="/create" element={render_page("/create")} />
                        <Route path="/profile" element={render_page("/profile")} />
                        <Route path="/login" element={render_page("/login")} />
                        <Route path="/signup" element={render_page("/signup")} />
                    </Routes>
                ) : (
                    <></>
                )
            }
        </>
    )
}



const render_page = (path) => {



    if(path === '/'){
        return <Page_Index />
    }else if(path === '/create'){
        return <Page_Index />
    }else if(path === '/profile'){
        return <Page_Index />
    }else if(path === '/login'){
        return <Page_Signin />
    }else if(path === '/signup'){
        return <Page_Signup />
    }
}


export default App