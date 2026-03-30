import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { serverUrl } from "../main.jsx"
import { setAllPosts } from "../redux/userSlice.js"


const getAllPosts=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
     const fetchUser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/v1/posts/feed`,{withCredentials:true})
            dispatch(setAllPosts(result.data?.posts))
        } catch (error) {
            console.log("getAllPosts error:",error);
            dispatch(setAllPosts(null))
        }
     }
      fetchUser()
    },[])
}

export default getAllPosts