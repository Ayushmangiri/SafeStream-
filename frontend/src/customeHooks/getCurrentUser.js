import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { serverUrl } from "../main.jsx"
import { setUserData } from "../redux/userSlice.js"


const getCurrentUser=()=>{
    // console.log("hello")
    const dispatch=useDispatch()
    useEffect(()=>{
     const fetchUser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/v1/users/profile`,{withCredentials:true})
            // console.log("hello")
            dispatch(setUserData(result.data?.user))
        } catch (error) {
            console.log("getCurrentUser error:",error);
            dispatch(setUserData(null))
        }
     }
      fetchUser()
    },[])
}

export default getCurrentUser