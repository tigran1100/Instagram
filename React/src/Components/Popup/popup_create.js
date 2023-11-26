import React, { useEffect, useState } from "react";

// Css
import '../../Css/Popup/popup.css'
import '../../Css/Popup/popup_create.css'
import axios from "axios";


const Popup_create = ({set_user_details, user_details, posts_details, set_posts_details, data}) => {

    const [post_stage, set_post_stage] = useState(0)
    const [selected_file_name, set_selected_file_name] = useState('')
    const [file_data, set_file_data] = useState(null)

    
    const close_popup = () => {
        document.getElementById("popup_holder").style.display = 'none'
    }

    const Close_icon = () => {return(<svg onClick={()=>{close_popup()}} className="popup-close-icon" aria-label="Close" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Close</title><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg>)}
    const Create_body_icon = () => {return(<svg className="create_body_icon" aria-label="Icon to represent media such as images or videos" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><title>Icon to represent media such as images or videos</title><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>)}
    const Go_back_icon = () => {return(<svg onClick={()=>{handle_go_back_icon()}} className="create-header-back" aria-label="Back" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>)}

    const handle_go_back_icon = () => {

        if(post_stage === 1){

            let header = document.getElementById('create-header')
            let img = document.getElementById('selectedImage')

            header.classList.remove('create-header-active')

            img.src = ''
            img.style.display = 'none'

            set_post_stage(0)
       }
    } 

    const handle_create_button = () => {

        if(post_stage === 0){

            let header = document.getElementById('create-header')
            let file_input = document.getElementById('create-body-file-input')
            
            file_input.click()
            file_input.onchange = () => {
                
                if (file_input.files && file_input.files[0]) {

                    // Checking file size
                    let fileSizeInMB = file_input.files[0].size / (1024 * 1024);
                    if (fileSizeInMB > 20) {
                        alert("File size exceeds 20MB. Please choose a smaller file.");
                        return;
                    }

                    // Changing the state
                    set_post_stage(1)

                    // Changing the header style
                    header.classList.add('create-header-active')

                    let img = document.getElementById('selectedImage');
                    // let video = document.getElementById('selectedVideo');
                    let reader = new FileReader();
            
                    // Saveing the file name
                    let fileName = file_input.files[0].name;
                    let final_fileName = fileName.length > 50 ? fileName.substring(0, 50) + '...' : fileName;
                    set_selected_file_name(final_fileName)

                    // Setting up the FileReader to display the image when it's loaded
                    reader.onload = function (e) {

                        // Checking if the file is an image
                        if (file_input.files[0].type.startsWith('image')) {

                            img.src = e.target.result;
                            img.style.display = 'flex';

                        }

                        set_file_data(file_input.files[0])

                    };
            
                    // Reading the selected file as a data URL
                    reader.readAsDataURL(file_input.files[0]);
                }
            }

        }
    }

    const handle_post = () => {
        if(file_data){
            let formData = new FormData()
            formData.append('file', file_data)
            formData.append('textData', JSON.stringify({'username' : user_details.username}))

            axios.post(`${process.env.REACT_APP_DATABASE_API}make_post.php`, formData).then(response => {

                let data = response.data

                load_posts({'limit' : posts_details.posts_max_limit})
                close_popup()

                if(data.is_successfull === 0){
                    alert('Something went wrong :(')
                }

                if(post_stage === 1){

                    let header = document.getElementById('create-header')
                    let img = document.getElementById('selectedImage')
        
                    header.classList.remove('create-header-active')
        
                    img.src = ''
                    img.style.display = 'none'
        
                    set_post_stage(0)
               }

            }).catch(error => {
                console.error('Error uploading file:', error);
            });
        }
    }


    const load_posts = async (details) => {

        try{

            let posts_data = await axios.post(`${process.env.REACT_APP_DATABASE_API}get_posts.php`, {'username' : user_details.username, 'limit' : details.limit})
            posts_data = posts_data.data
    
            if(posts_data.reason === true){

                console.log(posts_data)

                // window.location.reload()

                // set_posts_details(prev => ({...prev, posts : posts_data.data, posts_max_limit : prev.posts_max_limit + 10}))
                // posts_data.more === 0 && set_posts_details(prev => ({...prev, posts_left_more : false}))

            }else if(posts_data.reason === 'No data received'){
                alert('No data received')
            }else{
                alert('An unexpected error ocured')
            }

        }catch (error){

            console.warn(error)
        }

    }


    const Header_content_0 = () => {
        return (
            <>
                <div className="create-header-text">Create new post</div>
            </>
        )
    }

    const Header_content_1 = () => {
        return (
            <>
                <Go_back_icon />
                <div className="create-header-text">{selected_file_name}</div>
                <div className="create-header-next" onClick={()=>{handle_post()}}>Post</div>
            </>
        )
    }


    return (
        <div className="popup">
            {(window.innerWidth <= 1000 && post_stage === 0) ? <Close_icon /> : window.innerWidth > 1000 && <Close_icon />}
            
            <div className="create" onClick={()=>{close_popup()}}>
                <div className="create-inner container" onClick={(e)=>{e.stopPropagation()}}>
                    <div className="create-header" id="create-header">
                        {post_stage === 0 ? <Header_content_0 /> : post_stage === 1 && <Header_content_1 />}
                    </div>
                    <div className="create-body">
                        <Create_body_icon />
                        <input type="file" id='create-body-file-input' accept="image/*,video/*" style={{'display' : 'none'}}/>
                        <div className="create-body-icon" onClick={()=>{handle_create_button()}}>Select from computer</div>
                        <img className="create-body-image" id="selectedImage" alt="Selected Image" />
                        {/* <video className="create-body-video" id="selectedVideo" controls></video> */}
                    </div>
                </div>
            </div>
        </div>
    )



}

export default Popup_create