import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { STORAGE_KEY } from './data/model'

if (new URLSearchParams(window.location.search).has('reset')) {
  localStorage.removeItem(STORAGE_KEY)
  window.history.replaceState({}, '', window.location.pathname + window.location.hash)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
