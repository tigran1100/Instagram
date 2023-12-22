// Other
import axios from "axios"
import Domain_functions from "./Domain"


// Functions

const API_services = () => {

    // Hooks
    const Domain = Domain_functions()

    const Api_request = async (data) => {
    
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: `${Domain.Get_API_URL()}/Api_request`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                data: data,
            }).then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    return {
        Api_request,
    }

}

// Export
export default API_services