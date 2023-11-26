import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import NavBar from "../Components/Index/navBar";
import Feed from "../Components/Index/feed";
import Messenger from "../Components/Index/messenger";
// import Create from "../Components/Index/create";
import Profile from "../Components/Index/profile";

// Css
import '../Css/style.css'
import '../Css/Index/index.css'

const Index = ({set_user_details, user_details, in_page}) => {

  const [posts_details, set_posts_details] = useState({'posts' : [], 'is_root_declared' : false, 'posts_received_number' : 0, 'posts_max_limit' : 99999, 'posts_left_more' : true})

  const navigate = useNavigate();
 
  return (
    <>
      <div className="index">
        <NavBar user_details={user_details} posts_details={posts_details} set_posts_details={set_posts_details} />
        {in_page === 'feed' && <Feed user_details={user_details} posts_details={posts_details} set_posts_details={set_posts_details} />}
        {in_page === 'messenger' && <Messenger user_details={user_details} />}
        {/* {in_page === 'create' && <Create user_details={user_details} />} */}
        {in_page === 'profile' && <Profile set_user_details={set_user_details} user_details={user_details} />}
      </div>
    </>
  );
};

export default Index;