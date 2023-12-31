// Pages
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"

// Components
import Home from "../components/home"
import Create_component from "../components/create"
import Profile from "../components/profile"

// Css
import "../css/index/index.css"

const Index = () => {

    // Hooks
    const Create = Create_component()

    // States
    const [page_details, set_page_details] = useState({on_page : 'home'})

    // Effects
    // useEffect(()=>{
    //     console.log(page_details)
    // }, [page_details])

    return (
        <>
            <div className="index">
                <Navbar page_details={page_details} set_page_details={set_page_details} Create={Create} />
                <div className="index-content">
                    {
                        page_details.on_page === 'home' ? (
                            <>
                                <Home />
                            </>
                        ) : page_details.on_page === 'profile' && (
                            <>
                                <Profile />
                            </>
                        )
                    }
                    {
                        page_details.on_page === 'create' && (
                            <>
                                {Create.Render()}
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Index