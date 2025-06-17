import { Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Rooms from './pages/Rooms'
import Rooms2 from './pages/Rooms2'
import Rooms3 from './pages/Rooms3'
import Rooms4 from './pages/Rooms4'
import Spa from './pages/Spa'
import Events from './pages/Events'
import MeetingHall from './pages/MeetingHall'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import RoomSingle from './pages/RoomSingle'
import RoomSingle2 from './pages/RoomSingle2'
import RoomSingle3 from './pages/RoomSingle3'
import Restaurant from './pages/Restaurant'
import Blog from './pages/Blog'
import BlogSingle from './pages/BlogSingle'
import Contact from './pages/Contact'
import ComingSoon from './pages/ComingSoon'
import Loader from './components/Loader'
import { useEffect } from 'react'
import { AboutProvider } from './contexts/AboutContext'

import './App.css'

function App() {
    // Force initial loading state
    useEffect(() => {
        // Add a class to the body to indicate initial loading
        document.body.classList.add('page-loading')

        // Remove the class after a delay
        const timer = setTimeout(() => {
            document.body.classList.remove('page-loading')
        }, 2500)

        return () => {
            clearTimeout(timer)
            document.body.classList.remove('page-loading')
        }
    }, [])

    return (
        <AboutProvider>
            {/* Loader component will show on page navigation */}
            <Loader />

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="rooms" element={<Rooms4 />} />
                    <Route path="rooms2" element={<Rooms2 />} />
                    <Route path="rooms3" element={<Rooms3 />} />
                    <Route path="rooms4" element={<Rooms4 />} />
                    <Route path="spa" element={<Spa />} />
                    <Route path="events" element={<Events />} />
                    <Route path="meeting-hall" element={<MeetingHall />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="room-single/:id" element={<RoomSingle />} />
                    <Route path="room-single" element={<RoomSingle />} />
                    <Route path="room-single2" element={<RoomSingle2 />} />
                    <Route path="room-single3" element={<RoomSingle3 />} />
                    <Route path="restaurant" element={<Restaurant />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog-single" element={<BlogSingle />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
                <Route path="coming-soon" element={<ComingSoon />} />
            </Routes>
        </AboutProvider>
    )
}

export default App 