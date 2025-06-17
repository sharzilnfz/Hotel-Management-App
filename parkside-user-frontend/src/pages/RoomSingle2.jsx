import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const RoomSingle2 = () => {
    useEffect(() => {
        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })
    }, [])

    return (
        <div className="content">
            <div className="breadcrumbs-wrap">
                <div className="container">
                    <Link to="/">Home</Link><Link to="/rooms">Rooms</Link><span>Room Details Style 2</span>
                </div>
            </div>
            <div className="content-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Premium Panorama Room</h2>
                        <p>Room details in style 2 layout</p>
                    </div>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="image-gallery style2">
                                <div className="main-image">
                                    <img src="/src/assets/images/room/1.jpg" alt="Room" className="respimg" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="room-details-sidebar style2">
                                <div className="room-price">$230 / night</div>
                                <div className="room-features">
                                    <ul>
                                        <li><i className="fa-light fa-user"></i> 4 Guests</li>
                                        <li><i className="fa-light fa-bed-front"></i> 2 Beds</li>
                                        <li><i className="fa-light fa-bath"></i> 2 Baths</li>
                                        <li><i className="fa-light fa-wifi"></i> Free Wifi</li>
                                    </ul>
                                </div>
                                <div className="booking-form">
                                    <button className="btn float-btn color-bg">Book This Room</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomSingle2 