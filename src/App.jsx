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

function App() {
  getCurrentUser();

  const {userData}=useSelector((state)=>state.user)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={!userData ? <Signup/> : <Navigate to='/' /> } />
        <Route path='/login' element={!userData ? <Login/> : <Navigate to='/' />} />
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
