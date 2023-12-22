let API_url = process.env.REACT_APP_API_URL

const Domain = () => {
    const  Get_API_URL = () => {
        return(API_url ? API_url : "")
    }

    return {
        Get_API_URL,
    }
}

export default Domain