import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { RoomsContext } from '../contexts/RoomsContext'

const Rooms = () => {
    const roomsContext = useContext(RoomsContext);
    const [roomsInitialized, setRoomsInitialized] = useState(false);

    useEffect(() => {
        // Log all rooms data to console
        console.log("Rooms Page - Rooms Context:", roomsContext);
        console.log("Rooms Page - All Rooms Data:", roomsContext?.rooms);

        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })

        // Mark rooms as initialized for slider
        if (roomsContext?.rooms && roomsContext.rooms.length > 0) {
            setRoomsInitialized(true);
        }
    }, [roomsContext])

    // Initialize Swiper for rooms carousel
    useEffect(() => {
        if (roomsInitialized && roomsContext?.rooms && roomsContext.rooms.length > 0) {
            // Wait for DOM to be updated with the rooms
            setTimeout(() => {
                // Check if Swiper exists in global scope (from scripts.js)
                if (window.Swiper && document.querySelector(".rooms-list-carousel .swiper-container")) {
                    try {
                        // Destroy any existing Swiper instance first
                        const existingSwiper = document.querySelector('.rooms-list-carousel .swiper-container');
                        if (existingSwiper && existingSwiper.swiper) {
                            existingSwiper.swiper.destroy();
                        }

                        // Initialize rooms list carousel
                        const roomsListCarousel = new window.Swiper(".rooms-list-carousel .swiper-container", {
                            preloadImages: true,
                            loop: true,
                            centeredSlides: false,
                            freeMode: false,
                            slidesPerView: 3,
                            spaceBetween: 20,
                            grabCursor: true,
                            mousewheel: false,
                            speed: 1400,
                            navigation: {
                                nextEl: '.rooms-list-next',
                                prevEl: '.rooms-list-prev',
                            },
                            pagination: {
                                el: '.rooms-list-pagination',
                                clickable: true,
                            },
                            breakpoints: {
                                1200: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                            }
                        });

                        // Set background images for room carousel after initialization
                        setTimeout(() => {
                            const roomBgElements = document.querySelectorAll('.rooms-list-carousel [data-bg]')
                            roomBgElements.forEach(element => {
                                const bgImage = element.getAttribute('data-bg')
                                if (bgImage) {
                                    element.style.backgroundImage = `url(${bgImage})`
                                }
                            })
                        }, 100);

                        console.log('Rooms list carousel initialized successfully');
                    } catch (error) {
                        console.error('Error initializing rooms list carousel:', error);
                    }
                }
            }, 500); // Give time for React to render the room elements
        }
    }, [roomsInitialized, roomsContext?.rooms]);

    // Get room image URL helper
    const getRoomImageUrl = (room) => {
        if (room?.images && room.images.length > 0) {
            return `http://localhost:4000/uploads/rooms/${room.images[0]}`;
        }
        return "/src/assets/images/room/1.jpg";
    };

    // Static room data for fallback (using original static data)
    const staticRooms = [
        {
            id: 1,
            name: "Garden Family Room",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus.",
            guests: 2,
            beds: 1,
            baths: 1,
            price: 129,
            image: "/src/assets/images/room/1.jpg"
        },
        {
            id: 2,
            name: "Premium Panorama Room",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus.",
            guests: 4,
            beds: 2,
            baths: 2,
            price: 230,
            image: "/src/assets/images/room/1.jpg"
        },
        {
            id: 3,
            name: "Presidential Suite",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus.",
            guests: 6,
            beds: 3,
            baths: 2,
            price: 543,
            image: "/src/assets/images/room/1.jpg"
        },
        {
            id: 4,
            name: "Beach Villa Room",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus.",
            guests: 3,
            beds: 2,
            baths: 1,
            price: 321,
            image: "/src/assets/images/room/1.jpg"
        },
        {
            id: 5,
            name: "Deluxe Room",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus.",
            guests: 2,
            beds: 1,
            baths: 1,
            price: 190,
            image: "/src/assets/images/room/1.jpg"
        },
        {
            id: 6,
            name: "Superior Room",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus.",
            guests: 2,
            beds: 1,
            baths: 1,
            price: 160,
            image: "/src/assets/images/room/1.jpg"
        }
    ];

    // Use context rooms if available, otherwise fallback to static rooms
    const displayRooms = roomsContext?.rooms && roomsContext.rooms.length > 0 ? roomsContext.rooms : staticRooms;

    return (
        <>
            {/* Hero section */}
            <div className="content-section parallax-section hero-section">
                <div className="hero-bg">
                    <div className="bg" data-bg="/src/assets/images/bg/1.jpg"></div>
                    <div className="overlay"></div>
                </div>
                <div className="container">
                    <div className="section-title hero-section_title">
                        <h2>Our Rooms</h2>
                        <p>Explore our luxury hotel rooms and suites</p>
                        <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                    </div>
                </div>
            </div>
            {/* Hero section end */}

            {/* Content */}
            <div className="content">
                {/* Breadcrumbs */}
                <div className="breadcrumbs-wrap">
                    <div className="container">
                        <Link to="/">Home</Link><span>Rooms</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* Rooms carousel */}
                <div className="content-section">
                    <div className="container">
                        <div className="section-title">
                            <h4>Book your stay with us</h4>
                            <h2>Rooms & Suites</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                        </div>

                        {/* Rooms Carousel Container */}
                        <div className="rooms-list-carousel-wrap">
                            <div className="rooms-list-carousel">
                                <div className="swiper-container">
                                    <div className="swiper-wrapper">
                                        {displayRooms.map((room, index) => (
                                            <div className="swiper-slide" key={`room-${room._id || room.id}-${index}`}>
                                                <div className="room-box">
                                                    <div className="room-box-img fl-wrap">
                                                        <div className="bg" data-bg={getRoomImageUrl(room)}></div>
                                                        <div className="overlay"></div>
                                                    </div>
                                                    <div className="room-box-content fl-wrap">
                                                        <h3>
                                                            <Link to={`/room-single/${room._id || room.id}`}>
                                                                {room.name || room.title}
                                                            </Link>
                                                        </h3>
                                                        <p>{room.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sed quam tempus."}</p>
                                                        <div className="room-details">
                                                            <ul>
                                                                <li><i className="fa-light fa-user"></i><span>{room.capacity || room.guests} Guest{(room.capacity || room.guests) > 1 ? 's' : ''}</span></li>
                                                                <li><i className="fa-light fa-bed-front"></i><span>{room.bedType || room.beds} Bed{(room.beds) > 1 ? 's' : ''}</span></li>
                                                                <li><i className="fa-light fa-bath"></i><span>{room.bathrooms || room.baths || 1} Bath</span></li>
                                                            </ul>
                                                        </div>
                                                        <div className="room-price">${room.price || 0} / night</div>
                                                        <Link to={`/room-single/${room._id || room.id}`} className="btn fl-btn">Book Now</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Navigation buttons */}
                            <div className="rooms-list-controls-wrap">
                                <div className="rooms-list-button rooms-list-prev"><i className="fa-solid fa-caret-left"></i></div>
                                <div className="rooms-list-button rooms-list-next"><i className="fa-solid fa-caret-right"></i></div>
                            </div>
                            
                            {/* Pagination */}
                            <div className="rooms-list-pagination-wrap">
                                <div className="rooms-list-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Rooms carousel end */}
            </div>
            {/* Content end */}

            {/* Custom CSS for rooms list carousel */}
            <style>
                {`
                .rooms-list-carousel-wrap {
                    position: relative;
                    margin-top: 50px;
                }
                
                .rooms-list-carousel {
                    position: relative;
                    z-index: 1;
                    overflow: hidden;
                }
                
                .rooms-list-carousel .swiper-container {
                    width: 100%;
                    height: auto;
                    margin: 0 auto;
                    padding-bottom: 50px;
                }
                
                .rooms-list-carousel .swiper-slide {
                    width: auto !important;
                    height: auto !important;
                    display: flex !important;
                    align-items: stretch;
                }
                
                .rooms-list-carousel .room-box {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .rooms-list-carousel .room-box-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .rooms-list-controls-wrap {
                    position: absolute;
                    top: 50%;
                    right: -60px;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    transform: translateY(-50%);
                }
                
                .rooms-list-button {
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    border-radius: 50%;
                    transition: all .3s ease;
                    background: #272535;
                    z-index: 50;
                    cursor: pointer;
                    color: var(--main-color);
                    box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, .4);
                    text-align: center;
                    font-size: 18px;
                }
                
                .rooms-list-button:hover {
                    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, .4);
                    transform: scale(1.1);
                }
                
                .rooms-list-pagination-wrap {
                    text-align: center;
                    margin-top: 30px;
                }
                
                .rooms-list-pagination .swiper-pagination-bullet {
                    opacity: 1;
                    background: #ccc;
                    margin: 0 10px;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    position: relative;
                    border-radius: 100%;
                    transition: all 300ms ease-out;
                }
                
                .rooms-list-pagination .swiper-pagination-bullet:before {
                    content: '';
                    position: absolute;
                    left: -5px;
                    top: -5px;
                    right: -5px;
                    bottom: -5px;
                    border-radius: 100%;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    transition: all 300ms ease-out;
                    transform: scale(0);
                }
                
                .rooms-list-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active:before {
                    transform: scale(1.0);
                }
                
                .rooms-list-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active {
                    background: var(--main-color);
                }
                
                /* Responsive adjustments */
                @media (max-width: 1200px) {
                    .rooms-list-controls-wrap {
                        right: -50px;
                    }
                }
                
                @media (max-width: 992px) {
                    .rooms-list-controls-wrap {
                        position: static;
                        transform: none;
                        flex-direction: row;
                        justify-content: center;
                        margin-top: 20px;
                        gap: 20px;
                    }
                }
                `}
            </style>
        </>
    )
}

export default Rooms 