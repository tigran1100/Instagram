import React, {useState, useEffect} from "react"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

// Css
import '../Css/style.css';
import '../Css/Login/login.css';

// Images
import instagram_poster_original from '../Images/Login/poster.png'

const Login = ({set_user_details}) => {

    const navigate = useNavigate()

    const [page_details, set_page_details] = useState({'username' : '', 'password' : '', 'error' : ''})

    useEffect(()=>{
        loginFieldsAnimation()
        newRegHandle()
    }, [])

    const newRegHandle = () => {
        
        axios.defaults.withCredentials = true
        axios.get(`${process.env['REACT_APP_SYSTEM_API']}get_login_details.php`).then(res => res.data).then(res => {
            if(res['username'] != null){
                set_page_details((prev) => ({ ...prev, 'username' : res.username}));
            }
        })
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

    const handleLogin = async () => {

        const navigate = useNavigate

        const state_username = page_details.username.trim()
        const state_password = page_details.password.trim()
        const state_error = page_details.error

        
        if(page_details.username.trim() === '' || page_details.password.trim() === ''){

            set_page_details(prev => ({...prev, 'error' : 'Please fill out both fields'}))

        }else{
            
            axios.defaults.withCredentials = true
            axios.post(`${process.env.REACT_APP_DATABASE_API}auth.php`, { 'username': page_details.username.trim(), 'password': page_details.password.trim() }).then((response)=>{

                response = response.data
                // console.log(response)
                
                if(response.data != true){
                    set_page_details(prev => ({...prev, 'error' : response.reason}))
                    return false
                }else{
                    set_page_details(prev => ({...prev, 'error' : ''}))
                    set_auth_status()
                }

            }).catch(err => {
                console.warn(err)
            })

        }

    }


    const set_auth_status = () => {

        axios.defaults.withCredentials = true
        axios.get(`${process.env['REACT_APP_SYSTEM_API']}get_login_details.php`).then(res => {
          res = res.data
          
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

    return (
        <>
            <div className="login">
                <div className='login-wrapper'>
                    <img className='login-image' src={instagram_poster_original} alt="Instagram Poster" />

                    <div className='account-section'>
                        <div className="login-box">
                            <Link to='/'><div className='login-logo'></div></Link>
                            <div className='login-fields'>
                                <div className={"login-field " + (page_details.username ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Username or email</p>
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
                                <div className={"login-field " + (page_details.password ? 'login-field-active' : '')}>
                                    <p className="login-field-input-placeholder">Password</p>
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
                            <button onClick={handleLogin} className="login-button">Log in</button>
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

export default Login