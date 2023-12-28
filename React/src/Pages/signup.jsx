// React
import React, {useState, useEffect} from "react"
import { Link, useNavigate } from 'react-router-dom'

// Redux
import { useSelector, useDispatch } from 'react-redux'

// API services
import API_services_function from "../_helpers/api_services"

// Css
import "../css/signup.css"

const Signup = () => {

    // Hooks
    const navigate = useNavigate()
    const API_services = API_services_function()

    // React
    const user_details_redux = useSelector((state) => state.user_details_redux.data)
    const dispatch = useDispatch()

    // States
    const [signup_details, set_signup_details] = useState({email : "", full_name : "", username : "", password : "", errors : ""})

    // Effects
    useEffect(()=>{
        login_fields_animation()
    }, [null])

    // Functions
    const login_fields_animation = () => {

        let fields = document.getElementsByClassName('login-field')
        let inputs = document.getElementsByClassName('input-field')

        for(let i = 0; i < fields.length; i++){

            if(inputs[i].value.trim() !== ''){
                fields[i].classList.add("login-field-active")
            }

            inputs[i].onfocus = () => {
                if(!fields[i].classList.contains("login-field-active")){
                    fields[i].classList.add("login-field-active")
                }
            }
            inputs[i].onblur = () => {
                if(fields[i].classList.contains("login-field-active")){
                    if(inputs[i].value.trim() === ''){
                        fields[i].classList.remove("login-field-active")
                    }
                }
            }
        }
    }

    const is_password_strong = (password) => {

        // Check if the password has at least 6 characters
        if (password.length < 6) {
            return {reason : 'short', is_successfull : 0}
        }

        // Check if the password contains at least one number
        if(/[0-9]/.test(password) !== true){
            return {reason : 'no_numbers', is_successfull : 0}
        }

        // Check if the password contains at least one special character
        if(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) !== true){
            return {reason : 'no_special_chars', is_successfull : 0}
        }

        // Return true if all criteria are met
        return {reason : 'passed', is_successfull : 1}
    }

    const handle_signup = () => {

        if(!signup_fields_check()){
            return
        }

        API_services.Sign_up({email : signup_details.email, full_name : signup_details.full_name, username : signup_details.username, password : signup_details.password}).then(res => {
            if(res.is_successfull === 0){
                set_signup_details(prev => ({...prev, errors : res.reason}))
            }else if(res.is_successfull === 1){
                navigate('/')
            }
        }).catch(err => {
            console.warn(err)
        })

    }



    const signup_fields_check = () => {

        let email = signup_details.email.trim()
        let full_name = signup_details.full_name.trim()
        let username = signup_details.username.trim()
        let password = signup_details.password.trim()

        if(email === '' || full_name === '' || username === '' || password === ''){
            set_signup_details(prev => ({...prev, errors : 'Please fill out all fields'}))
            return null
        }
        
        if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email) === false){
            set_signup_details(prev => ({...prev, errors : 'Please provide real email address'}))
            return null
        }
        
        if(username.length < 4){
            set_signup_details(prev => ({...prev, errors : 'Username must contain at least 4 characters'}))
            return null
        }
        
        let check_password_strong = is_password_strong(password)
        if(check_password_strong.is_successfull === 0){
            if(check_password_strong.reason === 'short'){
                set_signup_details(prev => ({...prev, errors : 'Password must contain at least 6 characters'}))

            }else if(check_password_strong.reason === 'no_numbers'){
                set_signup_details(prev => ({...prev, errors : 'Password must contain at least 1 number'}))

            }else if(check_password_strong.reason === 'no_special_chars'){
                set_signup_details(prev => ({...prev, errors : 'Password must contain at least 1 special character'}))
            }

            return null
        }

        set_signup_details(prev => ({...prev, errors : ''}))

        return true
    }

    return (
        <>
            <div className="signup">
                <div className='login-wrapper'>
                    <div className='account-section'>
                        <div className="login-box">
                            <div className='login-logo' onClick={()=>{navigate('/')}}></div>
                            <div className='login-fields'>
                                <div className={"login-field " + (signup_details.email ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Email</p>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={signup_details.email}
                                        onChange={(e) => { set_signup_details(prev => ({...prev, email : e.target.value})) }}
                                        className="input-field"
                                        aria-label="Email"
                                        aria-required="true"
                                        autoCapitalize="off"
                                        autoComplete="tel"
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"login-field " + (signup_details.full_name ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Full Name</p>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={signup_details.full_name}
                                        onChange={(e) => { set_signup_details(prev => ({...prev, full_name : e.target.value})) }}
                                        className="input-field"
                                        aria-label="Full Name"
                                        aria-required="true"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"login-field " + (signup_details.username ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Username</p>
                                    <input
                                        type="email"
                                        placeholder=""
                                        value={signup_details.username}
                                        onChange={(e) => { set_signup_details(prev => ({...prev, username : e.target.value})) }}
                                        className="input-field"
                                        aria-label="Username"
                                        aria-required="true"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"login-field " + (signup_details.password ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Password</p>
                                    <input
                                        type="password"
                                        placeholder=""
                                        value={signup_details.password}
                                        onChange={(e) => { set_signup_details(prev => ({...prev, password : e.target.value})) }}
                                        className="input-field"
                                        aria-label="Password"
                                        aria-required="true"
                                        autoCapitalize="off" 
                                        autoCorrect="off"
                                    />
                                </div>
                            </div>
                            <button onClick={()=>{handle_signup()}} className="login-button">Sign up</button>
                            {signup_details.errors && <p className="error-message">{signup_details.errors}</p>}
                            {/* <p className="forgot-password-link"><Link to='/forgot'>Forgot Password?</Link></p> */}
                        </div>
                        <div className='new-account'>
                            Already have an account? <span><Link to='/login'>Login</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup