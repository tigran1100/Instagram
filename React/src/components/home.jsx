// React
import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { set_posts_data } from '../redux/slices/posts_redux'

// API services
import API_services_function from "../_helpers/api_services"

// Css
import "../css/components/home.css"

// Images

const Home = () => {

    // Hooks
    const API_services = API_services_function()

    // Redux
    const user_details_redux = useSelector((state) => state.user_details_redux.data)
    const posts_redux = useSelector((state) => state.posts_redux)
    const dispatch = useDispatch()

    // States
    const [posts_jsx, set_posts_jsx] = useState(<></>)

    // Effects
    useEffect(()=>{
        API_services.Get_all_posts()
    }, [null])

    useEffect(() => {
        // console.log("posts_redux: ", posts_redux)
        const posts = posts_redux.posts_data
        let posts_jsx_local = []
    
        if (posts) {
            posts.forEach((post, index) => {
                posts_jsx_local.push(post_jsx(post, index))
            })
        }
    
        set_posts_jsx(posts_jsx_local)
    }, [posts_redux])
    

    // Functions

    const post_jsx = (post, index) => {      
        return (
            <div className="home-post" key={index + '138321841'}>
                <div className="home-header">
                    <div className="home-propile-picture">{post.profile_picture !== '' ? <img className="home-body" src={`${process.env.REACT_APP_FILES_URL + '/profile_pictures/' + post.profile_picture}`} /> : <img className="home-body" src={`${process.env.REACT_APP_FILES_URL + '/profile_pictures/profile_picture_default.jpg'}`} />}</div>
                    <div className="home-header-texts">
                        <div className="home-header-top">
                            <div className="home-header-top-username">{post.username}</div>
                            {/* <div className="home-header-top-dot">•</div>
                            <div className="home-header-top-time">{post.time}</div> */}
                        </div>
                    </div>
                </div>
                {/* <img className="home-body" src={require(`${process.env.REACT_APP_POSTS_API}${post.post_file_name}`)} /> */}
                {/* <img className="home-body" src="${process.env.REACT_APP_POSTS_API}${post.post_file_name}" /> */}
                <img className="home-body" src={process.env.REACT_APP_FILES_URL + 'Posts/' + post.post_picture} />
                <div className="home-footer unselectable">
                    <div className="home-footer-left">
                        {post.is_liked === 1 ? <Like_icon_selected id={post.post_id} /> : post.is_liked === 0 && <Like_icon id={post.post_id} />}
                        {/* <Comment_icon /> */}
                        {/* <Send_icon /> */}
                    </div>
                    <div className="home-footer-right">
                        {/* {post.is_saved ? <Save_icon_selected /> : <Save_icon />} */}
                    </div>
                </div>
                <div className="home-info">
                    <span>{post.post_like_count}</span> {post.post_like_count === 0 ? 'likes' : post.post_like_count === 1 ? 'like' : 'likes'} 
                </div>
            </div>
        )
    }


    const do_like = (id) => {

        let new_posts = posts_redux.posts_data.map((post, index) => {
            let post_mutable = { ...post }
            if(post_mutable.post_id === id){
                post_mutable.post_like_count = post_mutable.post_like_count + 1
                post_mutable.is_liked = 1
            }

            return post_mutable
        })

        API_services.Post_action({action : 'like', post_id : id}).then(res => {
            // console.log(res)
        })
        
        dispatch(set_posts_data(new_posts))
    }

    const do_dislike = (id) => {

        let new_posts = posts_redux.posts_data.map((post, index) => {
            let post_mutable = { ...post }
            if(post_mutable.post_id === id){
                post_mutable.post_like_count = post_mutable.post_like_count - 1
                post_mutable.is_liked = 0
            }

            return post_mutable
        })
        
        API_services.Post_action({action : 'dislike', post_id : id}).then(res => {
            // console.log(res)
        })

        dispatch(set_posts_data(new_posts))

    }


    // Icons
    const Like_icon = ({id}) => {return (<svg onClick={()=>{do_like(id)}} className="home-footer-left-icon" aria-label="Like" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>)}
    const Like_icon_selected = ({id}) => {return (<svg onClick={()=>{do_dislike(id)}} className="home-footer-left-icon" style={{color : `var(--color-red)`}} aria-label="Unlike" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Unlike</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>)}
    const Comment_icon = () => {return (<svg onClick={()=>{}} className="home-footer-left-icon" aria-label="Comment" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>)}
    const Send_icon = () => {return (<svg onClick={()=>{}} className="home-footer-left-icon" aria-label="Share Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/></svg>)}
    const Save_icon = () => {return (<svg onClick={()=>{}} className="home-footer-right-icon" aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>)}
    const Save_icon_selected = () => {return (<svg onClick={()=>{}} className="home-footer-right-icon" style={{color : `#000000`}} aria-label="Remove" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Remove</title><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>)}

    return(
        <>
            <div className="home" id='home'>
                <div className="home-inner" id='home-inner'>
                    {posts_jsx}
                </div>
            </div>
        </>
    )

}

export default Home