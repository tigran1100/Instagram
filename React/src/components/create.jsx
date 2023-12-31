// React
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// API services
import API_services_function from "../_helpers/api_services"

// Css
import "../css/components/create.css"



const Create = () => {

    // States
    const [popup_status, set_popup_status] = useState({open : false})
    const [create_details, set_create_details] = useState({stage : 0, file_name : null, file_url : null, file_data : null})

    // Hooks
    const navigate = useNavigate()
    const API_services = API_services_function()

    // Components
    const Render = () => {
        
        // Icons
        const Close_icon = () => {return(<svg onClick={()=>{Close()}} className="create-close-icon" aria-label="Close" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Close</title><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg>)}
        const Create_body_icon = () => {return(<svg className="create-body-icon" aria-label="Icon to represent media such as images or videos" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><title>Icon to represent media such as images or videos</title><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>)}
        const Go_back_icon = () => {return(<svg onClick={()=>{go_back()}} className="create-header-back" aria-label="Back" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>)}

        // Functions
        const do_select = () => {
            if(create_details.stage === 0){
                let file_input = document.getElementById('create-body-file-input')
                file_input.click()
                file_input.onchange = () => {
                    if (file_input.files && file_input.files[0]) {
                        let fileSizeInMB = file_input.files[0].size / (1024 * 1024);
                        if (fileSizeInMB > 20) {
                            alert("File size exceeds 20MB. Please choose a smaller file.");
                            return;
                        }

                        let fileName = file_input.files[0].name
                        fileName = fileName.length > 50 ? fileName.substring(0, 50) + '...' : fileName;

                        let reader = new FileReader()
                        reader.onload = function (e) {
                            if (file_input.files[0].type.startsWith('image')) {
                                set_create_details({stage : 1, file_name : fileName, file_url : e.target.result, file_data : file_input.files[0]})
                            }    
                        }
                        reader.readAsDataURL(file_input.files[0])
                    }
                }
            }
        }


        const go_back = () => {
            set_create_details({stage : 0, file_name : null, file_url : null, file_data : null})
        }

        const do_post = () => {

            if(create_details.file_url){
                API_services.Do_post({base64 : create_details.file_url}).then(res => {
                    if(res === true){
                        Close()
                    }else if(res === false){
                        go_back()
                    }
                }).catch(err => {
                    console.warn(err)
                })
            }
        }

        return (
            <>
                {
                    popup_status.open === true && (
                        <div className="create" onClick={()=>{Close()}}>
                            <div className="create-inner container" onClick={(e)=>{e.stopPropagation()}}>
                                <div className="create-header">
                                    {
                                        create_details.stage === 0 ? (
                                            <>
                                                <div className="create-header-text">Create new post</div>
                                                <Close_icon />
                                            </>
                                        ) : create_details.stage === 1 && (
                                            <>
                                                <Go_back_icon />
                                                <div className="create-header-text">{create_details.file_name}</div>
                                                <div className="create-header-next" onClick={()=>{do_post()}}>Post</div>
                                            </>
                                        )
                                    }
                                </div>
                                <div className="create-body">
                                    {
                                        create_details.stage === 0 ? (
                                            <>
                                                <Create_body_icon />
                                                <input type="file" className='create-body-file-input' id='create-body-file-input' accept="image/*"/>
                                                <div className="create-body-button" onClick={()=>{do_select()}}>Select from computer</div>
                                            </>
                                        ) : create_details.stage === 1 && (
                                            <img className="create-body-image" id="selectedImage" alt="Selected Image" src={create_details.file_url} />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </>
        )
    }

    const Close = () => {
        set_popup_status({open : false})
        navigate('/')
    }

    const Open = () => {
        set_popup_status({open : true})
        set_create_details({stage : 0, file_name : null, file_url : null, file_data : null})
    }

    return {
        Render,
        Close,
        Open,
    }
}

export default Create