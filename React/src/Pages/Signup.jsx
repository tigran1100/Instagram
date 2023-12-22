import React, {useEffect, useState} from "react"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

// Css
import '../Css/Signup/Signup.css';

const Signup = () => {

    const navigate = useNavigate()

    const [state_email, set_state_email] = useState('')
    const [state_fullName, set_state_fullName] = useState('')
    const [state_username, set_state_username] = useState('')
    const [state_password, set_state_password] = useState('')
    const [state_error, set_state_error] = useState('')

    useEffect(()=>{

        axios.defaults.withCredentials = true
        loginFieldsAnimation()

        return () => {

        }
    }, [])


    
    const isStrongPasswordFunction = (password) => {
        // Check if the password has at least 6 characters
        if (password.length < 6) {
            return {'passed':false,'reason':'short'}
        }

        // Check if the password contains at least one number
        if(/[0-9]/.test(password) !== true){
            return {'passed':false,'reason':'no_numbers'}
        }

        // Check if the password contains at least one special character
        if(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) !== true){
            return {'passed':false,'reason':'no_special_chars'}
        }

        // Return true if all criteria are met
        return {'passed':true,'reason':'passed'}
    }



    const loginFieldsAnimation = () => {

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



    const handleSignup = () => {

        let stateEmail = state_email.trim()
        let stateFullName = state_fullName.trim()
        let stateUsername = state_username.trim()
        let statePassword = state_password.trim()

        if(!signupFieldsCheck()){
            return
        }

        axios.post(`${process.env.REACT_APP_DATABASE_API}signup.php`, {'email':stateEmail, 'fullName':stateFullName, 'username':stateUsername, 'password':statePassword}).then(res => {
            return res.data
        }).then(res => {
            console.log(res)
            // console.log(res.data)
            if(res.data !== true && (res.reason !== true || res.reason !== 'true' || res.reason !== 'passed')){
                set_state_error(res.reason)
                // console.log('error is set')
            }else if(res.data === true){
                window.location.pathname = '/login'
            }
        }).catch(err => {
            console.error(err)
        })

    }



    const signupFieldsCheck = () => {

        let stateEmail = state_email.trim()
        let stateFullName = state_fullName.trim()
        let stateUsername = state_username.trim()
        let statePassword = state_password.trim()

        if(stateEmail === '' || stateFullName === '' || stateUsername === '' || statePassword === ''){
            set_state_error('Please fill out all fields')
            return null
        }
        
        if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(stateEmail) === false){
            set_state_error('Please provide real email address')
            return null
        }
        
        if(stateUsername.length < 4){
            set_state_error('Username must contain at least 4 characters')
            return null
        }
        
        let isStrongPassword = isStrongPasswordFunction(statePassword)
        if(isStrongPassword['passed'] !== true){
            if(isStrongPassword['reason'] === 'short'){
                set_state_error('Password must contain at least 6 characters')

            }else if(isStrongPassword['reason'] === 'no_numbers'){
                set_state_error('Password must contain at least 1 number')

            }else if(isStrongPassword['reason'] === 'no_special_chars'){
                set_state_error('Password must contain at least 1 special character')
            }

            return null
        }

        set_state_error()

        return true
    }



    return(
        <>
            <div className="signup">
                <div className='login-wrapper'>
                    <div className='account-section'>
                        <div className="login-box">
                            <div className='login-logo' onClick={()=>{navigate('/')}}></div>
                            <div className='login-fields'>
                                <div className={"login-field " + (state_email ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Email</p>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={state_email}
                                        onChange={(e) => { set_state_email(e.target.value) }}
                                        className="input-field"
                                        aria-label="Email"
                                        aria-required="true"
                                        autoCapitalize="off"
                                        autoComplete="tel"
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"login-field " + (state_fullName ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Full Name</p>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={state_fullName}
                                        onChange={(e) => { set_state_fullName(e.target.value) }}
                                        className="input-field"
                                        aria-label="Full Name"
                                        aria-required="true"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"login-field " + (state_username ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Username</p>
                                    <input
                                        type="email"
                                        placeholder=""
                                        value={state_username}
                                        onChange={(e) => { set_state_username(e.target.value) }}
                                        className="input-field"
                                        aria-label="Username"
                                        aria-required="true"
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                    />
                                </div>
                                <div className={"login-field " + (state_password ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Password</p>
                                    <input
                                        type="password"
                                        placeholder=""
                                        value={state_password}
                                        onChange={(e) => { set_state_password(e.target.value) }}
                                        className="input-field"
                                        aria-label="Password"
                                        aria-required="true"
                                        autoCapitalize="off" 
                                        autoCorrect="off"
                                    />
                                </div>
                            </div>
                            <button onClick={handleSignup} className="login-button">Sign up</button>
                            {state_error && <p className="error-message">{state_error}</p>}
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