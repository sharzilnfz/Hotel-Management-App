import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const BlogSingle = () => {
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
                        <h2>Jazz Band Live Event</h2>
                        <p>25 May 2024</p>
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
                        <Link to="/">Home</Link><Link to="/blog">News</Link><span>Jazz Band Live Event</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* Blog single section */}
                <div className="content-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                {/* Blog single content */}
                                <div className="blog-single-content">
                                    <div className="blog-single-img">
                                        <img src="/src/assets/images/all/1.jpg" alt="" className="respimg" />
                                    </div>
                                    <div className="blog-single-text">
                                        <h3>Jazz Band Live Event</h3>
                                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                                        <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                                        <blockquote>
                                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
                                            <footer>John Smith, Music Director</footer>
                                        </blockquote>
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
                                    </div>
                                    <div className="blog-single-meta">
                                        <ul>
                                            <li><i className="fa-light fa-user"></i> By Admin</li>
                                            <li><i className="fa-light fa-calendar-days"></i> 25 May 2024</li>
                                            <li><i className="fa-light fa-tag"></i> Events</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Blog single content end */}
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
                {/* Blog single section end */}
            </div>
            {/* Content end */}
        </>
    )
}

export default BlogSingle 