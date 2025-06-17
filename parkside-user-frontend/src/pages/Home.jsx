import { useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { RoomsContext } from '../contexts/RoomsContext'
import { ContentContext } from '../contexts/ContentContext'

const Home = () => {
    const dateInputRef = useRef(null)
    const roomsContext = useContext(RoomsContext)
    const { rooms, featuredRooms, loading: roomsLoading, error: roomsError, roomCategories, initialized: roomsInitialized, fetchRooms, fetchRoomById, fetchRoomsByCategory, searchRooms, formatPrice, getRoomImageUrl } = roomsContext

    // Get content from ContentContext
    const contentContext = useContext(ContentContext)
    const { homeContent, loading: contentLoading, error: contentError, initialized: contentInitialized } = contentContext

    // Debug the rooms data
    useEffect(() => {
        if (roomsInitialized && featuredRooms) {
            console.log('Featured rooms count:', featuredRooms.length);
            console.log('Featured rooms data:', featuredRooms);
            console.log('All rooms count:', rooms.length);
        }
    }, [roomsInitialized, featuredRooms, rooms]);

    // Set background images when content is loaded
    useEffect(() => {
        if (homeContent && contentInitialized) {
            // Set background images
            const bgElements = document.querySelectorAll('[data-bg]')
            bgElements.forEach(element => {
                const bgImage = element.getAttribute('data-bg')
                if (bgImage) {
                    element.style.backgroundImage = `url(${bgImage})`
                }
            })
        }
    }, [homeContent, contentInitialized])

    // Initialize Swiper for rooms carousel
    useEffect(() => {
        if (roomsInitialized && featuredRooms && featuredRooms.length > 0) {
            // Wait for DOM to be updated with the rooms
            setTimeout(() => {
                // Check if Swiper exists in global scope (from scripts.js)
                if (window.Swiper && document.querySelector(".rooms-carousel .swiper-container")) {
                    try {
                        // Initialize rooms carousel
                        const roomsCarousel = new window.Swiper(".rooms-carousel .swiper-container", {
                            preloadImages: true,
                            loop: true,
                            centeredSlides: false,
                            freeMode: false,
                            slidesPerView: 3,
                            spaceBetween: 10,
                            grabCursor: true,
                            mousewheel: false,
                            speed: 1400,
                            navigation: {
                                nextEl: '.rc-button-next',
                                prevEl: '.rc-button-prev',
                            },
                            pagination: {
                                el: '.ss-slider-pagination',
                                clickable: true,
                            },
                            breakpoints: {
                                1564: {
                                    slidesPerView: 2,
                                },
                                640: {
                                    slidesPerView: 1,
                                },
                            }
                        });

                        // Set background images for room carousel after initialization
                        setTimeout(() => {
                            const roomBgElements = document.querySelectorAll('.rooms-carousel [data-bg]')
                            roomBgElements.forEach(element => {
                                const bgImage = element.getAttribute('data-bg')
                                if (bgImage) {
                                    element.style.backgroundImage = `url(${bgImage})`
                                }
                            })
                        }, 100);

                        console.log('Rooms carousel initialized successfully');
                    } catch (error) {
                        console.error('Error initializing rooms carousel:', error);
                    }
                }
            }, 500); // Give time for React to render the room elements
        }
    }, [roomsInitialized, featuredRooms]);

    // Custom loader component
    const Loader = () => (
        <div className="loading-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div className="loader-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    borderTop: '5px solid #fff',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                    Loading...
                </div>
                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                </style>
            </div>
        </div>
    );

    // Display the loader if either rooms or content is loading, or if neither is initialized
    if (roomsLoading || contentLoading || !roomsInitialized || !contentInitialized) {
        return <Loader />;
    }

    // Handle errors
    if (roomsError || contentError) {
        return (
            <div className="error-message" style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: 'red' 
            }}>
                Error: {roomsError || contentError}
            </div>
        );
    }

    return (
        <>
            {/* Hero section */}
            <div className="content-section parallax-section hero-section htc_single_item">
                <div className="fs-wrapper slideshow-container_wrap htc_single_item_dec">
                    <div className="multi-slideshow_fs ms-container fl-wrap full-height">
                        <div className="swiper-container full-height">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">
                                    <div className="ms-item_fs full-height fl-wrap">
                                        <div className="bg" data-bg={`http://localhost:4000${homeContent?.hero?.backgroundImage || ''}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overlay"></div>
                    <div className="dec-corner dc_lb"></div>
                    <div className="dec-corner dc_rb"></div>
                    <div className="dec-corner dc_rt"></div>
                    <div className="dec-corner dc_lt"></div>
                </div>
                <div className="container">
                    <div className="hero-title-container htc_single">
                        <div className="section-title">
                            <h4>{homeContent?.hero?.subtitle || "Enjoy your time in our Hotel with pleasure."}</h4>
                            <h2>{homeContent?.hero?.title || "Welcome to The Parkside"} <br />Premium Hotel</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                        </div>
                    </div>
                </div>
                <div className="container small-container">
                    <div className="fw-search-wrap_hero">
                        <div className="fw-search-wrap">
                            <form className="custom-form" name="searchform">
                                <fieldset>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="date-container input-wrap">
                                                <label>Date:</label>
                                                <input
                                                    type="text"
                                                    id="res_date"
                                                    name="resdate"
                                                    ref={dateInputRef}
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="quantity">
                                                <div className="quantity_title">Rooms: </div>
                                                <div className="quantity-item">
                                                    <input type="button" value="-" className="minus" />
                                                    <input type="text" name="quantity" title="Qty" className="qty color-bg" data-min="1" data-max="10" data-step="1" defaultValue="1" readOnly />
                                                    <input type="button" value="+" className="plus" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="quantity">
                                                <div className="quantity_title">Guests: </div>
                                                <div className="quantity-item">
                                                    <input type="button" value="-" className="minus" />
                                                    <input type="text" name="quantity" title="Qty" className="qty color-bg" data-min="1" data-max="10" data-step="1" defaultValue="1" readOnly />
                                                    <input type="button" value="+" className="plus" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <button className="searchform-submit" id="searchform-submit">Search Room</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="hero-section-scroll">
                    <div className="mousey">
                        <div className="scroller"></div>
                    </div>
                </div>
                <div className="tcs-pagination_wrap">
                    <div className="svg-corner svg-corner_white" style={{ bottom: 0, right: '-38px', transform: 'rotate(90deg)' }}></div>
                    <div className="svg-corner svg-corner_white" style={{ bottom: 0, left: '-38px', transform: 'rotate(0deg)' }}></div>
                    <div className="tcs-pagination hero-slider-pag"></div>
                </div>
                <div className="hero-call-wrap">
                    <i className="fa-thin fa-phone-rotary"></i>
                    <a href="tel:+489756412322">+489756412322</a>
                </div>
                <div className="slide-progress_container">
                    <div className="slide-progress-wrap">
                        <div className="slide-progress"></div>
                    </div>
                </div>
            </div>
            {/* Hero section end */}

            {/* Content */}
            <div className="content">
                {/* Breadcrumbs */}
                <div className="breadcrumbs-wrap">
                    <div className="container">
                        <Link to="/">Home</Link><span>Home Slider</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* About section */}
                <div className="content-section" id="sec2">
                    <div className="section-dec"></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="section-title text-align_left" style={{ marginTop: '50px' }}>
                                    <h4>Enjoy your time in our Hotel</h4>
                                    <h2>About Our Hotel</h2>
                                </div>
                                <div className="text-block tb-sin">
                                    <p className="has-drop-cap">
                                        {homeContent?.about?.content ||
                                            "Qed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.Ut enim ad minima Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."}
                                    </p>
                                    <p>
                                        {homeContent?.welcome?.message ||
                                            "Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis. Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis."}
                                    </p>
                                    <Link to="/about" className="btn fl-btn">Read more About Us</Link>
                                    <div className="dc_dec-item_left"><span></span></div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="hero-image-collge-wrap">
                                    <div className="single-dec_img">
                                        <img src={`http://localhost:4000${homeContent?.hero?.backgroundImage || ''}`} className="respimg" alt="" />
                                    </div>
                                    <div className="hero_images-collage-item" style={{ width: '25%', bottom: '25px', zIndex: '15', left: '-70px' }}>
                                        <img src={`${homeContent?.featuredServices?.[0]?.image || ''}`} className="respimg" alt="" />
                                    </div>
                                    <div className="hero_images-collage-item" style={{ width: '45%', top: '-5%', zIndex: '11', right: '-120px' }}>
                                        <img src={`${homeContent?.featuredServices?.[1]?.image || ''}`} className="respimg" alt="" />
                                    </div>
                                    <div className="dc_dec-item_right"><span></span></div>
                                </div>
                            </div>
                        </div>
                        <div className="sc-dec" style={{ left: '-220px', bottom: '-100px' }}></div>
                    </div>
                    <div className="content-dec2 fs-wrapper"></div>
                    <div className="content-dec"><span></span></div>
                </div>
                {/* About section end */}

                {/* Popular Rooms section */}
                <div className="content-section dark-bg no-padding hidden-content">
                    <div className="row">
                        <div className="st-gallery">
                            <div className="section-title">
                                <h4>Special selection</h4>
                                <h2>Popular Rooms And Suites</h2>
                                <div className="section-separator sect_se_transparent"><span><i className="fa-thin fa-gem"></i></span></div>
                                <Link to="/rooms" className="stg_link">View All Rooms</Link>
                            </div>
                            <div className="map-dec2"></div>
                            <div className="footer-separator fs_sin"><span></span></div>
                        </div>
                        <div className="col-lg-3"></div>
                        <div className="col-lg-9">
                            <div className="rooms-carousel-wrap">
                                <div className="rooms-carousel full-height">
                                    <div className="swiper-container">
                                        <div className="swiper-wrapper">
                                            {
                                                featuredRooms && featuredRooms.map((room, index) => (
                                                    <div className="swiper-slide" key={`room-${room._id}-${index}`}>
                                                        <div className="rooms-carousel-item full-height">
                                                            <div className="bg-wrap bg-parallax-wrap-gradien fs-wrapper">
                                                                <div className="bg" data-bg={`http://localhost:4000/uploads/rooms/${room?.images?.[0] || ''}`} data-swiper-parallax="10%"></div>
                                                            </div>
                                                            <div className="rooms-carousel-item_container">
                                                                <h3><Link to={`/room-single/${room?._id}`}>{room?.name}</Link></h3>
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare sem sed quam tempus aliquet vitae eget dolor.</p>
                                                                <div className="room-card-details">
                                                                    <ul>
                                                                        <li><i className="fa-light fa-user"></i><span>{room?.capacity} Guest</span></li>
                                                                        <li><i className="fa-light fa-bed-front"></i><span>{room?.bedType} Bed</span></li>
                                                                        <li><i className="fa-light fa-bath"></i><span>1 Bath</span></li>
                                                                    </ul>
                                                                    <div className="grid-item_price">
                                                                        <span>${room?.price}/Night</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="like-btn"><i className="fa-light fa-heart"></i> <span>Add to Wislist</span></div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="rc-controls-wrap">
                                    <div className="rc-button rc-button-prev"><i className="fa-solid fa-caret-left"></i></div>
                                    <div className="rc-button rc-button-next"><i className="fa-solid fa-caret-right"></i></div>
                                </div>
                                <div className="sc-controls fwc_pag2">
                                    <div className="ss-slider-pagination"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Popular Rooms section end */}

                {/* Services section */}
                <div className="content-section">
                    <div className="container">
                        <div className="section-title">
                            <h4>Enjoy your time in our Hotel with pleasure.</h4>
                            <h2>Hotels Extra Services</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                        </div>
                        <div className="cards-wrap">
                            <div className="row">
                                {/* Dynamically render featured services from content */}
                                {homeContent?.featuredServices && homeContent.featuredServices.length > 0 ? (
                                    homeContent.featuredServices
                                        .sort((a, b) => a.order - b.order)
                                        .map((service, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="content-inner fl-wrap">
                                                    <div className="content-front">
                                                        <div className="cf-inner">
                                                            <div className="fs-wrapper">
                                                                <div className="bg" data-bg={`${service?.image || ''}`}></div>
                                                                <div className="overlay overlay-bold"></div>
                                                            </div>
                                                            <div className="inner">
                                                                <h2>{service.title}</h2>
                                                                <h4>{service.subtitle || ""}</h4>
                                                                <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                                                            </div>
                                                            <div className="serv-num">{(index + 1).toString().padStart(2, '0')}.</div>
                                                        </div>
                                                    </div>
                                                    <div className="content-back">
                                                        <div className="cf-inner">
                                                            <div className="inner">
                                                                <div className="dec-icon">
                                                                    <i className={service.iconClass || "fa-light fa-spa"}></i>
                                                                </div>
                                                                <p>{service.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    // Default services if none are found in content
                                    <>
                                        {/* Service item */}
                                        <div className="col-lg-4">
                                            <div className="content-inner fl-wrap">
                                                <div className="content-front">
                                                    <div className="cf-inner">
                                                        <div className="fs-wrapper">
                                                            <div className="bg" data-bg="/src/assets/images/services/1.jpg"></div>
                                                            <div className="overlay overlay-bold"></div>
                                                        </div>
                                                        <div className="inner">
                                                            <h2>Spa And Wellness</h2>
                                                            <h4>Start Relax better</h4>
                                                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                                                        </div>
                                                        <div className="serv-num">01.</div>
                                                    </div>
                                                </div>
                                                <div className="content-back">
                                                    <div className="cf-inner">
                                                        <div className="inner">
                                                            <div className="dec-icon">
                                                                <i className="fa-light fa-spa"></i>
                                                            </div>
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Service item end */}

                                        {/* Service item */}
                                        <div className="col-lg-4">
                                            <div className="content-inner fl-wrap">
                                                <div className="content-front">
                                                    <div className="cf-inner">
                                                        <div className="fs-wrapper">
                                                            <div className="bg" data-bg="/src/assets/images/services/1.jpg"></div>
                                                            <div className="overlay overlay-bold"></div>
                                                        </div>
                                                        <div className="inner">
                                                            <h2>Indoor Swimming Pool</h2>
                                                            <h4>Quality is the heart</h4>
                                                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                                                        </div>
                                                        <div className="serv-num">02.</div>
                                                    </div>
                                                </div>
                                                <div className="content-back">
                                                    <div className="cf-inner">
                                                        <div className="inner">
                                                            <div className="dec-icon">
                                                                <i className="fa-thin fa-water-ladder"></i>
                                                            </div>
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Service item end */}

                                        {/* Service item */}
                                        <div className="col-lg-4">
                                            <div className="content-inner fl-wrap">
                                                <div className="content-front">
                                                    <div className="cf-inner">
                                                        <div className="fs-wrapper">
                                                            <div className="bg" data-bg="/src/assets/images/services/1.jpg"></div>
                                                            <div className="overlay overlay-bold"></div>
                                                        </div>
                                                        <div className="inner">
                                                            <h2>The Restaurant Center</h2>
                                                            <h4>Hot & ready to serve</h4>
                                                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                                                        </div>
                                                        <div className="serv-num">03.</div>
                                                    </div>
                                                </div>
                                                <div className="content-back">
                                                    <div className="cf-inner">
                                                        <div className="inner">
                                                            <div className="dec-icon">
                                                                <i className="fa-thin fa-pot-food"></i>
                                                            </div>
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Service item end */}
                                    </>
                                )}
                            </div>
                            <div className="dc_dec-item_left"><span></span></div>
                            <div className="dc_dec-item_right"><span></span></div>
                        </div>
                        <Link to="/contact" className="dwonload_btn">Get In touch With Us</Link>
                        <div className="sc-dec" style={{ left: '-220px', bottom: '-100px' }}></div>
                        <div className="sc-dec2" style={{ right: '-220px', top: '-100px' }}></div>
                    </div>
                    <div className="content-dec2 fs-wrapper"></div>
                    <div className="content-dec"><span></span></div>
                </div>
                {/* Services section end */}
            </div>
            {/* Content end */}
        </>
    )
}

export default Home 