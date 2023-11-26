import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom/client';
import { useNavigate } from "react-router-dom";
import axios from "axios";


// Css
import '../../Css/Index/feed.css';



const Feed = ({user_details, posts_details, set_posts_details}) => {

    // const [posts_details, set_posts_details] = useState({'posts' : [], 'is_root_declared' : false})
    const [root, set_root] = useState(null)

    
    // Re-Rendering posts every time post is added or changed
    useEffect(()=>{
        
        if(posts_details.posts !== '[]'){

            let display_all_posts = ''

            posts_details.posts.forEach((post) => {
                display_all_posts = <>{display_all_posts}{feed_item_jsx(post)}</>
            })

            let rootElement
            if(!root){
                rootElement = ReactDOM.createRoot(document.getElementById('feed-container'))
                set_root(rootElement)
            }else{
                rootElement = root
            }

            
            let feed = document.getElementById('feed')
            let scroll_top = feed.scrollTop

            rootElement.render(display_all_posts)
            
            setTimeout(()=>{
                feed.scrollTo(0, scroll_top)
            }, 100)

        }

        load_posts_on_scroll()

    }, [posts_details])

    


    // Loading first post when user is logged
    useEffect(()=>{

        if(user_details.username){
            load_posts()
        }

    }, [user_details])

    // One time effect for loading functions
    useEffect(()=>{
        load_posts_on_scroll()
    }, [null])

    const feed_item_jsx = (new_post) => {

        // console.log(new_post)
        
        return (
            <>
            <div className="feed-post">
                <div className="feed-header">
                    <div className="feed-propile-picture">{new_post.profile_picture !== '' ? <img className="feed-body" src={require(`../../Images/Users/PP/${new_post.profile_picture}`)} /> : <img className="feed-body" src={require(`../../Images/Users/PP/unreg.jpg`)} />}</div>
                    <div className="feed-header-texts">
                        <div className="feed-header-top">
                            <div className="feed-header-top-username">{new_post.username}</div>
                            {/* <div className="feed-header-top-dot">•</div>
                            <div className="feed-header-top-time">{new_post.time}</div> */}
                        </div>
                    </div>
                </div>
                <img className="feed-body" src={require(`../../../../Api/Files/Posts/${new_post.post_file_name}`)} />
                <div className="feed-footer">
                    <div className="feed-footer-left">
                        {new_post.is_liked ? <Like_icon_selected post_details={new_post} /> : <Like_icon post_details={new_post} />}
                        {/* <Comment_icon /> */}
                        {/* <Send_icon /> */}
                    </div>
                    <div className="feed-footer-right">
                        {/* {new_post.is_saved ? <Save_icon_selected /> : <Save_icon />} */}
                    </div>
                </div>
                <div className="feed-info">
                    <span>{new_post.likes}</span> {new_post.likes === 0 ? 'likes' : new_post.likes === 1 ? 'like' : 'likes'} 
                </div>
            </div>
            </>
        )
    }




    const load_posts = async (details) => {

        if(posts_details.posts_left_more === true){

            try{
    
                axios.defaults.withCredentials = true
                
                let posts_data = await axios.post(`${process.env.REACT_APP_DATABASE_API}get_posts.php`, {'username' : user_details.username, 'limit' : posts_details.posts_max_limit})
                posts_data = posts_data.data
        
                if(posts_data.reason === true){
                    
                    set_posts_details(prev => ({...prev, posts : posts_data.data, posts_max_limit : prev.posts_max_limit + 10}))
                    posts_data.more === 0 && set_posts_details(prev => ({...prev, posts_left_more : false}))
    
                }else if(posts_data.reason === 'No data received'){
                    alert('No data received')
                }else{
                    alert('An unexpected error ocured')
                }
    
            }catch (error){
    
                console.warn(error)
            }
        
        }

    }
 

    const load_posts_on_scroll = async () => {
    
        let feed = document.getElementById('feed')
        let ready_to_request = true
        let timeoutId = null
    
        feed.onscroll = () => {

            console.log()
     
            if (ready_to_request) {
    
                let scrollPosition = feed.scrollTop;
                let feed_height = feed.scrollHeight - window.innerHeight
                let current_scroll_position = feed_height - scrollPosition

                if (current_scroll_position <= 1600) {
    
                    ready_to_request = false
    
                    clearTimeout(timeoutId)
    
                    timeoutId = setTimeout(() => {
                        ready_to_request = true
                    }, 1000)
    
                    load_posts().then(res => {

                    })
    
                }
            }
        }
    }
    
    


    const on_like = (post_details) => {
        axios.post(`${process.env.REACT_APP_DATABASE_API}external_post_action.php`, {'action' : 'like', 'post_owner' : post_details.username, 'post_interactor' : user_details.username, 'post_id' : post_details.post_id}).then(res => {
            
            // console.log(res)

            res = res.data
            res.is_successfull === 1 ? set_posts_details(prev => ({ ...prev, posts: prev.posts.map(post => post.post_id === post_details.post_id ? { ...post, is_liked: true, likes : parseInt(post.likes) + 1 } : post )})) : console.warn(res.reason)
            
        }).catch(err => {
            console.warn(err)
        })
    }
    const on_dislike = (post_details) => {

        axios.post(`${process.env.REACT_APP_DATABASE_API}external_post_action.php`, {'action' : 'dislike', 'post_owner' : post_details.username, 'post_interactor' : user_details.username, 'post_id' : post_details.post_id}).then(res => {

            res = res.data
            res.is_successfull === 1 ? set_posts_details(prev => ({ ...prev, posts: prev.posts.map(post => post.post_id === post_details.post_id ? { ...post, is_liked: false, likes : parseInt(post.likes) - 1 } : post )})) : console.warn(res.reason)
            
        }).catch(err => {
            console.warn(err)
        })
    }


    const Like_icon = ({post_details}) => {return (<svg onClick={()=>{on_like(post_details)}} className="feed-footer-left-icon" aria-label="Like" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>)}
    const Like_icon_selected = ({post_details}) => {return (<svg onClick={()=>{on_dislike(post_details)}} className="feed-footer-left-icon" style={{color : `var(--red)`}} aria-label="Unlike" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Unlike</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>)}
    const Comment_icon = () => {return (<svg className="feed-footer-left-icon" aria-label="Comment" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>)}
    const Send_icon = () => {return (<svg className="feed-footer-left-icon" aria-label="Share Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/></svg>)}
    const Save_icon = () => {return (<svg className="feed-footer-right-icon" aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>)}
    const Save_icon_selected = () => {return (<svg className="feed-footer-right-icon" style={{color : `#000000`}} aria-label="Remove" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Remove</title><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>)}




    return(
        <>
            <div className="feed" id='feed'>
                <div className="feed-container" id='feed-container'>
                    
                </div>
            </div>
        </>
    )

}

export default Feed