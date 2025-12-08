import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// HTMLの #root 要素に React アプリをマウント
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)