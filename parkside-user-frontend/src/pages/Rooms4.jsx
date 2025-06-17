import { useEffect, useRef, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { RoomsContext } from '../contexts/RoomsContext'
import { ContentContext } from '../contexts/ContentContext'
import '../assets/css/custom-room-equal-height.css'

const Rooms4 = () => {
    const dateInputRef = useRef(null)
    const { rooms, loading, error, getRoomImageUrl, formatPrice } = useContext(RoomsContext)
    const [currentPage, setCurrentPage] = useState(1)
    const roomsPerPage = 6
    
    // Force re-render when component mounts/unmounts
    const [componentKey, setComponentKey] = useState(0)
    
    // New state for availability and search
    const [availability, setAvailability] = useState([])
    const [availabilityLoading, setAvailabilityLoading] = useState(false)
    const [availabilityError, setAvailabilityError] = useState(null)
    const [searchParams, setSearchParams] = useState({
        dateRange: '',
        rooms: 1,
        guests: 1
    })
    const [filteredRooms, setFilteredRooms] = useState([])
    
    // Fallback rooms state in case context fails
    const [fallbackRooms, setFallbackRooms] = useState([])
    const [fallbackLoading, setFallbackLoading] = useState(false)
    
    // Get content from ContentContext
    const contentContext = useContext(ContentContext)
    const { homeContent, roomsContent, loading: contentLoading, error: contentError } = contentContext

    console.log('rooms', rooms)
    console.log('availability', availability)

    // Fetch availability data
    const fetchAvailability = async () => {
        setAvailabilityLoading(true)
        try {
            const response = await fetch('http://localhost:4000/api/availability/all?serviceType=room')
            if (!response.ok) {
                throw new Error('Failed to fetch availability data')
            }
            const data = await response.json()
            if (data.success) {
                setAvailability(data.data.availabilities.room || [])
            } else {
                throw new Error('API returned error')
            }
        } catch (err) {
            setAvailabilityError(err.message)
            console.error('Error fetching availability:', err)
        } finally {
            setAvailabilityLoading(false)
        }
    }

    // Fallback fetch rooms directly if context fails
    const fetchRoomsFallback = async () => {
        setFallbackLoading(true)
        try {
            const response = await fetch('http://localhost:4000/api/rooms')
            if (!response.ok) {
                throw new Error('Failed to fetch rooms')
            }
            const data = await response.json()
            if (data.success) {
                setFallbackRooms(data.data || [])
                console.log('Fallback rooms fetched:', data.data?.length)
            }
        } catch (err) {
            console.error('Fallback room fetch failed:', err)
        } finally {
            setFallbackLoading(false)
        }
    }

    // Use context rooms or fallback to directly fetched rooms
    const effectiveRooms = (rooms && rooms.length > 0) ? rooms : fallbackRooms
    const effectiveLoading = loading || fallbackLoading

    // Filter rooms based on search criteria
    const filterRooms = () => {
        // If no date range is selected, don't filter - show all rooms
        if (!searchParams.dateRange) {
            setFilteredRooms([])
            return
        }

        const dates = searchParams.dateRange.split(' - ')
        if (dates.length !== 2) {
            setFilteredRooms([])
            return
        }

        const startDate = new Date(dates[0])
        const endDate = new Date(dates[1])
        
        // Get available rooms for the selected date range
        const availableRoomIds = new Set()
        
        availability.forEach(avail => {
            const availDate = new Date(avail.date)
            if (availDate >= startDate && availDate <= endDate && avail.available > 0) {
                availableRoomIds.add(avail.serviceId)
            }
        })

        // Filter rooms based on availability and capacity
        const filtered = effectiveRooms.filter(room => {
            const isAvailable = availableRoomIds.has(room._id) || availableRoomIds.has(room.id)
            const hasCapacity = room.capacity >= searchParams.guests
            return isAvailable && hasCapacity
        })

        setFilteredRooms(filtered)
    }

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1) // Reset to first page when searching
        filterRooms()
    }

    // Handle quantity changes
    const updateQuantity = (field, operation) => {
        setSearchParams(prev => {
            const currentValue = prev[field]
            let newValue = currentValue
            
            if (operation === 'increase') {
                newValue = Math.min(currentValue + 1, 10)
            } else {
                newValue = Math.max(currentValue - 1, 1)
            }
            
            return { ...prev, [field]: newValue }
        })
    }

    // Force rooms context to refetch data
    const { fetchRooms } = useContext(RoomsContext)
    
    useEffect(() => {
        console.log('Component mounted/remounted');
        
        // Update component key to force re-render
        setComponentKey(prev => prev + 1);
        
        // Force refetch rooms data to fix refresh issue
        if (fetchRooms) {
            console.log('Force refetching rooms...');
            fetchRooms(true); // Pass true to force fetch
        }
        
        // Also fetch rooms directly as fallback
        fetchRoomsFallback()
        
        // Fetch availability data when component mounts
        fetchAvailability()

        return () => {
            console.log('Component unmounting');
        };
    }, [])

    // Separate useEffect for datepicker initialization using daterangepicker (like in scripts.js)
    useEffect(() => {        
        // Initialize the date range picker when the component mounts
        const initializeDateRangePicker = () => {
            if (window.$ && window.$.fn.daterangepicker && dateInputRef.current) {
                try {
                    console.log('Attempting to initialize daterangepicker...');
                    
                    // Destroy existing daterangepicker if it exists
                    try {
                        window.$(dateInputRef.current).data('daterangepicker')?.remove();
                    } catch (e) {
                        // Ignore destroy errors
                    }
                    
                    // Initialize daterangepicker like in scripts.js
                    window.$(dateInputRef.current).daterangepicker({
                        autoUpdateInput: false,
                        parentEl: window.$(".date-container"),
                        singleDatePicker: false,
                        timePicker: false,
                        locale: {
                            cancelLabel: 'Clear'
                        }
                    });
                    
                    // Handle date selection
                    window.$(dateInputRef.current).on('apply.daterangepicker', function (ev, picker) {
                        const dateRange = picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD');
                        window.$(this).val(dateRange);
                        console.log('Date range selected:', dateRange);
                        setSearchParams(prev => ({ ...prev, dateRange: dateRange }));
                    });
                    
                    // Handle date clear
                    window.$(dateInputRef.current).on('cancel.daterangepicker', function (ev, picker) {
                        window.$(this).val('');
                        setSearchParams(prev => ({ ...prev, dateRange: '' }));
                    });
                    
                    console.log('Daterangepicker initialized successfully');
                    return true;
                } catch (error) {
                    console.error("Error initializing daterangepicker:", error)
                    return false;
                }
            } else {
                console.log('jQuery or daterangepicker not available:', { 
                    jQuery: !!window.$, 
                    daterangepicker: !!(window.$ && window.$.fn.daterangepicker),
                    input: !!dateInputRef.current 
                });
                return false;
            }
        };

        // Try multiple times to ensure initialization
        let attempts = 0;
        const maxAttempts = 10;
        let intervalId;
        
        const tryInitialize = () => {
            attempts++;
            console.log(`Daterangepicker initialization attempt ${attempts}`);
            
            if (initializeDateRangePicker()) {
                console.log('Daterangepicker initialization successful');
                if (intervalId) clearInterval(intervalId);
                return;
            }
            
            if (attempts >= maxAttempts) {
                console.error('Failed to initialize daterangepicker after', maxAttempts, 'attempts');
                if (intervalId) clearInterval(intervalId);
            }
        };
        
        // Start immediate attempt
        tryInitialize();
        
        // Then retry every 500ms until success or max attempts
        if (attempts < maxAttempts) {
            intervalId = setInterval(tryInitialize, 500);
        }

        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })

        return () => {
            console.log('Cleaning up daterangepicker');
            if (intervalId) clearInterval(intervalId);
            if (window.$ && dateInputRef.current) {
                try {
                    window.$(dateInputRef.current).off('apply.daterangepicker cancel.daterangepicker');
                    const picker = window.$(dateInputRef.current).data('daterangepicker');
                    if (picker) picker.remove();
                } catch (error) {
                    console.log('Cleanup error (ignored):', error);
                }
            }
        };
    }, [componentKey]) // Re-run when component key changes

    useEffect(() => {
        // Only filter when there are search criteria AND data is available
        if (effectiveRooms.length > 0 && searchParams.dateRange && !availabilityLoading) {
            filterRooms()
        } else if (effectiveRooms.length > 0) {
            // Reset to show all rooms when no search criteria
            setFilteredRooms([])
        }
    }, [effectiveRooms, searchParams, availability, availabilityLoading])

    // Add a separate useEffect to handle rooms loading state
    useEffect(() => {
        console.log('Rooms state changed:', { 
            roomsLength: rooms?.length, 
            loading, 
            error,
            roomsData: rooms 
        });
    }, [rooms, loading, error])

    // Use filtered rooms for pagination (if search is active), otherwise show all rooms
    // Only show rooms if they're actually loaded
    const roomsToShow = (searchParams.dateRange && !availabilityLoading) ? filteredRooms : (effectiveRooms || [])
    
    // Safety check - ensure we have valid room data before pagination
    const safeRoomsToShow = Array.isArray(roomsToShow) ? roomsToShow.filter(room => room && (room.id || room._id)) : []
    
    const indexOfLastRoom = currentPage * roomsPerPage
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
    const currentRooms = safeRoomsToShow.slice(indexOfFirstRoom, indexOfLastRoom)
    const totalPages = Math.ceil(safeRoomsToShow.length / roomsPerPage)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <>
            {/* Hero section */}
            <div className="content-section parallax-section hero-section hidden-section">
                <div className="bg par-elem" data-bg={`http://localhost:4000${roomsContent?.coverImage}`}></div>
                <div className="overlay"></div>
                <div className="container">
                    <div className="section-title">
                        <h4>{roomsContent?.header?.description}</h4>
                        <h2>{roomsContent?.header?.title}</h2>
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
            {/* Hero section end */}

            {/* Content */}
            <div className="content">
                {/* Breadcrumbs */}
                <div className="breadcrumbs-wrap">
                    <div className="container">
                        <Link to="/">Home</Link><span>Luxurious Rooms & Suites</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* Main section */}
                <div className="content-section">
                    <div className="section-dec"></div>
                    <div className="container small-container">
                        <div className="section-title">
                            <h4>Ultimate Comfort</h4>
                            <h2>Luxurious Rooms & Suites</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                            <p>Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay.</p>
                        </div>
                        <div className="fw-search-wrap">
                            <form className="custom-form" name="searchform" onSubmit={handleSearch}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="date-container input-wrap">
                                                <label></label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        id="res_date"
                                                        name="resdate"
                                                        ref={dateInputRef}
                                                        value={searchParams.dateRange}
                                                        placeholder="Select check-in and check-out dates"
                                                        readOnly
                                                        autoComplete="off"

                                                        style={{
                                                            background: '#c4a676',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '0 20px 0 45px',
                                                            height: '60px',
                                                            fontSize: '13px',
                                                            fontWeight: '500',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease-in-out',
                                                            width: '100%',
                                                            textAlign: 'right',
                                                            fontFamily: 'var(--secondary-font)',
                                                            textTransform: 'uppercase',
                                                            lineHeight: '60px',
                                                            pointerEvents: 'auto',
                                                            userSelect: 'none'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = '#fff'
                                                            e.target.style.color = '#c4a676'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = '#c4a676'
                                                            e.target.style.color = '#fff'
                                                        }}
                                                    />
                                                    <i 
                                                        className="fa-light fa-calendar-days" 
                                                        style={{
                                                            position: 'absolute',
                                                            left: '20px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            color: '#fff',
                                                            fontSize: '1.3em',
                                                            pointerEvents: 'none',
                                                            fontFamily: 'var(--secondary-font)'
                                                        }}
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="quantity">
                                                <div className="quantity_title">Rooms: </div>
                                                <div className="quantity-item">
                                                    <input 
                                                        type="button" 
                                                        value="-" 
                                                        className="minus" 
                                                        onClick={() => updateQuantity('rooms', 'decrease')}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        name="rooms" 
                                                        title="Rooms" 
                                                        className="qty color-bg" 
                                                        value={searchParams.rooms} 
                                                        readOnly
                                                    />
                                                    <input 
                                                        type="button" 
                                                        value="+" 
                                                        className="plus" 
                                                        onClick={() => updateQuantity('rooms', 'increase')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="quantity">
                                                <div className="quantity_title">Guests: </div>
                                                <div className="quantity-item">
                                                    <input 
                                                        type="button" 
                                                        value="-" 
                                                        className="minus" 
                                                        onClick={() => updateQuantity('guests', 'decrease')}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        name="guests" 
                                                        title="Guests" 
                                                        className="qty color-bg" 
                                                        value={searchParams.guests} 
                                                        readOnly
                                                    />
                                                    <input 
                                                        type="button" 
                                                        value="+" 
                                                        className="plus" 
                                                        onClick={() => updateQuantity('guests', 'increase')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <button 
                                                className="searchform-submit" 
                                                id="searchform-submit"
                                                type="submit"
                                                disabled={availabilityLoading}
                                            >
                                                {availabilityLoading ? 'Loading...' : 'Search Room'}
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                            
                            {/* Search Results Info */}
                            {searchParams.dateRange ? (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '15px',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>
                                        <strong>Search Results:</strong> Showing {safeRoomsToShow.length} available room{safeRoomsToShow.length !== 1 ? 's' : ''} 
                                        {` for dates: ${searchParams.dateRange}`}
                                        {` • ${searchParams.guests} guest${searchParams.guests !== 1 ? 's' : ''} • ${searchParams.rooms} room${searchParams.rooms !== 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                            
                            {availabilityError && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '12px',
                                    background: '#f8d7da',
                                    color: '#721c24',
                                    borderRadius: '6px',
                                    border: '1px solid #f5c6cb'
                                }}>
                                    Error loading availability data: {availabilityError}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="container">
                        <div className="dec-container">
                            <div className="dc_dec-item_left"><span></span></div>
                            <div className="dc_dec-item_right"><span></span></div>
                            <div className="text-block">
                                {/* Gallery start */}
                                <div className="gallery-items grid-big-pad lightgallery" style={{
                                    display: 'grid !important',
                                    gridTemplateColumns: 'repeat(3, 1fr) !important',
                                    gap: '30px !important',
                                    alignItems: 'stretch !important',
                                    width: '100% !important',
                                    float: 'none !important'
                                }}>
                                    {(effectiveLoading || availabilityLoading) ? (
                                        <div className="loading-indicator" style={{
                                            textAlign: 'center',
                                            padding: '60px',
                                            fontSize: '18px',
                                            color: '#666'
                                        }}>
                                            <i className="fa fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                                            Loading rooms... {(loading || fallbackLoading) && '(Rooms)'} {availabilityLoading && '(Availability)'}
                                        </div>
                                    ) : error ? (
                                        <div className="error-message" style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                            color: '#d32f2f',
                                            fontSize: '16px'
                                        }}>
                                            <i className="fa fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                                            {error}
                                        </div>
                                    ) : !effectiveRooms || effectiveRooms.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '60px',
                                            color: '#666',
                                            fontSize: '16px'
                                        }}>
                                            <i className="fa fa-bed" style={{ marginRight: '10px', fontSize: '24px' }}></i>
                                            <br /><br />
                                            No rooms available at the moment. Please try again later.
                                        </div>
                                    ) : currentRooms.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                            color: '#666',
                                            fontSize: '16px'
                                        }}>
                                            <i className="fa fa-search" style={{ marginRight: '10px' }}></i>
                                            {searchParams.dateRange ? 
                                                'No rooms available for the selected dates and criteria. Please try different dates or adjust your search.' :
                                                'No rooms match your current criteria.'
                                            }
                                        </div>
                                    ) : (
                                        currentRooms.map((room, index) => {
                                            // Safety check to ensure room data exists
                                            if (!room || !room.images || !room.images[0]) {
                                                return null;
                                            }
                                            
                                            return (
                                                <div className="gallery-item" key={room.id || room._id || index} style={{
                                                    width: '100% !important',
                                                    display: 'flex !important',
                                                    flexDirection: 'column !important',
                                                    float: 'none !important',
                                                    position: 'relative !important',
                                                    overflow: 'hidden !important'
                                                }}>
                                                    <div className="grid-item-holder hov_zoom">
                                                        <img 
                                                            src={`http://localhost:4000/uploads/rooms/${room.images[0]}`} 
                                                            alt={room.name || 'Room'} 
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                console.error('Failed to load room image:', room.images[0]);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                height: '250px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    <a href={getRoomImageUrl(room)} className="box-media-zoom single-popup-image">
                                                        <i className="fa-light fa-magnifying-glass"></i>
                                                    </a>
                                                    <div className="like-btn">
                                                        <i className="fa-light fa-heart"></i> <span>Add to Wislist</span>
                                                    </div>
                                                    {/* Availability indicator */}
                                                    {searchParams.dateRange && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            left: '10px',
                                                            background: '#28a745',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Available
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid-item-details" style={{
                                                    width: '100%',
                                                    float: 'none',
                                                    flex: '1',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <h3><Link to={`/room-single/${room._id || room.id}`}>{room.name}</Link></h3>
                                                    <div className="room-card-details">
                                                        <ul>
                                                            <li><i className="fa-light fa-user"></i><span>{room?.capacity} Guest{room?.capacity !== 1 ? 's' : ''}</span></li>
                                                            <li><i className="fa-light fa-bed-front"></i><span>{room?.bedType} Bed</span></li>
                                                            <li><i className="fa-light fa-bath"></i><span>1 Bath</span></li>
                                                        </ul>
                                                    </div>
                                                    <div className="grid-item_price">
                                                        <span>{formatPrice(room.price)}/Night</span>
                                                    </div>
                                                    <Link to={`/room-single/${room?._id || room?.id}`} className="gid_link">
                                                        <span>View Details</span> <i className="fa-light fa-arrow-right-long"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            );
                                        })
                                    )}
                                </div>
                                {/* Gallery end */}
                            </div>
                        </div>

                        {/* Pagination */}
                        {!effectiveLoading && !error && !availabilityLoading && totalPages > 1 && (
                            <div className="pagination">
                                <a href="#" className="prevposts-link" onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) paginate(currentPage - 1);
                                }}>
                                    <i className="fa fa-caret-left"></i>
                                </a>

                                {[...Array(totalPages)].map((_, i) => (
                                    <a
                                        href="#"
                                        key={i + 1}
                                        className={currentPage === i + 1 ? "current-page" : ""}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            paginate(i + 1);
                                        }}
                                    >
                                        {i + 1}
                                    </a>
                                ))}

                                <a href="#" className="nextposts-link" onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) paginate(currentPage + 1);
                                }}>
                                    <i className="fa fa-caret-right"></i>
                                </a>
                            </div>
                        )}
                        {/* Pagination end */}
                    </div>
                </div>
                {/* Main section end */}
                <div className="content-dec"><span></span></div>
            </div>
            {/* Content end */}
            
            {/* Override all existing CSS to force proper grid layout */}
            <style jsx global>{`
                /* Force grid layout for gallery container */
                .gallery-items {
                    display: grid !important;
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 30px !important;
                    align-items: stretch !important;
                    width: 100% !important;
                    float: none !important;
                    position: relative !important;
                }
                
                /* Force proper sizing for gallery items */
                .gallery-item {
                    float: none !important;
                    width: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                    position: relative !important;
                    overflow: hidden !important;
                    box-sizing: border-box !important;
                }
                
                /* Override any width restrictions */
                .two-column .gallery-item,
                .fw-gi .gallery-item,
                .fw-gi2-column .gallery-item {
                    width: 100% !important;
                    float: none !important;
                }
                
                /* Fix grid item holder */
                .grid-item-holder {
                    width: 100% !important;
                    float: none !important;
                    position: relative !important;
                }
                
                /* Fix grid item details */
                .grid-item-details {
                    width: 100% !important;
                    float: none !important;
                    flex: 1 !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                
                /* Medium screens - 2 cards per row */
                @media (max-width: 1200px) {
                    .gallery-items {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 25px !important;
                    }
                }
                
                /* Small screens/tablets - 2 cards per row */
                @media (max-width: 992px) {
                    .gallery-items {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 20px !important;
                    }
                }
                
                /* Mobile screens - 1 card per row */
                @media (max-width: 768px) {
                    .gallery-items {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                }
                
                /* Very small mobile */
                @media (max-width: 480px) {
                    .gallery-items {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }
                }
            `}</style>
        </>
    )
}

export default Rooms4 