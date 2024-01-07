// React
import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { set_user_details } from '../redux/slices/user_details_redux'

// API services
import API_services_function from "../_helpers/api_services"

// Css
import "../css/components/profile.css"

const Profile = () => {

    // Redux
    const user_details_redux = useSelector((state) => state.user_details_redux.data)
    const dispatch = useDispatch()

    // Hooks
    const API_services = API_services_function()
    const navigate = useNavigate()

    // Effects
    useEffect(()=>{
        // console.log(user_details_redux)
    }, [user_details_redux])

    // Functions
    const do_logout = () => {
        API_services.Logout().then(res => {
            navigate('/login')
            setTimeout(()=>{
                dispatch(set_user_details())
            }, 500)
        }).catch(err=>{
            console.warn(err)
        })
    }
    
    return (
        <>
            <div className="profile">
                <div className="profile-inner container">
                    <div className="prifile-top">
                        <img className="prifile-top-picture" src={user_details_redux ? (user_details_redux.profile_picture ? `${process.env.REACT_APP_FILES_URL + '/profile_pictures/' + user_details_redux.profile_picture}` : `${process.env.REACT_APP_FILES_URL}/profile_pictures/profile_picture_default.jpg`) : ''} />
                        <div className="profile-top-texts">
                            <div className="profile-top-texts-username">{user_details_redux && user_details_redux.username}</div>
                            <div className="profile-top-texts-edit" onClick={()=>{do_logout()}}>Log out</div>
                            <div className="profile-top-texts-edit" style={{display : 'none'}}>Edit username</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile