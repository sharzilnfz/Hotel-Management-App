import { Link, useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { RoomsContext } from '../contexts/RoomsContext'

const RoomSingle = () => {
    const [quantity, setQuantity] = useState(1);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarRooms, setSimilarRooms] = useState([]);
    const { id } = useParams();
    const roomsContext = useContext(RoomsContext);
    const { rooms, fetchRoomById, formatPrice, getRoomImageUrl } = roomsContext;

    useEffect(() => {
        const loadRoomData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const roomData = await fetchRoomById(id);
                    setRoom(roomData);

                    // Find similar rooms (same category or type, but not the current room)
                    if (rooms && rooms.length > 0 && roomData) {
                        const similar = rooms.filter(r =>
                            r._id !== roomData._id &&
                            (r.category === roomData.category || r.type === roomData.type)
                        ).slice(0, 3); // Limit to 3 similar rooms

                        // If we don't have enough similar rooms by category/type, add others
                        if (similar.length < 3) {
                            const additional = rooms.filter(r =>
                                r._id !== roomData._id &&
                                !similar.find(s => s._id === r._id)
                            ).slice(0, 3 - similar.length);

                            setSimilarRooms([...similar, ...additional]);
                        } else {
                            setSimilarRooms(similar);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading room data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRoomData();
    }, [id, fetchRoomById, rooms]);

    useEffect(() => {
        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })
    }, [room]);

    // Initialize Swiper for room image gallery
    useEffect(() => {
        if (room && room.images && room.images.length > 0) {
            // Wait for DOM to be updated with the room images
            setTimeout(() => {
                // Check if Swiper exists in global scope (from scripts.js)
                if (window.Swiper && document.querySelector(".single-carousel .swiper-container")) {
                    try {
                        // Destroy any existing Swiper instance first
                        const existingSwiper = document.querySelector('.single-carousel .swiper-container');
                        if (existingSwiper && existingSwiper.swiper) {
                            existingSwiper.swiper.destroy();
                        }

                        // Check if we have enough images for loop
                        const hasEnoughImagesForLoop = room.images.length >= 3;

                        // Initialize room image carousel
                        const roomImageCarousel = new window.Swiper(".single-carousel .swiper-container", {
                            preloadImages: false,
                            slidesPerView: 1,
                            spaceBetween: 0,
                            loop: hasEnoughImagesForLoop, // Only enable loop if we have 3+ images
                            autoHeight: true,
                            grabCursor: true,
                            mousewheel: false,
                            centeredSlides: true,
                            watchSlidesProgress: true,
                            watchSlidesVisibility: true,
                            pagination: {
                                el: '.ss-slider-pagination',
                                clickable: true,
                                dynamicBullets: true,
                            },
                            navigation: {
                                nextEl: '.fw-carousel-button-next',
                                prevEl: '.fw-carousel-button-prev',
                            },
                            on: {
                                init: function() {
                                    // Hide navigation buttons if only one image
                                    if (room.images.length <= 1) {
                                        const prevBtn = document.querySelector('.fw-carousel-button-prev');
                                        const nextBtn = document.querySelector('.fw-carousel-button-next');
                                        const pagination = document.querySelector('.ss-slider-pagination');
                                        
                                        if (prevBtn) prevBtn.style.display = 'none';
                                        if (nextBtn) nextBtn.style.display = 'none';
                                        if (pagination) pagination.style.display = 'none';
                                    } else {
                                        const prevBtn = document.querySelector('.fw-carousel-button-prev');
                                        const nextBtn = document.querySelector('.fw-carousel-button-next');
                                        const pagination = document.querySelector('.ss-slider-pagination');
                                        
                                        if (prevBtn) prevBtn.style.display = 'block';
                                        if (nextBtn) nextBtn.style.display = 'block';
                                        if (pagination) pagination.style.display = 'block';
                                    }
                                }
                            }
                        });

                        console.log('Room image carousel initialized successfully with', room.images.length, 'images');
                    } catch (error) {
                        console.error('Error initializing room image carousel:', error);
                    }
                }
            }, 500); // Give time for React to render the image elements
        }
    }, [room]);

    const handleQuantityChange = (action) => {
        if (action === 'plus' && quantity < 10) {
            setQuantity(quantity + 1);
        } else if (action === 'minus' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    // Helper function to render HTML content
    const renderHTML = (htmlContent) => {
        return { __html: htmlContent };
    };

    // Helper function to check if a room has discount
    const hasDiscount = (room) => {
        return room?.discount && room.discount.active && room.discount.publishWebsite;
    };

    // Helper function to calculate discounted price
    const calculateDiscountedPrice = (room) => {
        if (!hasDiscount(room)) return room?.price;

        const discount = room.discount;
        if (discount.type === 'percentage') {
            return room.price - (room.price * discount.value / 100);
        } else if (discount.type === 'fixed') {
            return room.price - discount.value;
        }
        return room.price;
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="content">
            {/* Custom CSS for room single image gallery */}
            <style>
                {`
                .single-carousel .swiper-container {
                    width: 100% !important;
                    overflow: hidden;
                }
                
                .single-carousel .swiper-wrapper {
                    width: 100% !important;
                    display: flex;
                    align-items: stretch;
                }
                
                .single-carousel .swiper-slide {
                    width: 100% !important;
                    flex-shrink: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .single-carousel .swiper-slide img {
                    width: 100%;
                    height: auto;
                    max-height: 600px;
                    object-fit: cover;
                    display: block;
                }
                
                .single-carousel-wrap {
                    position: relative;
                    width: 100%;
                    margin-bottom: 50px;
                }
                `}
            </style>
            
            {/* Hero Section */}
            <div className="content-section parallax-section hero-section hidden-section" data-scrollax-parent="true">
                <div
                    className="bg par-elem"
                    data-bg={room?.images?.length > 0 ? `http://localhost:4000/uploads/rooms/${room.images[0]}` : "/src/assets/images/room/1.jpg"}
                    data-scrollax="properties: { translateY: '30%' }"
                ></div>
                <div className="overlay"></div>
                <div className="container">
                    <div className="section-title">
                        <h4>Enjoy your time in our Hotel with pleasure.</h4>
                        <h2>{room?.name || "Room Details"}</h2>
                        <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                    </div>
                </div>
                <div className="hero-section-scroll">
                    <div className="mousey">
                        <div className="scroller"></div>
                    </div>
                </div>
                <div className="dec-corner dc_lb"></div>
                <div className="dec-corner dc_rb"></div>
                <div className="dec-corner dc_rt"></div>
                <div className="dec-corner dc_lt"></div>
            </div>

            {/* Breadcrumbs */}
            <div className="breadcrumbs-wrap">
                <div className="container">
                    <Link to="/">Home</Link><Link to="/rooms">Rooms</Link><span>{room?.name || "Room Details"}</span>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="content-section notp">
                <div className="section-dec"></div>
                <div className="content-dec2 fs-wrapper"></div>

                {/* Image Carousel */}
                <div className="single-carousle-container">
                    <div className="single-carousel-wrap">
                        <div className="single-carousel fl-wrap lightgallery">
                            <div className="swiper-container">
                                <div className="swiper-wrapper">
                                    {/* Carousel Images */}
                                    {room?.images?.length > 0 ? (
                                        room.images.map((image, index) => (
                                            <div className="swiper-slide hov_zoom" key={index}>
                                                <img
                                                    src={`http://localhost:4000/uploads/rooms/${image}`}
                                                    alt={`${room.name} - Image ${index + 1}`}
                                                />
                                                <a
                                                    href={`http://localhost:4000/uploads/rooms/${image}`}
                                                    className="box-media-zoom popup-image"
                                                >
                                                    <i className="fal fa-search"></i>
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback images if no room images
                                        <>
                                            <div className="swiper-slide hov_zoom">
                                                <img src="/src/assets/images/room/1.jpg" alt="Room" />
                                                <a href="/src/assets/images/room/1.jpg" className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                            </div>
                                            <div className="swiper-slide hov_zoom">
                                                <img src="/src/assets/images/room/1.jpg" alt="Room" />
                                                <a href="/src/assets/images/room/1.jpg" className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                            </div>
                                            <div className="swiper-slide hov_zoom">
                                                <img src="/src/assets/images/room/1.jpg" alt="Room" />
                                                <a href="/src/assets/images/room/1.jpg" className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="fw-carousel-button-prev slider-button"><i className="fa-solid fa-caret-left"></i></div>
                        <div className="fw-carousel-button-next slider-button"><i className="fa-solid fa-caret-right"></i></div>
                        <div className="sc-controls fwc_pag">
                            <div className="ss-slider-pagination"></div>
                        </div>
                    </div>
                </div>

                {/* Room Details Section */}
                <div className="container">
                    <div className="row">
                        {/* Left Column - Room Information */}
                        <div className="col-lg-8">
                            <div className="dec-container">
                                <div className="dc_dec-item_left"><span></span></div>
                                <div className="text-block">
                                    <div className="text-block-title">
                                        <h4>About Accommodation</h4>
                                        <div className="sr-opt">
                                            {hasDiscount(room) ? (
                                                <div className="sa-price">
                                                    <span style={{ textDecoration: 'line-through', fontSize: '14px', marginRight: '8px', opacity: '0.7' }}>
                                                        {formatPrice ? formatPrice(room.price) : `$${room?.price}`}
                                                    </span>
                                                    {formatPrice ? formatPrice(calculateDiscountedPrice(room)) : `$${calculateDiscountedPrice(room)}`}/Night
                                                </div>
                                            ) : (
                                                <div className="sa-price">{formatPrice ? formatPrice(room?.price) : `$${room?.price}`}/Night</div>
                                            )}
                                            <div className="sa_towishlist">Add to Wishlist</div>
                                        </div>
                                    </div>

                                    {/* Discount Badge */}
                                    {hasDiscount(room) && (
                                        <div style={{
                                            background: '#ff5722',
                                            color: 'white',
                                            padding: '5px 12px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            marginBottom: '15px',
                                            fontSize: '14px'
                                        }}>
                                            {room.discount.name}: {room.discount.type === 'percentage' ? `${room.discount.value}% off` : `$${room.discount.value} off`}
                                        </div>
                                    )}

                                    {/* Room Features */}
                                    <div className="room-card-details rcd-single">
                                        <ul>
                                            <li><i className="fa-light fa-crop"></i><span>44m2</span></li>
                                            <li><i className="fa-light fa-user"></i><span>{room?.capacity || 2} Guest</span></li>
                                            <li><i className="fa-light fa-bed-front"></i><span>{room?.bedType || "Standard"} Bed</span></li>
                                            <li><i className="fa-light fa-bath"></i><span>Private Bath</span></li>
                                        </ul>
                                    </div>

                                    {/* Room Description */}
                                    <div className="text-block-container">
                                        {room?.description ? (
                                            <div className="has-drop-cap" dangerouslySetInnerHTML={renderHTML(room.description)}></div>
                                        ) : (
                                            <>
                                                <p className="has-drop-cap">Qraesent eros turpis, commodo vel justo at, pulvinar mollis eros. Mauris aliquet eu quam id ornare. Morbi ac quam enim. Cras vitae nulla condimentum, semper dolor non, faucibus dolor. Vivamus adipiscing eros quis orci fringilla, sed pretium lectus viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec nec velit non odio aliquam suscipit. Sed non neque faucibus, condimentum lectus at, accumsan enim.</p>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam erat volutpat. Curabitur convallis fringilla diam sed aliquam. Sed tempor iaculis massa faucibus feugiat. In fermentum facilisis massa, a consequat purus viverra.</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="tbc-separator"></div>

                                    {/* Room Amenities */}
                                    <div className="tbc_subtitle">Room Amenities</div>
                                    <div className="meg_aminites">
                                        <div className="row">
                                            {room?.amenities && room.amenities.length > 0 ? (
                                                room.amenities.map((amenity, index) => (
                                                    <div className="col-lg-4" key={index}>
                                                        <div className="meg_aminites_item">
                                                            <i className={`fa-light fa-${getAmenityIcon(amenity)}`}></i>
                                                            <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <div className="col-lg-4">
                                                        <div className="meg_aminites_item"><i className="fa-light fa-water-ladder"></i><span>Free Swimming Pool</span></div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="meg_aminites_item"><i className="fa-light fa-baby-carriage"></i><span>Extra Baby Bed</span></div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="meg_aminites_item"><i className="fa-light fa-dryer"></i><span>Washing Machine</span></div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="tbc-separator"></div>

                                    {/* What's Included Section */}
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="tbc_subtitle">What included in this suite?</div>
                                            <div className="text-block_list">
                                                {room?.breakfastIncluded && (
                                                    <div style={{ marginBottom: '15px', color: '#4CAF50' }}>
                                                        <i className="fa-light fa-check-circle" style={{ marginRight: '5px' }}></i>
                                                        <strong>Breakfast Included</strong>
                                                    </div>
                                                )}

                                                {room?.isRefundable && (
                                                    <div style={{ marginBottom: '15px', color: '#4CAF50' }}>
                                                        <i className="fa-light fa-check-circle" style={{ marginRight: '5px' }}></i>
                                                        <strong>Refundable</strong>
                                                    </div>
                                                )}

                                                {room?.refundPolicy && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                        <strong>Refund Policy:</strong>
                                                        <div dangerouslySetInnerHTML={renderHTML(room.refundPolicy)}></div>
                                                    </div>
                                                )}

                                                <div>
                                                    <strong>Check-in:</strong> {room?.checkInTime || "14:00"}
                                                </div>
                                                <div>
                                                    <strong>Check-out:</strong> {room?.checkOutTime || "12:00"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="tbc_subtitle">Room Video Presentation</div>
                                            <div className="video-box">
                                                <img src={room?.images?.length > 0 ? `http://localhost:4000/uploads/rooms/${room.images[0]}` : "/src/assets/images/room/1.jpg"} className="respimg" alt="" />
                                                <div className="overlay"></div>
                                                <div className="video-box-btn image-popup color-bg" id="html5-videos"><i className="fas fa-play"></i></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tbc-separator"></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking Form */}
                        <div className="col-lg-4">
                            <div className="fix-bar-init">
                                <div className="fw-search-wrap">
                                    <div className="fw-search-wrap-title">Book This Suite</div>
                                    <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                                    <form className="custom-form">
                                        <fieldset>
                                            <div className="input-wrap">
                                                <label>Your Name:</label>
                                                <input type="text" placeholder="Your Name *" defaultValue="" />
                                            </div>
                                            <div className="input-wrap">
                                                <label>Phone:</label>
                                                <input type="text" placeholder="Your Phone" defaultValue="" />
                                            </div>
                                            <div className="date-container input-wrap">
                                                <label>Date:</label>
                                                <input type="text" id="res_date" name="resdate" defaultValue="" />
                                            </div>
                                            <div className="quantity input-wrap">
                                                <div className="quantity_title">Guests: </div>
                                                <div className="quantity-item">
                                                    <input type="button" value="-" className="minus" onClick={() => handleQuantityChange('minus')} />
                                                    <input
                                                        type="text"
                                                        name="quantity"
                                                        title="Qty"
                                                        className="qty color-bg"
                                                        value={quantity}
                                                        readOnly
                                                    />
                                                    <input type="button" value="+" className="plus" onClick={() => handleQuantityChange('plus')} />
                                                </div>
                                            </div>
                                            <button className="searchform-submit bs_btn">Book Your Stay</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="limit-box"></div>

                    {/* Similar Rooms Section */}
                    <div className="post-related">
                        <div className="post-related_title">
                            <h6>Similar Rooms</h6>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                        </div>
                        <div className="row">
                            {similarRooms && similarRooms.length > 0 ? (
                                similarRooms.map((similarRoom, index) => (
                                    <div className="item-related col-lg-4" key={similarRoom._id || index}>
                                        <Link to={`/room-single/${similarRoom._id}`} className="item-related_img">
                                            <img
                                                src={similarRoom.images?.length > 0
                                                    ? `http://localhost:4000/uploads/rooms/${similarRoom.images[0]}`
                                                    : "/src/assets/images/room/1.jpg"}
                                                className="respimg"
                                                alt={similarRoom.name}
                                            />
                                            <div className="overlay"></div>
                                            <span>View Details</span>
                                        </Link>
                                        <h3><Link to={`/room-single/${similarRoom._id}`}>{similarRoom.name}</Link></h3>

                                        {hasDiscount(similarRoom) ? (
                                            <span className="post-date post-price">
                                                <span style={{ textDecoration: 'line-through', fontSize: '14px', marginRight: '5px', opacity: '0.7' }}>
                                                    {formatPrice ? formatPrice(similarRoom.price) : `$${similarRoom.price}`}
                                                </span>
                                                {formatPrice ? formatPrice(calculateDiscountedPrice(similarRoom)) : `$${calculateDiscountedPrice(similarRoom)}`}/Night
                                            </span>
                                        ) : (
                                            <span className="post-date post-price">
                                                {formatPrice ? formatPrice(similarRoom.price) : `$${similarRoom.price}`}/Night
                                            </span>
                                        )}

                                        <div className="room-card-details">
                                            <ul>
                                                <li><i className="fa-light fa-user"></i><span>{similarRoom.capacity || 1} Guest</span></li>
                                                <li><i className="fa-light fa-bed-front"></i><span>{similarRoom.bedType || '1'} Bed</span></li>
                                                <li><i className="fa-light fa-bath"></i><span>1 Bath</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback if no similar rooms found
                                <>
                                    <div className="item-related col-lg-4">
                                        <Link to="/room-single" className="item-related_img">
                                            <img src="/src/assets/images/room/1.jpg" className="respimg" alt="" />
                                            <div className="overlay"></div>
                                            <span>View Details</span>
                                        </Link>
                                        <h3><Link to="/room-single">Premium Panorama Room</Link></h3>
                                        <span className="post-date post-price">$230/Night</span>
                                        <div className="room-card-details">
                                            <ul>
                                                <li><i className="fa-light fa-user"></i><span>1 Guest</span></li>
                                                <li><i className="fa-light fa-bed-front"></i><span>1 Bed</span></li>
                                                <li><i className="fa-light fa-bath"></i><span>1 Bath</span></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="item-related col-lg-4">
                                        <Link to="/room-single" className="item-related_img">
                                            <img src="/src/assets/images/room/1.jpg" className="respimg" alt="" />
                                            <div className="overlay"></div>
                                            <span>View Details</span>
                                        </Link>
                                        <h3><Link to="/room-single">Beach Villa Room</Link></h3>
                                        <span className="post-date post-price">$321/Night</span>
                                        <div className="room-card-details">
                                            <ul>
                                                <li><i className="fa-light fa-user"></i><span>1 Guest</span></li>
                                                <li><i className="fa-light fa-bed-front"></i><span>1 Bed</span></li>
                                                <li><i className="fa-light fa-bath"></i><span>1 Bath</span></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="item-related col-lg-4">
                                        <Link to="/room-single" className="item-related_img">
                                            <img src="/src/assets/images/room/1.jpg" className="respimg" alt="" />
                                            <div className="overlay"></div>
                                            <span>View Details</span>
                                        </Link>
                                        <h3><Link to="/room-single">Superior Panorama Room</Link></h3>
                                        <span className="post-date post-price">$143/Night</span>
                                        <div className="room-card-details">
                                            <ul>
                                                <li><i className="fa-light fa-user"></i><span>1 Guest</span></li>
                                                <li><i className="fa-light fa-bed-front"></i><span>1 Bed</span></li>
                                                <li><i className="fa-light fa-bath"></i><span>1 Bath</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-dec"><span></span></div>
        </div>
    )
}

// Helper function to get appropriate icon for each amenity
const getAmenityIcon = (amenity) => {
    const iconMap = {
        'wifi': 'wifi',
        'ac': 'air-conditioner',
        'balcony': 'door-open',
        'minibar': 'champagne-glasses',
        'tv': 'tv',
        'safe': 'vault',
        'workspace': 'desk',
        'swimming': 'water-ladder',
        'spa': 'spa',
        'gym': 'dumbbell',
        'breakfast': 'utensils',
        'parking': 'car',
        'restaurant': 'pot-food',
        'bar': 'glass-martini',
        'bathtub': 'bath'
    };

    // Try to find a match in our icon map
    for (const [key, value] of Object.entries(iconMap)) {
        if (amenity.toLowerCase().includes(key)) {
            return value;
        }
    }

    // Default icon
    return 'check-circle';
};

export default RoomSingle 