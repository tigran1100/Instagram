// React
import React, {useState, useEffect} from "react"
import { Link, useNavigate } from 'react-router-dom'

// Redux
import { useSelector, useDispatch } from 'react-redux'

// API services
import API_services_function from "../_helpers/api_services"

// Css
import "../css/signin.css"

// Images
import Image_poster from '../assets/images/signin/poster.png'

const Signin = () => {

    // Hooks
    const navigate = useNavigate()
    const API_services = API_services_function()

    // React
    const user_details_redux = useSelector((state) => state.user_details_redux.data)
    const dispatch = useDispatch()

    // States
    const [page_details, set_page_details] = useState({'username' : '', 'password' : '', 'error' : ''})

    // Effects
    useEffect(()=>{
        signin_fields_animation()
    }, [null])

    // Functions
    const signin_fields_animation = () => {

        let fields = document.getElementsByClassName('signin-field')
        let inputs = document.getElementsByClassName('input-field')

        for(let i = 0; i < fields.length; i++){

            if(inputs[i].value.trim() !== ''){
                fields[i].classList.add("signin-field-active")
            }

            inputs[i].onfocus = () => {
                if(!fields[i].classList.contains("signin-field-active")){
                    fields[i].classList.add("signin-field-active")
                }
            }
            inputs[i].onblur = () => {
                if(fields[i].classList.contains("signin-field-active")){
                    if(inputs[i].value.trim() === ''){
                        fields[i].classList.remove("signin-field-active")
                    }
                }
            }
        }
    }

    const handle_login = async () => {
        
        if(page_details.username.trim() === '' || page_details.password.trim() === ''){

            set_page_details(prev => ({...prev, 'error' : 'Please fill out all fields'}))

        }else{
            
            set_page_details(prev => ({...prev, 'error' : ''}))

            API_services.Sign_in({'username': page_details.username.trim(), 'password': page_details.password.trim()}).then(res => {

                if(res.is_successfull === 0){
                    set_page_details(prev => ({...prev, 'error' : res.reason}))
                    return false
                }else if(res.is_successfull === 1){
                    navigate('/')
                }

            }).catch(err => {
                console.warn(err)
            })
        }

    }


    return (
        <>
            <div className="signin">
                <div className='signin-wrapper'>
                    <img className='signin-image' src={Image_poster} alt="Instagram Poster" />

                    <div className='account-section'>
                        <div className="signin-box">
                            <div className='signin-logo' onClick={()=>{navigate('/')}}></div>
                            <div className='signin-fields'>
                                <div className={"signin-field " + (page_details.username ? 'signin-field-active' : '')}>
                                    <p className="signin-field-input-placeholder">Username or email</p>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={page_details.username}
                                        onChange={(e) => {set_page_details(prev => ({...prev, 'username' : e.target.value}))}}
                                        className="input-field"
                                        aria-label="Username or email" 
                                        aria-required="true" 
                                        autoCapitalize="off" 
                                        autoComplete="tel" 
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"signin-field " + (page_details.password ? 'signin-field-active' : '')}>
                                    <p className="signin-field-input-placeholder">Password</p>
                                    <input
                                        type="password"
                                        placeholder=""
                                        value={page_details.password}
                                        onChange={(e) => {set_page_details(prev => ({...prev, 'password' : e.target.value}))}}
                                        className="input-field"
                                        aria-label="Password"
                                        aria-required="true"
                                        autoCapitalize="off" 
                                        autoCorrect="off"
                                    />
                                </div>
                            </div>
                            <button className="signin-button" onClick={()=>{handle_login()}}>Log in</button>
                            {page_details.error && <p className="error-message">{page_details.error}</p>}
                            {/* <p className="forgot-password-link"><Link to='/forgot'>Forgot Password?</Link></p> */}
                        </div>
                        <div className='new-account'>
                            Don't have an account? <span><Link to='/signup'>Sign up</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin