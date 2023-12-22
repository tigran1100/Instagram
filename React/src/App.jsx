// React
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Helpers
import API_services_function from "./_helpers/API_services";

// Pages
import Index from "./Pages/Index"

// Css
import "./Css/Style.css"

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

    // Hooks
    let location = useLocation()
    let navigate = useNavigate()
    const API_services = API_services_function()

    // States
    

    // Effects
    useEffect(()=>{

        let valid_pathnames = [
            '/',
        ]

        if (!valid_pathnames.includes(location.pathname)) {
            navigate('/')
        }

    }, [location])
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Render_page path="/" />} />
            </Routes>
        </>
    )
}


const Render_page = ({ path }) => {

    // Hooks
    let location = useLocation()
    let navigate = useNavigate()

    // Variables
    const members_only_pathnames = ['/super-secret']

    // Effects
    useEffect(()=>{
        if(members_only_pathnames.includes(path)){
            navigate('/')
        }
    }, [location])
    
    // Preventing user to render elements by changing the pathname
    if(members_only_pathnames.includes(path)){
        return
    }

    const path_components = {
        "/": <Index />,
    }
  
    return path_components[path] || null
}
  




export default App