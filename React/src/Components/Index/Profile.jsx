import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// Pages
import Popup from '../Popup/Popup'

// Css
import '../../Css/Index/Profile.css'
import axios from "axios";

const Profile = ({set_user_details, user_details}) => {

    const [popup_root, set_popup_root] = useState(null)

    const create_popup = (data) => {

        let root

        if(!popup_root){
            root = document.createElement('div');
            root.id = 'popup_holder';
            document.body.insertAdjacentElement('afterbegin', root);
            root = ReactDOM.createRoot(root)
            set_popup_root(root)
        }else{
            root = popup_root
            document.getElementById('popup_holder').style.display = 'flex'
        }
        
        root.render(<Popup set_user_details={set_user_details} user_details={user_details} data={data} />);
        
    }


    const logout = () => {
        axios.defaults.withCredentials = true
        axios.get(`${process.env.REACT_APP_SYSTEM_API}logout.php`).then(res => res.data).then(res => {
            if(res.is_successfull === 1){
                window.location.reload()
            }else{
                alert('Something gone wrong')
            }
        })
    }


    return(
        <div className="profile">
            <div className="profile-inner container">
                <div className="prifile-top">
                    <img className="prifile-top-picture" src={user_details.pp ? require(`../../Images/Users/PP/${user_details.pp}`) : require('../../Images/Users/PP/unreg.jpg')}></img>
                    <div className="profile-top-texts">
                        <div className="profile-top-texts-username">{user_details.username}</div>
                        <div className="profile-top-texts-edit" onClick={()=>{logout()}}>Log out</div>
                        <div className="profile-top-texts-edit" style={{display : 'none'}} onClick={()=>{create_popup({'action' : 'change-username'})}}>Edit username</div>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default Profile