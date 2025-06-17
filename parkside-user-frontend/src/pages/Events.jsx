import { useEffect, useRef, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentContext } from '../contexts/ContentContext'
import '../assets/css/custom-room-equal-height.css'

const Events = () => {
    const dateInputRef = useRef(null)
    const { eventsContent, loading: contentLoading, error: contentError, fetchEventsContent } = useContext(ContentContext)
    const [currentPage, setCurrentPage] = useState(1)
    const [events, setEvents] = useState([])
    const [eventsLoading, setEventsLoading] = useState(false)
    const [eventsError, setEventsError] = useState(null)
    const eventsPerPage = 6

    // Fetch events from API
    const fetchEvents = async () => {
        setEventsLoading(true)
        setEventsError(null)
        try {
            const response = await fetch('http://localhost:4000/api/events')
            const data = await response.json()
            if (data.success) {
                // Filter only active and published events
                const activeEvents = data.data.filter(event => 
                    event.active && event.publishWebsite && event.status === 'upcoming'
                )
                setEvents(activeEvents)
            } else {
                setEventsError('Failed to fetch events')
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            setEventsError('Failed to connect to server')
        } finally {
            setEventsLoading(false)
        }
    }

    useEffect(() => {
        // Fetch content if not already loaded
        if (!eventsContent) {
            fetchEventsContent()
        }
        
        // Fetch events from API
        fetchEvents()

        // Initialize the date picker when the component mounts
        if (window.$ && dateInputRef.current) {
            try {
                window.$(dateInputRef.current).datepicker({
                    range: true,
                    multipleDatesSeparator: ' - ',
                    minDate: new Date()
                })
            } catch (error) {
                console.error("Error initializing datepicker:", error)
            }
        }

        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })
    }, [eventsContent, fetchEventsContent])

    // Calculate pagination
    const indexOfLastEvent = currentPage * eventsPerPage
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent)
    const totalPages = Math.ceil(events.length / eventsPerPage)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    // Format price helper
    const formatPrice = (price) => `$${price}`

    // Get event image URL helper
    const getEventImageUrl = (event) => {
        if (event?.images && event.images.length > 0) {
            return `http://localhost:4000/uploads/events/${event.images[0]}`
        }
        return `http://localhost:4000/uploads/content/image-1748947475438-981074244.jpeg`
    }

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // Calculate event duration
    const getEventDuration = (startTime, endTime) => {
        const start = new Date(`2000-01-01 ${startTime}`)
        const end = new Date(`2000-01-01 ${endTime}`)
        const diffMs = end - start
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
        return `${diffHrs} hours`
    }

    return (
        <>
            {/* Hero section */}
            <div className="content-section parallax-section hero-section hidden-section">
                <div className="bg par-elem" data-bg={eventsContent?.coverImage ? `http://localhost:4000${eventsContent?.coverImage}` : `http://localhost:4000/uploads/content/image-1748947475438-981074244.jpeg`}></div>
                <div className="overlay"></div>
                <div className="container">
                    <div className="section-title">
                        <h4>{eventsContent?.description || "Create unforgettable memories with us."}</h4>
                        <h2>{eventsContent?.title || "Special Events & Celebrations"}</h2>
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
                        <Link to="/">Home</Link><span>{eventsContent?.pageTitle || "Events & Celebrations"}</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* Main section */}
                <div className="content-section">
                    <div className="section-dec"></div>
                    <div className="container small-container">
                        <div className="section-title">
                            <h4>{eventsContent?.sectionSubtitle || "Memorable Occasions"}</h4>
                            <h2>{eventsContent?.sectionTitle || "Events & Celebrations"}</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                            <p>{eventsContent?.sectionDescription || "Host your special occasions with elegance and sophistication. From intimate gatherings to grand celebrations, we make every event memorable."}</p>
                        </div>
                        <div className="fw-search-wrap">
                            <form className="custom-form" name="searchform">
                                <fieldset>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="date-container input-wrap">
                                                <label>Date:</label>
                                                <input
                                                    type="text"
                                                    id="event_date"
                                                    name="eventdate"
                                                    ref={dateInputRef}
                                                    value=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="quantity">
                                                <div className="quantity_title">Events: </div>
                                                <div className="quantity-item">
                                                    <input type="button" value="-" className="minus" />
                                                    <input type="text" name="quantity" title="Qty" className="qty color-bg" data-min="1" data-max="3" data-step="1" value="1" />
                                                    <input type="button" value="+" className="plus" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="quantity">
                                                <div className="quantity_title">Guests: </div>
                                                <div className="quantity-item">
                                                    <input type="button" value="-" className="minus" />
                                                    <input type="text" name="quantity" title="Qty" className="qty color-bg" data-min="10" data-max="500" data-step="10" value="50" />
                                                    <input type="button" value="+" className="plus" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <button className="searchform-submit" id="searchform-submit">Book Event</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>

                    <div className="container">
                        <div className="dec-container">
                            <div className="dc_dec-item_left"><span></span></div>
                            <div className="dc_dec-item_right"><span></span></div>
                            <div className="text-block">
                                {/* Events Grid */}
                                <div className="events-grid">
                                    {eventsLoading ? (
                                        <div className="loading-indicator">
                                            <div className="loading-spinner"></div>
                                            <p>Loading events...</p>
                                        </div>
                                    ) : eventsError ? (
                                        <div className="error-message">
                                            <i className="fa-light fa-exclamation-triangle"></i>
                                            <h3>Error Loading Events</h3>
                                            <p>{eventsError}</p>
                                            <button onClick={fetchEvents} className="retry-btn">
                                                <i className="fa-light fa-refresh"></i> Try Again
                                            </button>
                                        </div>
                                    ) : events.length === 0 ? (
                                        <div className="no-events-message">
                                            <i className="fa-light fa-calendar-days"></i>
                                            <h3>No events found</h3>
                                            <p>Try adjusting your filters or search terms</p>
                                        </div>
                                    ) : (
                                        currentEvents.map((event) => (
                                            <div className="event-card" key={event._id}>
                                                <div className="event-card-image">
                                                    <img src={getEventImageUrl(event)} alt={event.title} />
                                                    <div className="event-badge">
                                                        <span className={`status-badge ${event.status}`}>
                                                            {event.status}
                                                        </span>
                                                        {event.isRefundable && (
                                                            <span className="refundable-badge">Refundable</span>
                                                        )}
                                                    </div>
                                                    <div className="event-overlay">
                                                        <Link to={`/event/${event._id}`} className="quick-book-btn">
                                                            <i className="fa-light fa-calendar-check"></i>
                                                            Book Now
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                                <div className="event-card-content">
                                                    <div className="event-date">
                                                        <i className="fa-light fa-calendar"></i>
                                                        {formatDate(event.date)}
                                                    </div>
                                                    
                                                    <h3 className="event-title">
                                                        <Link to={`/event/${event._id}`}>{event.title}</Link>
                                                    </h3>
                                                    
                                                    <p className="event-description">
                                                        {event.description?.length > 120 
                                                            ? `${event.description.substring(0, 120)}...` 
                                                            : event.description}
                                                    </p>

                                                    <div className="event-details">
                                                        <div className="event-features">
                                                            <div className="feature">
                                                                <i className="fa-light fa-clock"></i>
                                                                <span>{event.startTime} - {event.endTime}</span>
                                                            </div>
                                                            <div className="feature">
                                                                <i className="fa-light fa-location-dot"></i>
                                                                <span>{event.location}</span>
                                                            </div>
                                                            <div className="feature">
                                                                <i className="fa-light fa-users"></i>
                                                                <span>{event.maxAttendees - event.currentAttendees} spots left</span>
                                                            </div>
                                                            <div className="feature">
                                                                <i className="fa-light fa-hourglass-half"></i>
                                                                <span>{getEventDuration(event.startTime, event.endTime)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {event.addons && event.addons.length > 0 && (
                                                        <div className="event-addons">
                                                            <span className="addons-label">Add-ons available:</span>
                                                            <div className="addons-list">
                                                                {event.addons.slice(0, 2).map((addon, index) => (
                                                                    <span key={addon._id} className="addon-item">
                                                                        {addon.name} (+${addon.price})
                                                                    </span>
                                                                ))}
                                                                {event.addons.length > 2 && (
                                                                    <span className="more-addons">+{event.addons.length - 2} more</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="event-card-footer">
                                                        <div className="event-price">
                                                            <span className="price-amount">
                                                                {formatPrice(event.price)}
                                                            </span>
                                                            <span className="price-per">per person</span>
                                                        </div>
                                                        
                                                        <div className="event-actions">
                                                            <button className="wishlist-btn" title="Add to Wishlist">
                                                                <i className="fa-light fa-heart"></i>
                                                            </button>
                                                            <Link to={`/event/${event._id}`} className="view-details-btn">
                                                                View Details
                                                                <i className="fa-light fa-arrow-right"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {/* Events Grid end */}
                            </div>
                        </div>

                        {/* Pagination */}
                        {!eventsLoading && !eventsError && events.length > 0 && totalPages > 1 && (
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

            <style jsx>{`
                .events-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 30px;
                    margin: 40px 0;
                }

                .event-card {
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    transition: all 0.4s ease;
                    position: relative;
                }

                .event-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }

                .event-card-image {
                    position: relative;
                    height: 260px;
                    overflow: hidden;
                }

                .event-card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .event-card:hover .event-card-image img {
                    transform: scale(1.1);
                }

                .event-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: capitalize;
                    background: #c4a676;
                    color: white;
                }

                .refundable-badge {
                    background: #27ae60;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .event-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .event-card:hover .event-overlay {
                    opacity: 1;
                }

                .quick-book-btn {
                    background: #c4a676;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .quick-book-btn:hover {
                    background: #b39660;
                    transform: translateY(-2px);
                }

                .event-card-content {
                    padding: 25px;
                }

                .event-date {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #c4a676;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }

                .event-title {
                    margin: 10px 0 15px;
                    font-size: 20px;
                    font-weight: 700;
                }

                .event-title a {
                    color: #2c3e50;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .event-title a:hover {
                    color: #c4a676;
                }

                .event-description {
                    color: #7f8c8d;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                .event-features {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #7f8c8d;
                    font-size: 13px;
                }

                .feature i {
                    color: #c4a676;
                    width: 16px;
                }

                .event-addons {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .addons-label {
                    display: block;
                    font-size: 12px;
                    color: #7f8c8d;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .addons-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .addon-item {
                    background: #c4a676;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                }

                .more-addons {
                    background: #95a5a6;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                }

                .event-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #ecf0f1;
                    padding-top: 20px;
                }

                .event-price {
                    display: flex;
                    flex-direction: column;
                }

                .price-amount {
                    font-size: 24px;
                    font-weight: 700;
                    color: #c4a676;
                }

                .price-per {
                    font-size: 12px;
                    color: #7f8c8d;
                }

                .event-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .wishlist-btn {
                    background: none;
                    border: 2px solid #ecf0f1;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .wishlist-btn:hover {
                    border-color: #e74c3c;
                    color: #e74c3c;
                }

                .view-details-btn {
                    background: #c4a676;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }

                .view-details-btn:hover {
                    background: #b39660;
                    transform: translateY(-2px);
                }

                .loading-indicator {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid #ecf0f1;
                    border-top: 3px solid #c4a676;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #7f8c8d;
                }

                .error-message i {
                    font-size: 48px;
                    margin-bottom: 20px;
                    color: #e74c3c;
                }

                .error-message h3 {
                    margin: 20px 0 10px;
                    color: #2c3e50;
                }

                .retry-btn {
                    background: #c4a676;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .retry-btn:hover {
                    background: #b39660;
                    transform: translateY(-2px);
                }

                .no-events-message {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #7f8c8d;
                }

                .no-events-message i {
                    font-size: 48px;
                    margin-bottom: 20px;
                    color: #bdc3c7;
                }

                .no-events-message h3 {
                    margin: 20px 0 10px;
                    color: #2c3e50;
                }

                @media (max-width: 768px) {
                    .events-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .filters-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .event-features {
                        grid-template-columns: 1fr;
                    }
                    
                    .event-card-footer {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .addons-list {
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    )
}

export default Events 