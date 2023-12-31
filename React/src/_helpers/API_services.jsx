// Redux
import { useSelector, useDispatch } from 'react-redux'
import { set_user_details } from '../redux/slices/user_details_redux'

// Other
import axios from "axios"
import Domain_functions from "./domain"


// Functions

const API_services = () => {

    // Redux
    const user_details_redux = useSelector((state) => state.user_details_redux.data)
    const dispatch = useDispatch()

    // Hooks
    const Domain = Domain_functions()

    const Get_token = async (data) => {
    
        axios.defaults.withCredentials = true
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: `${Domain.Get_API_URL()}account/token.php`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                data: data,
            }).then((res) => {
                res = res.data
                if(res === false){
                    resolve(false)
                }else{
                    dispatch(set_user_details(res))
                    resolve(true)
                }
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    const Sign_in = async (data) => {
    
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${Domain.Get_API_URL()}account/signin.php`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                data: data,
            }).then((res) => {
                res = res.data
                // console.log(res)
                if(res.is_successfull === 1){
                    dispatch(set_user_details(res.data))
                }
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    const Sign_up = async (data) => {
    
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${Domain.Get_API_URL()}account/signup.php`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                data: data,
            }).then((res) => {
                res = res.data
                console.log(res)
                if(res.is_successfull === 1){
                    dispatch(set_user_details(res.data))
                }
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    const Get_all_posts = async (data) => {
    
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: `${Domain.Get_API_URL()}content/posts.php`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                // data: data,
            }).then((res) => {
                res = res.data
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    const Do_post = async (data) => {
    
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${Domain.Get_API_URL()}action/post.php`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                data: data,
            }).then((res) => {
                res = res.data
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    const Logout = async (data) => {
    
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: `${Domain.Get_API_URL()}action/logout.php`,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem("_token")}`,
                },
                data: data,
            }).then((res) => {
                res = res.data
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    return {
        Get_token,
        Sign_in,
        Sign_up,
        Get_all_posts,
        Do_post,
        Logout,
    }

}

// Export
export default API_services