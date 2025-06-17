import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import RoomsProvider from './contexts/RoomsContext'
import ContentProvider from './contexts/ContentContext'

// Import template css files
import './assets/css/plugins.css'
import './assets/css/style.css'
import './assets/css/custom-room-hover.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <RoomsProvider>
                <ContentProvider>
                    <App />
                </ContentProvider>
            </RoomsProvider>
            {/* <h1>Hello World</h1> */}
        </BrowserRouter>
    </React.StrictMode>,
) 