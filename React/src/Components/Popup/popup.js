import React, { useEffect, useState } from "react";

// Css
import '../../Css/Popup/popup.css'
import axios from "axios";


const Popup = ({set_user_details, user_details, data}) => {

    const [change_username, set_change_username] = useState({'input_value' : '', 'errors' : ''}) // For `change-username`
    
    // For `change-username`
    const Change_username = () => {

        const submit = () => {

            if(change_username.input_value.length < 4){
                set_change_username(prev => ({...prev, errors : 'Username must contain at least 4 characters'}))
            }else{
                set_change_username(prev => ({...prev, errors : ''}))

                // console.log('Updating: ' + user_details['username'] + ' -> ' + change_username.input_value)
                axios.post(`${process.env.REACT_APP_DATABASE_API}change_username.php`, {'username' : user_details['username'], 'new_username' : change_username.input_value}).then(res => {
                    res = res.data
                    // console.log(res)

                    if(res.is_successfull === 0){

                        // res.reason === 'recently_changed'
                        set_change_username(prev => ({...prev, errors : res.reason === 'recently_changed' ? 'The username was recently updated' : res.reason === 'less_then_4_chars' ? 'Username must contain at least 4 characters' : 'Apologies, technical errors occurred. Please try again later'}))

                    }else if(res.is_successfull === 1){
                        set_user_details(prev => ({...prev, 'username' : change_username.input_value}))
                        close_popup()
                    }

                    // console.log(res)
                })
            }
        }

        return(<>
            <div className="popup-box">
                <div className="popup-cu">
                    <div className="popup-cu-header">Change username</div>
                    <div className="popup-cu-body">
                        <div className="popup-cu-inputs">
                            <div className="popup-cu-body-text">New username</div>
                            <input className="popup-cu-body-input" autoFocus="autoFocus" onInput={(e)=>{set_change_username(prev => ({...prev, input_value : e.target.value}))}} value={change_username.input_value} />
                            {/* <input className="popup-cu-body-input" id="popup-cu-body-input" /> */}
                        </div>
                            <div className="popup-cu-body-errors">{change_username.errors}</div>
                        <div onClick={()=>{submit()}} className="popup-cu-body-submit">Submit</div>
                    </div>
                </div>
            </div>
        </>)

    }
    // END For `change-username`
    

    const close_popup = () => {
        document.getElementById("popup_holder").style.display = 'none'
    }
    

    const Close_icon = () => {return(<svg onClick={close_popup} className="popup-close-icon" aria-label="Close" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Close</title><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg>)}

    return (
        <div className="popup">
            <Close_icon />
            {data.action === 'change-username' && <Change_username />}
        </div>
    )

}

export default Popup