import { useState } from 'react'
import AppRouter from "./router/AppRouter";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {

  return (
    <>
      <ToastContainer/>
      <AppRouter />
    </>
  )
}

export default App

