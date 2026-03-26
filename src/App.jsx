import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
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
