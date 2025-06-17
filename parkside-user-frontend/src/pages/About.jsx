import { Link } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { AboutContext } from '../contexts/AboutContext'

const About = () => {
    // Get content from AboutContext
    const { aboutContent, loading } = useContext(AboutContext)

    useEffect(() => {
        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {/* Hero section */}
            <div className="content-section parallax-section hero-section hidden-section" data-scrollax-parent="true">
                <div className="bg par-elem" data-bg={`http://localhost:4000${aboutContent?.hero?.backgroundImage}`} data-scrollax="properties: { translateY: '30%' }"></div>
                <div className="overlay"></div>
                <div className="container">
                    <div className="section-title">
                        <h4>{aboutContent?.hero?.subtitle || "Enjoy your time in our Hotel with pleasure."}</h4>
                        <h2>{aboutContent?.hero?.title || "About The Hotel"}</h2>
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
                        <Link to="/">Home</Link><span>About Hotel</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* About Content */}
                <div className="content-section">
                    <div className="section-dec"></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="section-title text-align_left" style={{ marginTop: "50px" }}>
                                    <h4>{aboutContent?.about?.subtitle || "Enjoy your time in our Hotel"}</h4>
                                    <h2>{aboutContent?.about?.title || "About Our Hotel"}</h2>
                                </div>
                                <div className="text-block tb-sin">
                                    <p className="has-drop-cap">
                                        {aboutContent?.about?.content ||
                                            "Qed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.Ut enim ad minima Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."}
                                    </p>
                                    <p>
                                        {aboutContent?.about?.welcomeMessage ||
                                            "Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis. Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis."}
                                    </p>
                                    <Link to="/contact" className="btn fl-btn">Call For Reservation</Link>
                                    <div className="dc_dec-item_left"><span></span></div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="image-collge-wrap">
                                    <div className="main-iamge">
                                        <img src="https://plus.unsplash.com/premium_vector-1683141030927-d8f78a6be4bd?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="respimg" alt="" />
                                        <div className="video_link image-popup" id="html5-videos" data-html="#video1">
                                            <i className="fas fa-play"></i>
                                            <span>Play Story Presentation Video</span>
                                        </div>
                                    </div>
                                    <div className="dc_dec-item_right"><span></span></div>
                                    <div className="about-img-hotifer dark-bg">
                                        <div className="about-img-hotifer-wrap">
                                            <p>Your website is fully responsive so visitors can view your content from their choice of device.</p>
                                            <h4>Mark Antony</h4>
                                            <h5>Parkside CEO</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sc-dec" style={{ left: "-220px", bottom: "-100px" }}></div>
                    </div>
                    <div className="content-dec2 fs-wrapper"></div>
                    <div className="content-dec"><span></span></div>
                </div>
                {/* About Content end */}

                {/* Stats Section */}
                <div className="content-section parallax-section hidden-section dark-bg" data-scrollax-parent="true">
                    <div className="bg par-elem" data-bg="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIM40M__4Lns_gf9ts1qQs4UNMhUHRz9ob6Q&s" data-scrollax="properties: { translateY: '30%' }"></div>
                    <div className="overlay overlay-bold"></div>
                    <div className="container">
                        <div className="inline-facts-wrap">
                            <div className="inline-facts">
                                <div className="milestone-counter">
                                    <div className="stats animaper">
                                        <div className="num" data-content="0" data-num="254">254</div>
                                    </div>
                                </div>
                                <h6>New Visiters Every Week</h6>
                            </div>
                            <div className="inline-facts">
                                <div className="milestone-counter">
                                    <div className="stats animaper">
                                        <div className="num" data-content="0" data-num="12168">12168</div>
                                    </div>
                                </div>
                                <h6>Happy Customers Every Year</h6>
                            </div>
                            <div className="inline-facts">
                                <div className="milestone-counter">
                                    <div className="stats animaper">
                                        <div className="num" data-content="0" data-num="172">172</div>
                                    </div>
                                </div>
                                <h6>Won Awards</h6>
                            </div>
                            <div className="inline-facts">
                                <div className="milestone-counter">
                                    <div className="stats animaper">
                                        <div className="num" data-content="0" data-num="732">732</div>
                                    </div>
                                </div>
                                <h6>Weekly Deliveries</h6>
                            </div>
                        </div>
                    </div>
                    <div className="dec-corner dc_lb"></div>
                    <div className="dec-corner dc_rb"></div>
                    <div className="dec-corner dc_rt"></div>
                    <div className="dec-corner dc_lt"></div>
                </div>
                {/* Stats Section end */}

                {/* Team Section */}
                <div className="content-section">
                    <div className="container">
                        <div className="section-title">
                            <h4>Enjoy your time in our Hotel with pleasure.</h4>
                            <h2>Meet Our Team</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                        </div>
                        <div className="team-container">
                            <div className="dec-container">
                                <div className="text-block">
                                    <div className="row">
                                        {aboutContent?.team?.map((member, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="team-box">
                                                    <div className="team-photo">
                                                        <img src={`http://localhost:4000${member?.image}`} alt="" className="respimg" />
                                                        <div className="overlay"></div>
                                                        <div className="team-social">
                                                            <span className="ts_title">Follow</span>
                                                            <ul>
                                                                {member.socialLinks?.map((link, linkIndex) => (
                                                                    <li key={linkIndex}>
                                                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                                            <i className={link.icon}></i>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="team-info fl-wrap">
                                                        <h3>{member.name}</h3>
                                                        <h4>{member.position}</h4>
                                                        <p>{member.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="dc_dec-item_left"><span></span></div>
                                <div className="dc_dec-item_right"><span></span></div>
                            </div>
                        </div>
                        <div className="sc-dec" style={{ left: "-220px", bottom: "-100px" }}></div>
                        <div className="sc-dec2" style={{ right: "-220px", top: "-100px" }}></div>
                    </div>
                    <div className="content-dec2 fs-wrapper"></div>
                </div>
                {/* Team Section end */}

                {/* Gallery Section */}
                <div className="content-section dark-bg parallax-section no-padding">
                    <div className="row">
                        <div className="st-gallery">
                            <div className="section-title">
                                <h4>Enjoy your time in our Hotel with pleasure.</h4>
                                <h2>Our Gallery</h2>
                                <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                            </div>
                            <div className="map-dec2"></div>
                        </div>
                        <div className="col-lg-3"></div>
                        <div className="col-lg-9">
                            <div className="single-carousle-container2">
                                <div className="single-carousel-wrap2">
                                    <div className="single-carousel2 fl-wrap lightgallery" data-mousecontrol="0">
                                        <div className="swiper-container">
                                            <div className="swiper-wrapper">
                                                {
                                                    aboutContent?.gallery?.map((content, index) => (
                                                        <div className="swiper-slide hov_zoom" key={index}>
                                                            <img src={`http://localhost:4000${content?.image}`} alt="" />
                                                            <a href={`http://localhost:4000${content?.image}`} className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                                        </div>
                                                    ))
                                                }
                                                {/* <div className="swiper-slide hov_zoom">
                                                    <img src="/src/assets/images/room/1.jpg" alt="" />
                                                    <a href="/src/assets/images/room/1.jpg" className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                                </div>
                                                <div className="swiper-slide hov_zoom">
                                                    <img src="/src/assets/images/room/1.jpg" alt="" />
                                                    <a href="/src/assets/images/room/1.jpg" className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                                </div>
                                                <div className="swiper-slide hov_zoom">
                                                    <img src="/src/assets/images/room/1.jpg" alt="" />
                                                    <a href="/src/assets/images/room/1.jpg" className="box-media-zoom popup-image"><i className="fal fa-search"></i></a>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fw-carousel-button-prev slider-button"><i className="fa-solid fa-caret-left"></i></div>
                                    <div className="fw-carousel-button-next slider-button"><i className="fa-solid fa-caret-right"></i></div>
                                    <div className="sc-controls fwc-contr fwc_pag">
                                        <div className="ss-slider-pagination"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Gallery Section end */}

                {/* Testimonials Section */}
                <div className="content-section">
                    <div className="container">
                        <div className="section-title">
                            <h4>What said about us</h4>
                            <h2>Testimonials and Clients</h2>
                            <div className="section-separator"><span><i className="fa-thin fa-gem"></i></span></div>
                        </div>
                        <div className="sc-dec3" style={{ left: "40%", bottom: "-200px" }}></div>
                    </div>
                    <div className="testimonilas-carousel-wrap">
                        <div className="tc-button tc-button-next"><i className="fas fa-caret-right"></i></div>
                        <div className="tc-button tc-button-prev"><i className="fas fa-caret-left"></i></div>
                        <div className="testimonilas-carousel">
                            <div className="swiper-container">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="testi-item">
                                            <div className="testi-avatar"><img src="/src/assets/images/avatar/1.jpg" alt="" /></div>
                                            <div className="testimonilas-text">
                                                <div className="testimonilas-text-item">
                                                    <h3>Andy Dimasky</h3>
                                                    <div className="star-rating" data-starrating="5"></div>
                                                    <p>"Vestibulum orci felis, ullamcorper non condimentum non, ultrices ac nunc. Mauris non ligula suscipit, vulputate mi accumsan, dapibus felis. Nullam sed sapien dui. Nulla auctor sit amet sem non porta."</p>
                                                    <a href="#" className="testi-link" target="_blank">Via Booking.com</a>
                                                </div>
                                                <span className="testi-number">01.</span>
                                                <div className="testi-item-dec fs-wrapper"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="testi-item">
                                            <div className="testi-avatar"><img src="/src/assets/images/avatar/1.jpg" alt="" /></div>
                                            <div className="testimonilas-text">
                                                <div className="testimonilas-text-item">
                                                    <h3>Jane Doe</h3>
                                                    <div className="star-rating" data-starrating="4"></div>
                                                    <p>"Vestibulum orci felis, ullamcorper non condimentum non, ultrices ac nunc. Mauris non ligula suscipit, vulputate mi accumsan, dapibus felis. Nullam sed sapien dui. Nulla auctor sit amet sem non porta."</p>
                                                    <a href="#" className="testi-link" target="_blank">Via hotels.com</a>
                                                </div>
                                                <span className="testi-number">02.</span>
                                                <div className="testi-item-dec fs-wrapper"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="testi-item">
                                            <div className="testi-avatar"><img src="/src/assets/images/avatar/1.jpg" alt="" /></div>
                                            <div className="testimonilas-text">
                                                <div className="testimonilas-text-item">
                                                    <h3>Jane Doe</h3>
                                                    <div className="star-rating" data-starrating="4"></div>
                                                    <p>"Vestibulum orci felis, ullamcorper non condimentum non, ultrices ac nunc. Mauris non ligula suscipit, vulputate mi accumsan, dapibus felis. Nullam sed sapien dui. Nulla auctor sit amet sem non porta."</p>
                                                    <a href="#" className="testi-link" target="_blank">Via hotels.com</a>
                                                </div>
                                                <span className="testi-number">02.</span>
                                                <div className="testi-item-dec fs-wrapper"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-slide">
                                        <div className="testi-item">
                                            <div className="testi-avatar"><img src="/src/assets/images/avatar/1.jpg" alt="" /></div>
                                            <div className="testimonilas-text">
                                                <div className="testimonilas-text-item">
                                                    <h3>Jane Doe</h3>
                                                    <div className="star-rating" data-starrating="4"></div>
                                                    <p>"Vestibulum orci felis, ullamcorper non condimentum non, ultrices ac nunc. Mauris non ligula suscipit, vulputate mi accumsan, dapibus felis. Nullam sed sapien dui. Nulla auctor sit amet sem non porta."</p>
                                                    <a href="#" className="testi-link" target="_blank">Via hotels.com</a>
                                                </div>
                                                <span className="testi-number">02.</span>
                                                <div className="testi-item-dec fs-wrapper"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tcs-pagination tcs-pagination_init"></div>
                    </div>
                    <div className="content-dec2 fs-wrapper"></div>
                </div>
                {/* Testimonials Section end */}

                <div className="content-dec"><span></span></div>
            </div>
            {/* Content end */}
        </>
    )
}

export default About 