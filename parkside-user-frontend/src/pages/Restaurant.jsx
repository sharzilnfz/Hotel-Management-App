import { Link } from 'react-router-dom'
import { useEffect, useState, useCallback, useRef, useContext } from 'react'
import { restaurantServices } from '../data/restaurantData'
import { ContentContext } from '../contexts/ContentContext'
import axios from 'axios'
import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const API_URL = 'http://localhost:4000/api'

const MENU_CATEGORIES = [
    { id: 'breakfast', name: 'Breakfast', active: true },
    { id: 'lunch', name: 'Lunch', active: false },
    { id: 'dinner', name: 'Dinner', active: false },
    { id: 'dessert', name: 'Desserts', active: false }
]

const Restaurant = () => {
    const [activeTab, setActiveTab] = useState('breakfast')
    const [menuItems, setMenuItems] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        dessert: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const swiperRef = useRef(null)

    // Get content from ContentContext
    const { restaurantContent, contentLoading } = useContext(ContentContext)

    // Fetch menu items
    const fetchMenuItems = async () => {
        try {
            setLoading(true)
            console.log('Fetching menu items...')
            
            const response = await axios.get(`${API_URL}/restaurant/menu-items`)
            console.log('Menu items response:', response.data)

            if (response.data.success) {
                const items = response.data.data || []
                console.log('Received items:', items)

                // Initialize categories
                const groupedItems = {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    dessert: []
                }

                            // Group items by category
            items.forEach(item => {
                const category = item.category?.name?.toLowerCase()
                if (category && groupedItems[category] && item.available !== false) {
                    groupedItems[category].push(item)
                }
            })

                console.log('Grouped items:', groupedItems)
                setMenuItems(groupedItems)
                
                // Auto-select first tab with items
                const categoryWithItems = MENU_CATEGORIES.find(cat => 
                    groupedItems[cat.id] && groupedItems[cat.id].length > 0
                )
                if (categoryWithItems) {
                    setActiveTab(categoryWithItems.id)
                }
            }
        } catch (err) {
            console.error('Error fetching menu items:', err)
            setError('Failed to load menu items')
        } finally {
            setLoading(false)
        }
    }

    // Load menu items on mount
    useEffect(() => {
        fetchMenuItems()
    }, [])

    // Initialize Swiper
    useEffect(() => {
        if (swiperRef.current && restaurantContent?.featuredDishes?.length > 0) {
            const swiper = new Swiper('.swiper-container', {
                modules: [Navigation, Pagination],
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                navigation: {
                    nextEl: '.fw-carousel-button-next',
                    prevEl: '.fw-carousel-button-prev',
                },
                pagination: {
                    el: '.ss-slider-pagination',
                    clickable: true,
                },
            })
        }
    }, [restaurantContent])

    // Helper functions
    const formatPrice = useCallback((price) => {
        const numPrice = Number(price)
        return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`
    }, [])

    const getImageSrc = useCallback((item) => {
        if (item.images && item.images.length > 0) {
            const imagePath = item.images[0]
            return imagePath.startsWith('/uploads/') ? `http://localhost:4000${imagePath}` : imagePath
        }
        return '/src/assets/images/menu/thumbnails/1.jpg'
    }, [])

    const handleTabClick = useCallback((e, tabId) => {
        e.preventDefault()
        setActiveTab(tabId)
    }, [])

    const handleImageError = useCallback((e) => {
        e.target.onerror = null
        e.target.src = '/src/assets/images/menu/thumbnails/1.jpg'
    }, [])

    const isLoading = loading || contentLoading
    const activeTabItems = menuItems[activeTab] || []

    return (
        <>
            {/* CSS Fix for Responsiveness */}
            <style jsx global>{`
                /* Force visibility of menu items at all screen sizes */
                .restaurant-page-wrapper,
                .content,
                .content-section,
                .hero-menu-item,
                .hero-menu-wrap,
                .tabs-container,
                .tab-content,
                .hero-menu-item-img,
                .hero-menu-item-title,
                .hero-menu-item-details {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                
                .hero-menu-item {
                    display: flex !important;
                    margin-bottom: 30px !important;
                    align-items: flex-start !important;
                }
                
                .hero-menu-item-img {
                    display: block !important;
                    width: 100px !important;
                    height: 100px !important;
                    margin-right: 20px !important;
                    flex-shrink: 0 !important;
                }
                
                .hero-menu-item-img img {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border-radius: 8px !important;
                }
                
                .hero-menu-item-title,
                .hero-menu-item-details {
                    display: block !important;
                    flex: 1 !important;
                }
                
                @media (min-width: 768px) {
                    .hero-menu-item,
                    .hero-menu-wrap,
                    .tabs-container,
                    .tab-content {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    
                    .hero-menu-item {
                        display: flex !important;
                    }
                }
                
                @media (min-width: 1024px) {
                    .hero-menu-item,
                    .hero-menu-wrap,
                    .tabs-container,
                    .tab-content {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    
                    .hero-menu-item {
                        display: flex !important;
                    }
                }
            `}</style>

            <div className="restaurant-page-wrapper">
                {/* Hero Section */}
                <div className="content-section parallax-section hero-section hidden-section" data-scrollax-parent="true">
                    <div className="bg par-elem" style={{
                        backgroundImage: `url('http://localhost:4000${restaurantContent?.coverImage || '/src/assets/images/restaurant/1.jpg'}')`
                    }} data-scrollax="properties: { translateY: '30%' }"></div>
                    <div className="overlay"></div>
                    <div className="container">
                        <div className="section-title">
                            <h4>{restaurantContent?.description || "Enjoy your time in our Hotel with pleasure."}</h4>
                            <h2>{restaurantContent?.title || "Our Restaurant"}</h2>
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

                {/* Content */}
                <div className="content">
                    {/* Breadcrumbs */}
                    <div className="breadcrumbs-wrap">
                        <div className="container">
                            <Link to="/">Home</Link><span>Restaurant</span>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="content-section">
                        <div className="section-dec"></div>
                        <div className="content-dec2 fs-wrapper"></div>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="section-title text-align_left" style={{ marginTop: "50px" }}>
                                        <h4>{restaurantContent?.subtitle || "Special selection"}</h4>
                                        <h2>{restaurantContent?.title || "About Our Restaurant"}</h2>
                                    </div>
                                    <div className="text-block tb-sin">
                                        <div className="dc_dec-item_left"><span></span></div>
                                        <p className="has-drop-cap">{restaurantContent?.description || "Loading restaurant information..."}</p>
                                        <p>
                                            {restaurantContent?.headChef && restaurantContent?.cuisineType ?
                                                `Our head chef, ${restaurantContent.headChef}, specializes in ${restaurantContent.cuisineType} cuisine.` :
                                                "Our talented chefs create exceptional dining experiences with the finest ingredients."
                                            }
                                        </p>
                                        {restaurantContent?.openingHours && (
                                            <div className="opening-hours">
                                                <h5>Opening Hours:</h5>
                                                {restaurantContent.openingHours.split('\n').map((hours, index) => (
                                                    <p key={index}>{hours}</p>
                                                ))}
                                            </div>
                                        )}
                                        <a href="#secmenu" className="btn fl-btn custom-scroll-link">Explore Our Menu</a>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="image-collge-wrap">
                                        <div className="blog-media">
                                            <div className="single-slider-wrap">
                                                <div className="single-slider">
                                                    <div className="swiper-container" ref={swiperRef}>
                                                        <div className="swiper-wrapper lightgallery">
                                                            {restaurantContent?.featuredDishes && restaurantContent.featuredDishes.length > 0 ? (
                                                                restaurantContent.featuredDishes.map((dish, index) => (
                                                                    <div key={index} className="swiper-slide hov_zoom">
                                                                        <div style={{
                                                                            width: '100%',
                                                                            height: '400px',
                                                                            overflow: 'hidden',
                                                                            position: 'relative'
                                                                        }}>
                                                                            <img
                                                                                src={dish.image || '/src/assets/images/menu/1.jpg'}
                                                                                alt={dish.name}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'cover',
                                                                                    objectPosition: 'center'
                                                                                }}
                                                                            />
                                                                            <a href={dish.image || '/src/assets/images/menu/1.jpg'} className="box-media-zoom popup-image">
                                                                                <i className="fal fa-search"></i>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="swiper-slide hov_zoom">
                                                                    <div style={{
                                                                        width: '100%',
                                                                        height: '400px',
                                                                        overflow: 'hidden',
                                                                        position: 'relative'
                                                                    }}>
                                                                        <img
                                                                            src="/src/assets/images/menu/1.jpg"
                                                                            alt="Restaurant"
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                objectFit: 'cover',
                                                                                objectPosition: 'center'
                                                                            }}
                                                                        />
                                                                        <a href="/src/assets/images/menu/1.jpg" className="box-media-zoom popup-image">
                                                                            <i className="fal fa-search"></i>
                                                                        </a>
                                                                    </div>
                                                                </div>
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
                                        <div className="dc_dec-item_right"><span></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Restaurant Services */}
                    <div className="content-section no-padding dark-bg hidden-section">
                        <div className="bg-ser fs-wrapper"></div>
                        <div className="overlay"></div>
                        <div className="fw-aminit-wrap">
                            {restaurantContent?.openingHours ? (
                                restaurantContent.openingHours
                                    .split('\n')
                                    .map((hours, index) => {
                                        const [meal, time] = hours.split(':').map(part => part.trim());
                                        return (
                                            <div key={index} className="fw-aminit-item full-height" style={{ backgroundImage: `url(/src/assets/images/restaurant/1.jpg)` }}>
                                                <div className="fw-aminit-item-container">
                                                    <h5>Restaurant Hours</h5>
                                                    <h3>{meal}</h3>
                                                    <h6>Location: Main Restaurant</h6>
                                                    <i className="fa-light fa-utensils-alt"></i>
                                                </div>
                                                <div className="aminit-work-time">
                                                    <span>Every Day</span>
                                                    <strong>{time}</strong>
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                restaurantServices.map((service, index) => (
                                    <div key={index} className="fw-aminit-item full-height" style={{ backgroundImage: `url(${service.background})` }}>
                                        <div className="fw-aminit-item-container">
                                            <h5>{service.title}</h5>
                                            <h3>{service.name}</h3>
                                            <h6>Location: {service.location}</h6>
                                            <i className={service.icon}></i>
                                        </div>
                                        <div className="aminit-work-time">
                                            <span>{service.hours.days}</span>
                                            <strong>{service.hours.time}</strong>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div className="content-section" id="secmenu">
                        <div className="content-dec2 fs-wrapper"></div>
                        <div className="container">
                            <div className="section-title">
                                <h4>Special selection</h4>
                                <h2>Discover Our Menu</h2>
                                <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                            </div>

                            {isLoading ? (
                                <div className="menu-loading">
                                    <h3>Loading menu items...</h3>
                                </div>
                            ) : error ? (
                                <div className="menu-error">
                                    <h3>{error}</h3>
                                </div>
                            ) : (
                                <div className="tabs-act">
                                    <div className="hero-menu_header">
                                        <ul className="tabs-menu">
                                            {MENU_CATEGORIES.map(category => (
                                                <li key={category.id} className={activeTab === category.id ? 'current' : ''}>
                                                    <a href={`#${category.id}`} onClick={(e) => handleTabClick(e, category.id)}>
                                                        {category.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="hero-menu-wrap dec-container anim_tabs">
                                        <div className="dc_dec-item_left"><span></span></div>
                                        <div className="dc_dec-item_right"><span></span></div>
                                        <div className="tabs-container">
                                            <div className="tab">
                                                <div className={`tab-content ${activeTab === 'breakfast' ? 'first-tab' : ''}`} style={{ display: 'block !important' }}>
                                                    {activeTabItems.length > 0 ? (
                                                        activeTabItems.map((item, index) => (
                                                            <div key={index} className="hero-menu-item">
                                                                <div className="hero-menu-item-img">
                                                                    <img 
                                                                        src={getImageSrc(item)} 
                                                                        alt={item.name}
                                                                        onError={handleImageError}
                                                                    />
                                                                </div>
                                                                <div className="hero-menu-item-title">
                                                                    <h6>
                                                                        {item.name}
                                                                        {item.discount && <span className="hot-desc">-{item.discount}</span>}
                                                                    </h6>
                                                                    <span className="hero-menu-item-price">{formatPrice(item.price)}</span>
                                                                </div>
                                                                <div className="hero-menu-item-details">
                                                                    <p>{item.description}</p>
                                                                    {item.preparationTime && (
                                                                        <span className="preparation-time">
                                                                            <i className="fa-thin fa-clock"></i> {item.preparationTime} min
                                                                        </span>
                                                                    )}
                                                                    {item.ingredients && (
                                                                        <span className="ingredients" style={{
                                                                            display: 'block',
                                                                            marginTop: '5px',
                                                                            fontSize: '13px',
                                                                            color: '#666',
                                                                            fontStyle: 'italic'
                                                                        }}>
                                                                            <i className="fa-thin fa-mortar-pestle" style={{ marginRight: '5px' }}></i>
                                                                            <span>Ingredients:</span> {item.ingredients}
                                                                        </span>
                                                                    )}
                                                                    {item.extras && item.extras.length > 0 && (
                                                                        <div className="menu-extras" style={{ 
                                                                            marginTop: '8px', 
                                                                            padding: '8px', 
                                                                            background: 'rgba(0,0,0,0.03)', 
                                                                            borderRadius: '4px'
                                                                        }}>
                                                                            <p className="extras-title" style={{ 
                                                                                fontSize: '14px', 
                                                                                fontWeight: 'bold',
                                                                                marginBottom: '5px',
                                                                                color: '#666'
                                                                            }}>Available extras:</p>
                                                                            <ul className="extras-list" style={{ 
                                                                                listStyleType: 'none', 
                                                                                margin: 0, 
                                                                                padding: 0 
                                                                            }}>
                                                                                {item.extras.map((extra, extraIndex) => (
                                                                                    <li key={`extra-${extraIndex}`} style={{ 
                                                                                        display: 'inline-block',
                                                                                        margin: '0 10px 5px 0', 
                                                                                        fontSize: '13px',
                                                                                        padding: '2px 8px',
                                                                                        background: '#f5f5f5',
                                                                                        borderRadius: '10px',
                                                                                        border: '1px solid #ddd'
                                                                                    }}>
                                                                                        {extra.name} (+{formatPrice(extra.price)})
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="no-items-message">
                                                            <p>No items available in this category</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {restaurantContent?.menuItemsPDF ? (
                                <a 
                                    href={`http://localhost:4000${restaurantContent.menuItemsPDF}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="dwonload_btn"
                                >
                                    View PDF Menu
                                </a>
                            ) : (
                                <a href="#" className="dwonload_btn" style={{opacity: 0.5, pointerEvents: 'none'}}>
                                    PDF Menu Not Available
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="content-dec"><span></span></div>
                </div>
            </div>
        </>
    )
}

export default Restaurant 