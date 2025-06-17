import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const Blog = () => {
    useEffect(() => {
        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })
    }, [])

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
                        <h2>Our News</h2>
                        <p>Latest updates and articles</p>
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
                        <Link to="/">Home</Link><span>News</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* Blog section */}
                <div className="content-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                {/* Blog items */}
                                <div className="blog-items">
                                    {/* Blog item */}
                                    <div className="blog-item">
                                        <div className="blog-item-img">
                                            <img src="/src/assets/images/all/1.jpg" alt="" className="respimg" />
                                            <span className="blog-date">25 May 2024</span>
                                        </div>
                                        <div className="blog-item-content">
                                            <h3><Link to="/blog-single">Jazz Band Live Event</Link></h3>
                                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam aperiam.</p>
                                            <Link to="/blog-single" className="btn fl-btn">Read More</Link>
                                        </div>
                                    </div>
                                    {/* Blog item end */}

                                    {/* Blog item */}
                                    <div className="blog-item">
                                        <div className="blog-item-img">
                                            <img src="/src/assets/images/all/1.jpg" alt="" className="respimg" />
                                            <span className="blog-date">19 June 2024</span>
                                        </div>
                                        <div className="blog-item-content">
                                            <h3><Link to="/blog-single">Wine and Steak Day</Link></h3>
                                            <p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna.</p>
                                            <Link to="/blog-single" className="btn fl-btn">Read More</Link>
                                        </div>
                                    </div>
                                    {/* Blog item end */}

                                    {/* Blog item */}
                                    <div className="blog-item">
                                        <div className="blog-item-img">
                                            <img src="/src/assets/images/all/1.jpg" alt="" className="respimg" />
                                            <span className="blog-date">14 October 2024</span>
                                        </div>
                                        <div className="blog-item-content">
                                            <h3><Link to="/blog-single">Freedom Day Celebration</Link></h3>
                                            <p>Lorem Ipsum generators on the Internet king this the first true generator laudantium totam aperiam.</p>
                                            <Link to="/blog-single" className="btn fl-btn">Read More</Link>
                                        </div>
                                    </div>
                                    {/* Blog item end */}
                                </div>
                                {/* Blog items end */}
                            </div>
                            <div className="col-lg-4">
                                {/* Sidebar */}
                                <div className="sidebar">
                                    {/* Search */}
                                    <div className="sidebar-widget">
                                        <div className="search-widget">
                                            <form>
                                                <input type="text" placeholder="Search..." />
                                                <button type="submit"><i className="fa-light fa-magnifying-glass"></i></button>
                                            </form>
                                        </div>
                                    </div>
                                    {/* Search end */}

                                    {/* Categories */}
                                    <div className="sidebar-widget">
                                        <h3>Categories</h3>
                                        <div className="categories-widget">
                                            <ul>
                                                <li><a href="#">Events</a></li>
                                                <li><a href="#">Offers</a></li>
                                                <li><a href="#">News</a></li>
                                                <li><a href="#">Hotel</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Categories end */}
                                </div>
                                {/* Sidebar end */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Blog section end */}
            </div>
            {/* Content end */}
        </>
    )
}

export default Blog 