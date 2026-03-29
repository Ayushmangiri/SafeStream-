import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import './App.css'
import getCurrentUser from './customeHooks/getCurrentUser.js';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CreatePost from './pages/createpost.jsx';
import Feed from './pages/feed.jsx';
import ModeratorDashboard from './pages/Moderator.jsx';
import Profile from './pages/myprofile.jsx';
import EditProfile from './pages/editprofile.jsx';
import MyPosts from './pages/myposts.jsx';
import getAllPosts from './customeHooks/getAllPosts.js';

function App() {
  getCurrentUser();
  getAllPosts();

  const {userData}=useSelector((state)=>state.user)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={!userData ? <Signup/> : <Navigate to='/' /> } />
        <Route path='/login' element={!userData ? <Login/> : <Navigate to='/' />} />
        <Route path='/create-post' element={userData ? <CreatePost/> : <Navigate to='/login' /> } />
        <Route path='/feed' element={userData ? <Feed/> : <Navigate to='/login' /> } />
        <Route path='/Moderator' element={userData ? <ModeratorDashboard/> : <Navigate to='/login' /> } />
        <Route path='/profile' element={userData ? <Profile/> : <Navigate to='/login' /> } />
        <Route path='/edit-profile' element={userData ? <EditProfile/> : <Navigate to='/login' /> } />
        <Route path='/my-posts' element={userData ? <MyPosts/> : <Navigate to='/login' /> } />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
        style: {
        background: "#000",
        color: "#FFD700",
        border: "1px solid #FFD700",
    }
  }}
/>
    </>
  )
}

export default App