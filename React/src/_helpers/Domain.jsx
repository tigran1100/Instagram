let API_url
if(window.location.hostname === "localhost"){
    API_url = process.env.REACT_APP_API_URL
}else{
    API_url = process.env.REACT_APP_API_URL_PRODUCTION
}

const Domain = () => {
    const  Get_API_URL = () => {
        return(API_url ? API_url : "")
    }

    return {
        Get_API_URL,
    }
}

export default Domain