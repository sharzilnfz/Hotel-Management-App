import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ContentContext } from '../contexts/ContentContext'
import logo from '../assets/images/White Black Minimalist Mockup Paper Bag Coffee Instagram Post_20241222_202950_0000.png'
import logoBGLess from '../assets/images/BGLess.png'

const Footer = () => {
    // Get footer content from ContentContext
    const { navigationContent, footerContent, loading } = useContext(ContentContext)

    return (
        <>
            <div className="height-emulator"></div>
            <footer className="main-footer">
                <div className="footer-inner">
                    <div className="container">
                        {/* footer-widget-wrap */}
                        <div className="footer-widget-wrap">
                            <div className="footer-separator-wrap">
                                <div className="footer-separator"><span></span></div>
                            </div>
                            <div className="row">
                                {/* footer-widget */}
                                <div className="col-lg-3">
                                    <div className="footer-widget">
                                        <div className="footer-widget-title">About us</div>
                                        <div className="footer-widget-content">
                                            <p>{footerContent?.aboutText || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eaque ipsa quae ab illo inventore veritatis et quasi architecto. Consectetur adipiscing elit."}</p>
                                            <Link to="/about" className="footer-widget-content-link"><span>Read more</span></Link>
                                        </div>
                                    </div>
                                </div>
                                {/* footer-widget end */}
                                {/* footer-widget */}
                                <div className="col-lg-3">
                                    <div className="footer-widget">
                                        <div className="footer-widget-title">Contact info</div>
                                        <div className="footer-widget-content">
                                            <div className="footer-contacts footer-box">
                                                <ul>
                                                    {footerContent?.contactInfo ? (
                                                        <>
                                                            <li>
                                                                <span>Call :</span>
                                                                <a href={`tel:${footerContent.contactInfo.phone}`}>{footerContent.contactInfo.phone}</a>
                                                            </li>
                                                            <li>
                                                                <span>Write :</span>
                                                                <a href={`mailto:${footerContent.contactInfo.email}`}>{footerContent.contactInfo.email}</a>
                                                            </li>
                                                            <li>
                                                                <span>Find us : </span>
                                                                <a href="#">{footerContent.contactInfo.address}</a>
                                                            </li>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li><span>Call :</span><a href="#">+489756412322</a> , <a href="#">+56897456123</a></li>
                                                            <li><span>Write :</span><a href="#">yourmail@domain.com</a></li>
                                                            <li><span>Find us : </span><a href="#">USA 27TH Brooklyn NY</a></li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                            <Link to="/contact" className="footer-widget-content-link"><span>Get in Touch</span></Link>
                                        </div>
                                    </div>
                                </div>
                                {/* footer-widget end */}
                                {/* footer-widget */}
                                <div className="col-lg-2">
                                    <div className="footer-widget">
                                        <div className="footer-widget-title">Helpful links</div>
                                        <div className="footer-widget-content">
                                            <div className="footer-list footer-box">
                                                <ul>
                                                    {navigationContent?.footer ? (
                                                        navigationContent.footer
                                                            .sort((a, b) => a.order - b.order)
                                                            .map((item, index) => (
                                                                <li key={index}>
                                                                    <Link to={item.path}>{item.label}</Link>
                                                                </li>
                                                            ))
                                                    ) : (
                                                        <>
                                                            <li><Link to="/blog">Our last News</Link></li>
                                                            <li><Link to="/rooms">Rooms</Link></li>
                                                            <li><Link to="/contact">Contacts</Link></li>
                                                            <li><Link to="/about">About</Link></li>
                                                            <li><a href="#">Privacy Policy</a></li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* footer-widget end */}
                                {/* footer-widget */}
                                <div className="col-lg-4">
                                    <div className="footer-widget">
                                        <div className="footer-widget-title">Subscribe to our newsletter</div>
                                        <div className="footer-widget-content">
                                            <div className="subcribe-form fl-wrap">
                                                <p>Want to be notified about exclusive offers? Subscribe to our newsletter.</p>
                                                <form id="subscribe" className="fl-wrap">
                                                    <input className="enteremail" name="email" id="subscribe-email" placeholder="Your Email" spellCheck="false" type="text" />
                                                    <button type="submit" id="subscribe-button" className="subscribe-button">Send</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* footer-widget end */}
                            </div>
                        </div>
                        {/* footer-widget-wrap end */}
                    </div>
                </div>
                <div className="footer-social">
                    <div className="container">
                        <ul>
                            {footerContent?.socialMedia ? (
                                footerContent.socialMedia.map((social, index) => (
                                    <li key={index}>
                                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                                            <i className={social.icon || getDefaultSocialIcon(social.platform)}></i>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><a href="#" target="_blank"><i className="fa-brands fa-facebook-f"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa-brands fa-x-twitter"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa-brands fa-tiktok"></i></a></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <Link to="/" className="footer-logo"><img src={logoBGLess} alt="Parkside Hotel" /></Link>
                        <div className="copyright">{footerContent?.copyrightText || "© Parkside 2024. All rights reserved."}</div>
                        <div className="to-top">
                            <span>Back To Top </span>
                            <i className="fal fa-angle-double-up"></i>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

// Helper function to get default social media icons
const getDefaultSocialIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
        case 'facebook':
            return 'fa-brands fa-facebook-f';
        case 'twitter':
        case 'x':
            return 'fa-brands fa-x-twitter';
        case 'instagram':
            return 'fa-brands fa-instagram';
        case 'tiktok':
            return 'fa-brands fa-tiktok';
        case 'linkedin':
            return 'fa-brands fa-linkedin-in';
        case 'youtube':
            return 'fa-brands fa-youtube';
        case 'pinterest':
            return 'fa-brands fa-pinterest-p';
        default:
            return 'fa-brands fa-globe';
    }
};

export default Footer 