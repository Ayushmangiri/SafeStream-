import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userData:null,
    allPosts:[],
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData:(state,action)=>{
          state.userData=action.payload
        },
        setAllPosts:(state,action)=>{
          state.allPosts=action.payload
        }
    }
})

export const {setUserData, setAllPosts} = userSlice.actions
export default userSlice.reducer