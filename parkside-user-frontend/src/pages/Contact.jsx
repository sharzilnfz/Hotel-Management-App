import { Link } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { ContentContext } from '../contexts/ContentContext'

const Contact = () => {
    // Get content from ContentContext
    const { footerContent, loading } = useContext(ContentContext)

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
            <div className="content-section parallax-section hero-section hidden-section" data-scrollax-parent="true">
                <div className="bg par-elem" data-bg="/src/assets/images/bg/1.jpg" data-scrollax="properties: { translateY: '30%' }"></div>
                <div className="overlay"></div>
                <div className="container">
                    <div className="section-title">
                        <h4>Enjoy your time in our Hotel with pleasure.</h4>
                        <h2>Our Contacts</h2>
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
                        <Link to="/">Home</Link><span>Contacts</span>
                    </div>
                </div>
                {/* Breadcrumbs end */}

                {/* Contact section */}
                <div className="content-section">
                    <div className="section-dec"></div>
                    <div className="content-dec2 fs-wrapper"></div>
                    <div className="container">
                        {/* Contact cards wrap */}
                        <div className="contacts-cards-wrap">
                            <div className="dec-container">
                                <div className="text-block">
                                    <div className="row">
                                        {/* Contact card item */}
                                        <div className="col-lg-4">
                                            <div className="contacts-card-item">
                                                <i className="fa-light fa-location-dot"></i>
                                                <span>Our Location</span>
                                                <p>Visit us at our convenient location in the heart of the city, easily accessible from major transportation routes.</p>
                                                <a href="#">{footerContent?.contactInfo?.address || "USA 27TH Brooklyn NY"}</a>
                                            </div>
                                        </div>
                                        {/* Contact card item end */}
                                        {/* Contact card item */}
                                        <div className="col-lg-4">
                                            <div className="contacts-card-item">
                                                <i className="fa-light fa-phone-rotary"></i>
                                                <span>Our Phone</span>
                                                <p>We're available 24/7 to assist with your inquiries and reservations. Feel free to call us anytime.</p>
                                                <a href={`tel:${footerContent?.contactInfo?.phone}`}>{footerContent?.contactInfo?.phone || "+489756412322"}</a>
                                            </div>
                                        </div>
                                        {/* Contact card item end */}
                                        {/* Contact card item */}
                                        <div className="col-lg-4">
                                            <div className="contacts-card-item">
                                                <i className="fa-light fa-mailbox"></i>
                                                <span>Our Mail</span>
                                                <p>For inquiries, feedback, or special requests, don't hesitate to reach out via email. We typically respond within 24 hours.</p>
                                                <a href={`mailto:${footerContent?.contactInfo?.email}`}>{footerContent?.contactInfo?.email || "info@parksideplaza.com"}</a>
                                            </div>
                                        </div>
                                        {/* Contact card item end */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Contact cards wrap end */}
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="dec-container">
                                    <div className="text-block">
                                        <div className="text-block">
                                            <div className="tbc_subtitle">Get In Touch</div>
                                            <div className="tbc-separator"></div>
                                            <div className="contactform-wrap">
                                                <form className="comment-form" id="contactform">
                                                    <fieldset>
                                                        <div id="message"></div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <input type="text" name="name" id="name" placeholder="Your Name *" value="" />
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <input type="text" name="email" id="email" placeholder="Email Address *" value="" />
                                                            </div>
                                                        </div>
                                                        <textarea name="comments" id="comments" cols="40" rows="3" placeholder="Your Message:"></textarea>
                                                        <button className="commentssubmit" id="submit_cnt">Send Message</button>
                                                    </fieldset>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="map-container mapC_vis">
                                    <div id="singleMap" className="fs-wrapper" data-latitude="40.7427837" data-longitude="-73.11445617">
                                        {/* Map placeholder until Google Maps is initialized */}
                                        <div className="map-placeholder">
                                            <div className="map-placeholder-text">
                                                Map will appear here.
                                                <br />
                                                Integration requires API key setup.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="scrollContorl"></div>
                                </div>
                            </div>
                        </div>
                        <div className="dc_dec-item_left"><span></span></div>
                        <div className="dc_dec-item_right"><span></span></div>
                    </div>
                </div>
                {/* Contact section end */}
                <div className="content-dec"><span></span></div>
            </div>
            {/* Content end */}
        </>
    )
}

export default Contact 